<script>
import stockCommButton from '@/components/stock/stockCommBtn.vue';
import stockCommRowBtn from '@/components/stock/stockCommRowBtn.vue';
import commModal from '@/components/stock/stockCommModal.vue';
import stockCommTable from '@/components/stock/stockCommTable.vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import 'primeicons/primeicons.css';
import axios from 'axios';

export default {
    components: { stockCommButton, commModal, stockCommRowBtn, Tabs, TabList, Tab, TabPanels, TabPanel, stockCommTable },
    data() {
        return {
            //검색input
            dueDate: '',
            testNumber: '',
            prdCode: '',
            prdName: '',

            //모달
            productModal: false,
            WarehouseModal: false,
            //(모달)선택된 제품
            selectPrd: null,
            selectWare: null,
            //모달용-테이블 행선택
            selectRow: null,

            //테이블 데이터 선택
            selectPendingPrds: [],
            selectPrdLots: [],
            //입고대기 테이블 컬럼
            pendingCol: [
                { field: 'p_dueDate', header: '입고예정일', headerStyle: 'width: 20rem' },
                { field: 'p_No', header: '검수번호', headerStyle: 'width: 18rem' },
                { field: 'p_prdType', header: '제품타입', headerStyle: 'width: 18rem' },
                { field: 'p_prdCode', header: '제품코드', headerStyle: 'width: 15rem' },
                { field: 'p_prdName', header: '제품명', headerStyle: 'width: 35rem', inputTextWM: true, onClick: this.rowOpenPrdModal },
                { field: 'p_testPassQty', header: '검수수량', headerStyle: 'width: 15rem' },
                { field: 'p_receiptQty', header: '입고수량', headerStyle: 'width: 15rem', inputNumber: true },
                { field: 'p_unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'p_exp', header: '유통기한', headerStyle: 'width: 20rem' },
                { field: 'p_warehouse', header: '보관창고', headerStyle: 'width: 20rem', inputTextWM: true, onClick: this.openWarehouseeModal }, //창고위치모달.
                { field: 'p_memo', header: '비고', headerStyle: 'width: 50rem', inputText: true }
            ],
            //제품입고대기 데이터
            prdReceiptPending: [],
            //입고완료 컬럼
            ReceiptCol: [
                { field: 'inDate', header: '입 고 일', headerStyle: 'width: 20rem' },
                { field: 'prdLotNo', header: '제품 LOT번호', headerStyle: 'width: 25rem' },
                { field: 'prdType', header: '제품타입', headerStyle: 'width: 15rem' },
                { field: 'prdCode', header: '제품코드', headerStyle: 'width: 12rem' },
                { field: 'prdName', header: '제품명', headerStyle: 'width: 20rem' },
                { field: 'receiptQty', header: '입고수량', headerStyle: 'width: 15rem' },
                { field: 'unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'warehouse', header: '보관창고', headerStyle: 'width: 20rem' },
                { field: 'empName', header: '담당자', headerStyle: 'width: 20rem' },
                { field: 'memo', header: '비고', headerStyle: 'width: 50rem' }
            ],
            //제품입고완료 데이터
            prdReceipt: []
        };
    },
    methods: {
        //초기화버튼
        onReset() {
            this.dueDate = '';
            this.testNumber = '';
            this.prdCode = '';
            this.prdName = '';
        },
        //조회버튼
        async onSearch() {
            try {
                // 검색조건 객체 생성
                const filters = {
                    due_date: this.dateFormat(this.dueDate) || null,
                    test_no: this.testNumber || null,
                    product_id: this.prdCode || null,
                    product_name: this.prdName || null
                };

                console.log(filters);

                const res = await axios.post('/api/stock/p', filters);
                //조회결과
                this.prdReceiptPending = res.data.map((item) => ({
                    id: `${item.inspection_id}-${item.product_id}`,
                    p_dueDate: item.inspection_date,
                    p_No: item.inspection_id,
                    p_prdType: item.product_type,
                    p_prdCode: item.product_id,
                    p_prdName: item.product_name,
                    p_testPassQty: item.qty,
                    p_unit: `${'EA'}`
                }));
            } catch (error) {
                console.error('조회 실패:', error);
            }
        },
        //행삭제버튼
        removeRow() {
            // 자재코드가 비어있는 행을 찾아서 한줄씩 삭제
            let index = this.prdReceiptPending.findIndex((row) => !row.p_testPassQty);

            if (index !== -1) {
                this.prdReceiptPending.splice(index, 1);
            } else {
                alert('삭제할 행이 없습니다.');
            }
        },
        //행추가버튼
        addNewRow() {
            let newRow = {
                id: `temp-${Date.now()}`,
                p_dueDate: '',
                p_No: '',
                p_prdType: '',
                p_prdCode: '',
                p_prdName: '',
                p_testPassQty: 0,
                p_receiptQty: 0,
                p_unit: '',
                p_exp: '',
                p_warehouse: '',
                p_memo: ''
            };
            this.prdReceiptPending.unshift(newRow);
        },
        //입고등록==========================================================================
        async postInsertPrd() {
            if (!this.selectPendingPrds.length) {
                alert('입고처리할 제품을 선택해주세요.');
                return;
            }

            // 필수값 체크
            let checkNull = this.selectPendingPrds.find((row) => {
                return !row.p_prdCode || !row.p_warehouse || !row.p_receiptQty;
            });

            if (checkNull) {
                alert('제품, 입고수량, 창고는 필수입니다.');
                return;
            }

            try {
                //정보담기 [자재코드, 최초수량, 보관장소, 담당자이름, 비고, 검수번호]
                let prdInfo = this.selectPendingPrds.map((row) => ({
                    product_id: row.p_prdCode,
                    init_qty: row.p_receiptQty,
                    warehouse: row.p_warehouse,
                    comm: row.p_memo || null,
                    inspection_id: row.p_No || null
                }));
                console.log(prdInfo);
                await axios.post('/api/stock/rePrdtLot', prdInfo);
            } catch (error) {
                console.log('입고등록실패', error);
            }
            alert('입고등록 완료');
            this.getPrdPendigList();
            this.getprdLotLIst();
            this.selectPendingPrds = [];
        },
        //입고취소
        async postCanelLot() {
            if (!this.selectPrdLots) {
                alert('입고가 확정된 자재만 취소가능합니다.');
                return;
            }
            console.log(this.selectPrdLots);
            try {
                let cancelLotInfo = this.selectPrdLots.map((row) => ({
                    prd_lot_no: row.prdLotNo
                }));
                await axios.post('/api/stock/prdLotCancel', cancelLotInfo);
            } catch (error) {
                console.lof('취소실패', error);
            }
            this.getprdLotLIst();
            this.selectPandingPrds = [];
        },
        //테이블===========================================================================================
        async getPrdPendigList() {
            try {
                const res = await axios.get('/api/stock/prdPendingList');
                this.prdReceiptPending = res.data.map((item) => ({
                    id: `${item.inspection_id}-${item.product_id}`,
                    p_dueDate: item.inspection_date,
                    p_No: item.inspection_id,
                    p_prdType: item.product_type,
                    p_prdCode: item.product_id,
                    p_prdName: item.product_name,
                    p_testPassQty: item.qty,
                    p_unit: `${'EA'}`
                }));
            } catch (error) {
                console.error('제품입고대기목록 불러오기 실패', error);
            }
        },
        //제품lot목록
        async getprdLotLIst() {
            try {
                const res = await axios.get('/api/stock/prdLotList');
                this.prdReceipt = res.data.map((item) => ({
                    id: `${item.prd_lot_no}-${item.product_id}`,
                    inDate: item.open_date,
                    prdLotNo: item.prd_lot_no,
                    prdType: item.product_type,
                    prdCode: item.product_id,
                    prdName: item.product_name,
                    receiptQty: item.init_qty,
                    unit: `${'EA'}`,
                    warehouse: item.warehouse,
                    empName: item.e_name,
                    memo: item.comm
                }));
            } catch (error) {
                console.error('제품LOT목록 불러오기 실패:', error);
            }
        },
        //모달===============================================================================================
        //(모달)제품=============
        openPrdModal() {
            //검색용
            this.productModal = true;
            this.getPrdList();
        },
        rowOpenPrdModal(rowIndex) {
            //테이블행용
            this.selectRow = rowIndex; // 클릭한 테이블 행 index
            this.productModal = true;
            this.getPrdList();
        },
        onSelectonSelectPrd() {
            if (this.selectRow !== null) {
                //선택시.
                this.prdReceiptPending[this.selectRow].p_prdType = this.selectPrd.prdType;
                this.prdReceiptPending[this.selectRow].p_prdCode = this.selectPrd.prdCode;
                this.prdReceiptPending[this.selectRow].p_prdName = this.selectPrd.prdName;
            } else {
                this.prdCode = this.selectPrd.prdCode;
                this.prdName = this.selectPrd.prdName;
            }
            this.selectPrd = [];
            this.selectRow = null;
            this.productModal = false;
        },
        //(모달)제품목록가지고오기
        async getPrdList() {
            try {
                const res = await axios.get('/api/stock/modalPrdList');
                console.log('제품응답:', res.data);
                this.products = res.data.map((item) => ({
                    prdCode: item.product_id,
                    prdType: item.product_type,
                    prdName: item.product_name,
                    unit: item.unit
                }));
            } catch (error) {
                console.error('제품목록 불러오기 실패:', error);
            }
        },
        //보관창고(모달) ========================================================================
        openWarehouseeModal(rowIndex) {
            console.log(rowIndex);
            this.selectRow = rowIndex;
            this.WarehouseModal = true;
            this.getWareList();
        },
        async getWareList() {
            try {
                const res = await axios.get('/api/stock/modalWareList');
                this.warehouses = res.data.map((item) => ({
                    wareCode: item.warehouse_id,
                    warerName: item.warehouse,
                    warerType: item.warehouse_type
                }));
            } catch (error) {
                console.error('창고목록 불러오기 실패:', error);
            }
        },
        onSelectWare() {
            this.prdReceiptPending[this.selectRow].p_warehouse = this.selectWare.warerName;
            this.WarehouseModal = false;
        }
    },
    mounted() {
        console.log('제품입고');
        this.getPrdPendigList();
        this.getprdLotLIst();
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">제품입고페이지</div>

        <stockCommButton @search="onSearch()" @reset="onReset()" />

        <div class="card w-full">
            <!--검색1열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 제품입고예정일 -->
                <div class="flex items-center gap-2">
                    <label for="dueDate" class="whitespace-nowrap">입고예정일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="dueDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 생산/검수번호 -->
                <div class="flex items-center gap-2">
                    <label for="testNumber" class="whitespace-nowrap">검수번호</label>
                    <InputText id="testNumber" type="text" class="w-60" v-model="testNumber" />
                </div>

                <!-- 제품코드 -->
                <div class="flex items-center gap-2">
                    <label for="prdCode" class="whitespace-nowrap">제품코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="prdCode" type="text" class="w-60" v-model="prdCode" />
                        <InputIcon class="pi pi-search" @click="openPrdModal" />
                    </IconField>
                </div>

                <!-- 제품명 -->
                <div class="flex items-center gap-2">
                    <label for="prdName" class="whitespace-nowrap">제품명</label>
                    <InputText id="prdName" type="text" class="w-60" v-model="prdName" />
                </div>
            </div>
        </div>

        <!--검색박스end-->
        <!--중간버튼-->
        <stockCommRowBtn
            :buttons="[
                { label: '입고등록', icon: 'pi pi-check', onClick: postInsertPrd },
                { label: '입고취소', icon: 'pi pi-trash', onClick: postCanelLot }
            ]"
        />

        <!--텝 테이블-->
        <div class="card w-full">
            <Tabs value="0">
                <TabList>
                    <Tab value="0">제품입고대기</Tab>
                    <Tab value="1">제품입고확정</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <div class="flex justify-end mt-0 space-x-2">
                            <Button icon="pi pi-plus" severity="success" rounded variant="outlined" @click="addNewRow" />
                            <Button icon="pi pi-minus" severity="success" rounded variant="outlined" @click="removeRow" />
                        </div>
                        <!--0번탭 컨텐츠영역-->
                        <stockCommTable v-model:selection="selectPendingPrds" :columns="pendingCol" :dataRows="prdReceiptPending" />
                    </TabPanel>
                    <TabPanel value="1">
                        <div class="flex justify-end mt-0 space-x-2 invisible">
                            <Button icon="pi pi-plus" severity="success" rounded variant="outlined" />
                            <Button icon="pi pi-minus" severity="success" rounded variant="outlined" />
                        </div>
                        <!--1번탭 컨텐츠영역-->
                        <stockCommTable v-model:selection="selectPrdLots" :columns="ReceiptCol" :dataRows="prdReceipt" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>

    <!--제품모달-->
    <commModal v-model="productModal" header="제품목록" style="width: 40rem">
        <DataTable v-model:selection="selectPrd" :value="products" dataKey="prdCode" tableStyle="min-width: 20rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="prdCode" header="제품코드" headerStyle="width: 10rem"></Column>
            <Column field="prdType" header="제품유형" headerStyle="width: 10em"></Column>
            <Column field="prdName" header="제품명" headerStyle="width: 10em"></Column>
        </DataTable>

        <!-- footer 슬롯 -->
        <template #footer>
            <div class="mt-5 flex justify-center">
                <Button label="선택 완료" @click="onSelectonSelectPrd" />
            </div>
        </template>
    </commModal>
    <!--보관장소 모달-->
    <commModal v-model="WarehouseModal" header="창고목록" style="width: 43rem">
        <DataTable v-model:selection="selectWare" :value="warehouses" dataKey="wareCode" tableStyle="min-width: 20rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="wareCode" header="창고코드" headerStyle="width: 10rem"></Column>
            <Column field="warerName" header="창고명" headerStyle="width: 10em"></Column>
            <Column field="warerType" header="창고유형" headerStyle="width: 10em"></Column>
        </DataTable>

        <!-- footer 슬롯 -->
        <template #footer>
            <div class="mt-5 flex justify-center">
                <Button label="선택 완료" @click="onSelectWare" />
            </div>
        </template>
    </commModal>
</template>
