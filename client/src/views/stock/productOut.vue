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
            partnerModal: false,

            //(모달)선택된 제품
            selectPrd: null,
            selectPartner: null,

            //모달용-테이블 행선택
            selectRow: null,

            //테이블 선택데이터
            selectOutWaitPrds: null,
            selectOutPrds: null,

            //출고대기 테이블 컬럼
            outWaitPrdsCol: [
                { field: 'w_dueDate', header: '출고요청일', headerStyle: 'width: 20rem' },
                { field: 'w_shipmentId', header: '출하지시번호', headerStyle: 'width: 25rem' },
                { field: 'w_prdType', header: '제품유형', headerStyle: 'width: 15rem' },
                { field: 'w_prdCode', header: '제품코드', headerStyle: 'width: 15rem' },
                { field: 'w_prdName', header: '제품명', headerStyle: 'width: 30rem', inputTextWM: true, onClick: this.rowOpenPrdModal },
                { field: 'w_reqQty', header: '요청수량', headerStyle: 'width: 15rem' },
                { field: 'w_outQty', header: '출고수량', headerStyle: 'width: 15rem', inputNumber: true },
                { field: 'w_unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'w_partnerName', header: '거래처', headerStyle: 'width: 15rem' },
                { field: 'w_shipEnt', header: '배송업체', headerStyle: 'width: 20rem', inputTextWM: true, onClick: this.openPatenrModal }, //거래처모달.
                { field: 'w_memo', header: '비고', headerStyle: 'width: 45rem', inputText: true }
            ],
            //출고대기 데이터
            outWaitPrds: [],

            //출고처리 테이블컬럼
            outPrdCol: [
                { field: 'outDate', header: '출고일', headerStyle: 'width: 20rem' },
                { field: 'shipNo', header: '출고번호', headerStyle: 'width: 25rem' },
                { field: 'prdCode', header: '제품코드', headerStyle: 'width: 20rem' },
                { field: 'prdName', header: '제품명', headerStyle: 'width: 13rem' },
                { field: 'outQty', header: '출고수량', headerStyle: 'width: 13rem' },
                { field: 'unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'partnerName', header: '거래처', headerStyle: 'width: 15rem' },
                { field: 'e_name', header: '담당자', headerStyle: 'width: 15rem' },
                { field: 'shipEnt', header: '배송업체', headerStyle: 'width: 15rem' },
                { field: 'memo', header: '비고', headerStyle: 'width: 50rem' }
            ],
            //출고처리 데이터
            outPrds: []
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
                    shipment_date: this.dateFormat(this.dueDate) || null,
                    shipment_id: this.testNumber || null,
                    product_code: this.prdCode || null,
                    product_name: this.prdName || null
                };

                console.log(filters);

                const res = await axios.post('/api/stock/productOutSearch', filters);
                //조회결과
                this.outWaitPrds = res.data.map((item) => ({
                    id: `${item.shipment_id}-${item.product_code}`,
                    w_dueDate: item.shipment_date,
                    w_shipmentId: item.shipment_id,
                    w_prdType: item.product_type,
                    w_prdCode: item.product_code,
                    w_prdName: item.product_name,
                    w_reqQty: item.shipment_qty,
                    w_partnerName: item.partner_name,
                    w_unit: `${'EA'}`
                }));
            } catch (error) {
                console.error('조회 실패:', error);
            }
        },
        //중간버튼영역================================================================
        addNewRow() {
            let newRow = {
                id: `temp-${Date.now()}`,
                w_shipmentId: '',
                w_prdType: '',
                w_prdCode: '',
                w_prdName: '',
                w_reqQty: '',
                w_outQty: '',
                w_unit: '',
                w_partnerName: '',
                w_shipEnt: '',
                w_memo: ''
            };
            this.outWaitPrds.unshift(newRow);
        },
        removeRow() {
            //제품코드가 비어있는 행을 찾아서 한줄씩 삭제
            let index = this.outWaitPrds.findIndex((row) => !row.w_prdCode);

            if (index !== -1) {
                this.outWaitPrds.splice(index, 1);
            } else {
                alert('삭제할 행이 없습니다.');
            }
        },
        //테이블영역=====================================================================
        //출고대기목록
        async getoutPrds() {
            try {
                const res = await axios.get('/api/stock/prdWOutList');
                this.outWaitPrds = res.data.map((item) => ({
                    id: `${item.shipment_id}-${item.product_code}`,
                    w_dueDate: item.shipment_date,
                    w_shipmentId: item.shipment_id,
                    w_prdType: item.product_type,
                    w_prdCode: item.product_code,
                    w_prdName: item.product_name,
                    w_reqQty: item.shipment_qty,
                    w_partnerName: item.partner_name,
                    w_unit: `${'EA'}`
                }));
            } catch (error) {
                console.error('제품출고대기 불러오기 실패:', error);
            }
        },
        //모달============================================================================================
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
                this.outWaitPrds[this.selectRow].w_prdCode = this.selectPrd.prdCode;
                this.outWaitPrds[this.selectRow].w_prdName = this.selectPrd.prdName;
            } else {
                this.prdCode = this.selectPrd.prdCode;
                this.prdName = this.selectPrd.prdName;
            }
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
        //(모달)거래처=============
        async getPartnerList() {
            try {
                const res = await axios.get('/api/stock/modalPartnerList');
                this.partners = res.data.map((item) => ({
                    partnerType: item.partner_type,
                    partnerId: item.partner_id,
                    partnerName: item.partner_name
                }));
            } catch (error) {
                console.error('거래처목록 불러오기 실패:', error);
            }
        },
        openPatenrModal(rowIndex) {
            this.selectRow = rowIndex;
            this.partnerModal = true;
            this.getPartnerList();
        },
        onSelecPartner() {
            this.outWaitPrds[this.selectRow].w_shipEnt = this.selectPartner.partnerName;
            this.partnerModal = false;
        },
        //날짜포멧
        dateFormat(date) {
            if (!date || isNaN(new Date(date).getTime())) return null;
            let newDateFormat = new Date(date);
            return newDateFormat.getFullYear() + '-' + String(newDateFormat.getMonth() + 1).padStart(2, '0') + '-' + String(newDateFormat.getDate()).padStart(2, '0');
        }
    },
    mounted() {
        console.log('제품출고');
        this.getoutPrds();
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">제품출고페이지</div>

        <stockCommButton @search="onSearch()" @reset="onReset()" />

        <div class="card w-full">
            <!--검색1열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 제품입고예정일 -->
                <div class="flex items-center gap-2">
                    <label for="dueDate" class="whitespace-nowrap">출고요청일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="dueDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 생산/검수번호 -->
                <div class="flex items-center gap-2">
                    <label for="testNumber" class="whitespace-nowrap">출하지시번호</label>
                    <InputText id="testNumber" type="text" class="w-60" v-model="testNumber" />
                </div>

                <!-- 제품코드 -->
                <div class="flex items-center gap-2">
                    <label for="prdCode" class="whitespace-nowrap">제품코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="prdCode" type="text" class="w-60" v-model="prdCode" @click="openPrdModal()" />
                        <InputIcon class="pi pi-search" />
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
                { label: '출고등록', icon: 'pi pi-check', onClick: editHandler },
                { label: '출고취소', icon: 'pi pi-trash', onClick: postCanelLot }
            ]"
        />

        <!--텝 테이블-->
        <div class="card w-full">
            <Tabs value="0">
                <TabList>
                    <Tab value="0">제품출고대기</Tab>
                    <Tab value="1">제품출고확정</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <div class="flex justify-end mt-0 space-x-2">
                            <Button icon="pi pi-plus" severity="success" rounded variant="outlined" @click="addNewRow" />
                            <Button icon="pi pi-minus" severity="success" rounded variant="outlined" @click="removeRow" />
                        </div>
                        <!--0번탭 컨텐츠영역-->
                        <stockCommTable v-model:selection="selectOutWaitPrds" :columns="outWaitPrdsCol" :dataRows="outWaitPrds" />
                    </TabPanel>
                    <TabPanel value="1">
                        <div class="flex justify-end mt-0 space-x-2 invisible">
                            <Button icon="pi pi-plus" severity="success" rounded variant="outlined" />
                            <Button icon="pi pi-minus" severity="success" rounded variant="outlined" />
                        </div>
                        <!--1번탭 컨텐츠영역-->
                        <stockCommTable v-modelselection="selectOutPrds" :columns="outPrdCol" :dataRows="outPrds" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>

    <!--제품모달-->
    <commModal v-model="productModal" header="제품목록" style="width: 50rem">
        <div class="mt-5 mb-4 space-x-2">
            <label for="prdCode">제품코드</label>
            <InputText id="prdCode" type="text" />
            <label for="prdName">제품명</label>
            <InputText id="prdName" type="text" />
            <Button label="검색" />
        </div>
        <DataTable v-model:selection="selectPrd" :value="products" dataKey="prdCode" tableStyle="min-width: 20rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="prdType" header="제품유형" Style="width: 5rem"></Column>
            <Column field="prdCode" header="제품코드" Style="width: 5rem"></Column>
            <Column field="prdName" header="제품명" Style="width: 10em"></Column>
        </DataTable>

        <!-- footer 슬롯 -->
        <template #footer>
            <div class="mt-5 flex justify-center">
                <Button label="선택 완료" @click="onSelectonSelectPrd" />
            </div>
        </template>
    </commModal>

    <!--거래처모달-->
    <commModal v-model="partnerModal" header="거래처목록">
        <div class="mt-5 mb-4 space-x-2">
            <label for="partnerId">거래처코드</label>
            <InputText id="partnerId" type="text" />
            <label for="partnerName">거래처명</label>
            <InputText id="partnerName" type="text" />
            <Button label="검색" />
        </div>
        <!--v-model:selection는 선택행을 selectPartner 변수에 넣어줌.-->
        <DataTable v-model:selection="selectPartner" :value="partners" dataKey="partnerId" tableStyle="min-width: 40rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="partnerType" header="거래처유형"></Column>
            <Column field="partnerId" header="거래처코드"></Column>
            <Column field="partnerName" header="거래처명"></Column>
            <Column field="memo" header="비고"></Column>
        </DataTable>

        <!-- footer 슬롯 -->
        <template #footer>
            <div class="mt-5 flex justify-center">
                <!--commModal 컴포넌트 안의 <slot name="footer"> 영역에 여기서 작성한 버튼 내용을 삽입하겠다는 의미-->
                <Button label="선택 완료" @click="onSelecPartner" />
            </div>
        </template>
    </commModal>
</template>
