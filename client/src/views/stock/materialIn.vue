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
            orderNumber: '',
            materialCode: '',
            materialName: '',
            MatInDate: '',
            MatLotNo: '',
            //모달
            materialModal: false,
            WarehouseModal: false,
            //모달data
            materials: [],
            warehouses: [],

            //(모달)선택된 자재
            selectMat: null,
            selectWare: null,

            //창고선택rowIdex
            selectRow: null,

            //선택행데이터
            selectPandingMats: null,
            selectMatLots: null,

            //입고대기 테이블 컬럼
            pandingCol: [
                { field: 'p_dueDate', header: '입고예정일', headerStyle: 'width: 20rem' },
                { field: 'p_purNo', header: '발주번호', headerStyle: 'width: 25rem' },
                { field: 'p_matCode', header: '자재코드', headerStyle: 'width: 12rem'},
                { field: 'p_matName', header: '자재명', headerStyle: 'width: 30rem', inputTextWM: true, onClick: this.rowOpenMatModal},
                { field: 'p_testResult', header: '검사결과', headerStyle: 'width: 13rem' },
                { field: 'p_testPassQty', header: '검수수량', headerStyle: 'width: 15rem' },
                { field: 'p_receiptQty', header: '입고수량', headerStyle: 'width: 15rem', inputNumber: true },
                { field: 'p_unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'p_partnerName', header: '공급처', headerStyle: 'width: 15rem' },
                { field: 'p_warehouse', header: '보관창고', headerStyle: 'width: 20rem', inputTextWM: true, onClick: this.openWarehouseeModal }, //창고위치모달.
                { field: 'p_memo', header: '비고', headerStyle: 'width: 50rem', inputText: true }
            ],
            //입고대기 데이터
            MatReceiptPanding: [],

            //입고등록 테이블 컬럼
            ReceiptCol: [
                { field: 'inDate', header: '입 고 일', headerStyle: 'width: 20rem' },
                { field: 'matLotNo', header: '자재 LOT번호', headerStyle: 'width: 25rem' },
                { field: 'matCode', header: '자재코드', headerStyle: 'width: 12rem' },
                { field: 'matName', header: '자재명', headerStyle: 'width: 20rem' },
                { field: 'receiptQty', header: '입고수량', headerStyle: 'width: 15rem' },
                { field: 'unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'warehouse', header: '보관창고', headerStyle: 'width: 20rem' },
                { field: 'empName', header: '담당자', headerStyle: 'width: 20rem' },
                { field: 'memo', header: '비고', headerStyle: 'width: 50rem' }
            ],
            //lot데이터
            MatReceipts: []
        };
    },
    methods: {
        //조회버튼
        //초기화버튼
        onReset() {
            this.dueDate = '';
            this.orderNumber = '';
            this.materialCode = '';
            this.materialName = '';
            this.MatInDate = '';
            this.MatLotNo = '';
        },
        //테이블 영역==================================================
        //입고대기
            addNewRow() {
            let newRow = {
                id: `temp-${Date.now()}`,
                p_dueDate: '',
                p_purNo: '',
                p_matCode: '',
                p_matName: '',
                p_testResult: '',
                p_testPassQty: 0,
                p_receiptQty: 0,
                p_unit: '',
                p_partnerName: '',
                p_warehouse: '',
                p_memo: '',
                p_testNo: '',
                p_purchId: '',
                isNew: true
            };
            this.MatReceiptPanding.unshift(newRow);
        },
        async getMatPandigList() {
            try {
                const res = await axios.get('/api/stock/matPandingList');
                this.MatReceiptPanding = res.data.map((item) => ({
                    id: `${item.pur_no}-${item.material_code}`,
                    p_dueDate: item.due_date,
                    p_purNo: item.pur_no,
                    p_matCode: item.material_code,
                    p_matName: item.material_name,
                    p_testResult: item.result,
                    p_testPassQty: item.qty,
                    p_unit: item.unit,
                    p_partnerName: item.partner_name,
                    p_testNo: item.materialOrder_num,
                    p_purchId: item.purch_id //발주서브T고유번호
                }));
            } catch (error) {
                console.error('자재입고대기목록 불러오기 실패', error);
            }
        },
        test() {
            console.log(this.selectPandingMats);
        },
        //입고등록
        async postInsertMat() {
             if (this.selectPandingMats == null) {
                alert('입고처리할 자재를 선택해주세요.');
                return;
             }

               // 필수값 체크: p_matCode, p_receiptQty, p_warehouse
            let checkNull = this.selectPandingMats.find(row => {
                return !row.p_matCode || !row.p_warehouse || row.p_receiptQty == null;
            });

            if (checkNull) {
                alert('자재, 입고수량, 창고는 필수입니다.');
                return;
            }

            try {
                //정보담기 [자재코드, 최초수량, 보관장소, 담당자이름, 비고, 검수번호]
                let purInfo = this.selectPandingMats.map((row) => ({
                    material_id: row.p_matCode,
                    init_qty: row.p_receiptQty,
                    warehouse: row.p_warehouse,
                    comm: row.p_memo,
                    materialOrder_num: row.p_testNo,
                    purch_id: row.p_purchId
                }));
                console.log(purInfo);
                await axios.post('/api/stock/reMatLot', purInfo);
            } catch (error) {
                console.log('입고등록실패', error);
            }
            alert('입고등록 완료');
        },
        //입고처리목록들
        async getMatLotLIst() {
            try {
                const res = await axios.get('/api/stock/matLotList');
                this.MatReceipts = res.data.map((item) => ({
                    id: `${item.lot_no}-${item.material_id}`,
                    inDate: item.open_date,
                    matLotNo: item.lot_no,
                    matCode: item.material_id,
                    matName: item.material_name,
                    receiptQty: item.init_qty,
                    unit: item.unit,
                    warehouse: item.warehouse,
                    memo: item.comm
                }));
            } catch (error) {
                console.error('자재LOT목록 불러오기 실패:', error);
            }
        },
        //반품
        async postReject() {
            if (!this.selectPandingMats) {
                alert('입고대기중인 자재만 반품가능합니다.');
                return;
            }
            try {
                let rejecgInfo = this.this.selectPandingMats.map((row) => ({
                    purch_id: row.p_purchId
                }));
                await axios.post('/api/stock/matReturn', rejecgInfo);
            } catch (error) {
                console.lof('반품실패', error);
            }
            this.getMatPandigList();
            },
        //입고취소
        async postCanelLot() {
            if (!this.selectMatLots) {
                alert('입고가 확정된 자재만 취소가능합니다.');
                return;
            } 
            try {
                let cancelLotInfo = this.selectMatLots.map((row) => ({
                    lot_no: row.matLotNo
                }));
                await axios.post('/api/stock/matLotCancel', cancelLotInfo);
            } catch (error) {
                console.lof('취소실패', error);
            }
            
            this.getMatPandigList();
        },
        //모달==============================================================================
        //(모달)자재
        openMatModal() {
            this.materialModal = true;
            this.getMatList();
        },
        onSelectMat() {
            if (this.selectRow !== null) {
                this.MatReceiptPanding[this.selectRow].p_matCode = this.selectMat.matCode;
                this.MatReceiptPanding[this.selectRow].p_matName = this.selectMat.matName;
            }else{
                //(모달)자재선택시 반영.
                this.materialCode = this.selectMat.matCode;
                this.materialName = this.selectMat.matName;
            }

            this.materialModal = false;
        },
        //(모달)자재목록가지고오기
        async getMatList() {
            try {
                const res = await axios.get('/api/stock/modalMatList');
                this.materials = res.data.map((item) => ({
                    matCode: item.material_id,
                    matName: item.material_name,
                    unit: item.unit
                }));
            } catch (error) {
                console.error('자재목록 불러오기 실패:', error);
            }
        },
        rowOpenMatModal(rowIndex){
            this.selectRow = rowIndex; // 클릭한 테이블 행 index
            this.materialModal = true;
            this.getMatList();
        },
        //보관창고(모달) ===========
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
            this.MatReceiptPanding[this.selectRow].p_warehouse = this.selectWare.warerName;
            this.WarehouseModal = false;
        }
    },
    mounted() {
        console.log('자재입고');
        this.getMatPandigList();
        this.getMatLotLIst();
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">자재입고페이지</div>

        <stockCommButton @search="onSearch()" @reset="onReset()" />

        <div class="card w-full">
            <!--검색1열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 등록일 -->
                <div class="flex items-center gap-2">
                    <label for="dueDate" class="whitespace-nowrap">입고예정일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="dueDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 발주번호 -->
                <div class="flex items-center gap-2">
                    <label for="orderNumber" class="whitespace-nowrap">발주번호</label>
                    <InputText id="orderNumber" type="text" class="w-60" v-model="orderNumber" />
                </div>

                <!-- 자재코드 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">자재코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="materialCode" type="text" class="w-60" v-model="materialCode" @click="openMatModal()" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 자재명 -->
                <div class="flex items-center gap-2">
                    <label for="materialName" class="whitespace-nowrap">자재명</label>
                    <InputText id="materialName" type="text" class="w-60" v-model="materialName" />
                </div>
            </div>
            <!--end 검색1열-->

            <!--검색2열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 등록일 -->
                <div class="flex items-center gap-2">
                    <label for="MatInDate" class="whitespace-nowrap">입 고 일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="MatInDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 발주번호 -->
                <div class="flex items-center gap-2">
                    <label for="MatLotNo" class="whitespace-nowrap">LOT번호</label>
                    <InputText id="MatLotNo" type="text" class="w-60" v-model="MatLotNo" />
                </div>

                <!-- 간격맞춤 -->
                <div class="flex items-center gap-2 invisible">
                    <label for="materialCode" class="whitespace-nowrap">====</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="materialCode" type="text" class="w-60" v-model="materialCode" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
                <!-- 간격맞춤 -->
                <div class="flex items-center gap-2 invisible">
                    <label for="materialName" class="whitespace-nowrap">====</label>
                    <InputText id="materialName" type="text" class="w-60" v-model="materialName" />
                </div>
            </div>
        </div>
        <!--중간버튼-->
        <stockCommRowBtn
            :buttons="[
                { label: '입고등록', icon: 'pi pi-check', onClick: postInsertMat },
                { label: '신규', icon: 'pi pi-plus', onClick: addNewRow },
                { label: '반품', icon: 'pi pi-box', onClick: postReject },
                { label: '입고취소', icon: 'pi pi-trash', onClick: postCanelLot }
            ]"
        />

        <!--텝 테이블-->
        <div class="card w-full">
            <Tabs value="0">
                <TabList>
                    <Tab value="0">자재입고대기</Tab>
                    <Tab value="1">자재입고확정</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <!--0번탭 컨텐츠영역-->
                        <stockCommTable v-model:selection="selectPandingMats" :columns="pandingCol" :dataRows="MatReceiptPanding" />
                    </TabPanel>
                    <TabPanel value="1">
                        <!--1번탭 컨텐츠영역-->
                        <stockCommTable v-model:selection="selectMatLots" :columns="ReceiptCol" :dataRows="MatReceipts" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>

    <!--자재모달-->
    <commModal v-model="materialModal" :value="materials" header="자재목록" style="width: 40rem">
        <div class="mt-5 mb-4 space-x-2">
            <label for="matCode">자재코드</label>
            <InputText id="matCode" type="text" />
            <label for="matrName">자재명</label>
            <InputText id="matrName" type="text" />
            <Button label="검색" />
        </div>
        <DataTable v-model:selection="selectMat" :value="materials" dataKey="matCode" tableStyle="min-width: 20rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="matCode" header="자재코드" headerStyle="width: 10rem"></Column>
            <Column field="matName" header="자재명" headerStyle="width: 10em"></Column>
        </DataTable>

        <!-- footer 슬롯 -->
        <template #footer>
            <div class="mt-5 flex justify-center">
                <Button label="선택 완료" @click="onSelectMat()" />
            </div>
        </template>
    </commModal>

    <!--보관장소 모달-->
    <commModal v-model="WarehouseModal" header="창고목록" style="width: 43rem">
        <div class="mt-5 mb-4 space-x-2">
            <label for="wareCode">창고코드</label>
            <InputText id="wareCode" type="text" />
            <label for="wareName">창고명</label>
            <InputText id="warerName" type="text" />
            <Button label="검색" />
        </div>
        <DataTable v-model:selection="selectWare" :value="warehouses" dataKey="wareCode" tableStyle="min-width: 20rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="wareCode" header="창고코드" headerStyle="width: 10rem"></Column>
            <Column field="warerName" header="창고명" headerStyle="width: 10em"></Column>
            <Column field="warerType" header="창고유형" headerStyle="width: 10em"></Column>
        </DataTable>

        <!-- footer 슬롯 -->
        <template #footer>
            <div class="mt-5 flex justify-center">
                <Button label="선택 완료" @click="onSelectWare()" />
            </div>
        </template>
    </commModal>
</template>