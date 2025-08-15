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
            prdInDate: '',
            prdLotNo: '',
            //모달
            productModal: false,
            //(모달)선택된 제품
            selectPrd: null,
            //모달용-테이블 행선택
            selectRow: null,
            //테이블 데이터 선택 
            selectPandingPrds: null,
            selectPrdLots: null,
           //입고대기 테이블 컬럼
            pandingCol: [
                { field: 'p_dueDate', header: '입고예정일', headerStyle: 'width: 20rem' },
                { field: 'p_No', header: '생산번호', headerStyle: 'width: 25rem' },
                { field: 'p_prdType', header: '제품타입', headerStyle: 'width: 15rem'},
                { field: 'p_prdCode', header: '제품코드', headerStyle: 'width: 15rem'},
                { field: 'p_prdName', header: '제품명', headerStyle: 'width: 30rem', inputTextWM: true, onClick: this.rowOpenPrdModal},
                { field: 'p_testPassQty', header: '검수수량', headerStyle: 'width: 15rem' },
                { field: 'p_receiptQty', header: '입고수량', headerStyle: 'width: 15rem', inputNumber: true },
                { field: 'p_unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'p_exp', header: '유통기한', headerStyle: 'width: 50rem' },
                { field: 'p_warehouse', header: '보관창고', headerStyle: 'width: 20rem', inputTextWM: true, onClick: this.openWarehouseeModal }, //창고위치모달.
                { field: 'p_memo', header: '비고', headerStyle: 'width: 50rem', inputText: true }
            ],
            //제품입고대기 데이터
            prdReceiptPanding: [],
            //입고완료 컬럼
            ReceiptCol: [
                { field: 'inDate', header: '입 고 일', headerStyle: 'width: 20rem' },
                { field: 'prdLotNo', header: '제품 LOT번호', headerStyle: 'width: 25rem' },
                { field: 'prdCode', header: '제품코드', headerStyle: 'width: 12rem' },
                { field: 'prdName', header: '제품명', headerStyle: 'width: 20rem' },
                { field: 'receiptQty', header: '입고수량', headerStyle: 'width: 15rem' },
                { field: 'unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'warehouse', header: '보관창고', headerStyle: 'width: 20rem' },
                { field: 'empName', header: '담당자', headerStyle: 'width: 20rem' },
                { field: 'memo', header: '비고', headerStyle: 'width: 50rem' }
            ],
            //제품입고완료 데이터
            prdReceipt: [],
        };
    },
    methods: {
        //초기화버튼
        onReset() {
            this.dueDate = '';
            this.testNumber = '';
            this.prdCode = '';
            this.prdName = '';
            this.prdInDate = '';
            this.prdLotNo = '';
        },
        //행삭제버튼
        removeRow() {
            // 자재코드가 비어있는 행을 찾아서 한줄씩 삭제 
            let index = this.prdReceiptPanding.findIndex(row => !row.p_prdCode);

            if (index !== -1) {
                this.prdReceiptPanding.splice(index, 1);
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
                p_memo: '',
            };
            this.prdReceiptPanding.unshift(newRow);
        },
        //테이블===========================================================================================

        //모달===============================================================================================
               //(모달)제품=============
        openPrdModal() { //검색용
            this.productModal = true;
            this.getPrdList();
        },
        rowOpenPrdModal(rowIndex){ //테이블행용
            this.selectRow = rowIndex; // 클릭한 테이블 행 index
            this.productModal = true;
            this.getPrdList();
        },
        onSelectonSelectPrd() {
            if (this.selectRow !== null) { //선택시.
                this.prdReceiptPanding[this.selectRow].p_prdCode = this.selectPrd.prdCode;
                this.prdReceiptPanding[this.selectRow].p_prdName = this.selectPrd.prdName;
            }else{
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
            this.MatReceiptPanding[this.selectRow].p_warehouse = this.selectWare.warerName;
            this.WarehouseModal = false;
        }

    },
    mounted() {
        console.log('제품입고');

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
            <!--end 검색1열-->

            <!--검색2열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 등록일 -->
                <div class="flex items-center gap-2">
                    <label for="prdInDate" class="whitespace-nowrap">입 고 일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="MatInDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 제품LOT번호 -->
                <div class="flex items-center gap-2">
                    <label for="prdLotNo" class="whitespace-nowrap">LOT번호</label>
                    <InputText id="prdLotNo" type="text" class="w-60" v-model="prdLotNo" />
                </div>

                <!-- 간격맞춤 -->
                <div class="flex items-center gap-2 invisible">
                    <label for="materialCode" class="whitespace-nowrap">=====</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="materialCode" type="text" class="w-60" v-model="materialCode" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
                <!-- 간격맞춤 -->
                <div class="flex items-center gap-2 invisible">
                    <label for="materialName" class="whitespace-nowrap">=====</label>
                    <InputText id="materialName" type="text" class="w-60" v-model="materialName" />
                </div>
            </div>
        </div>

        <!--검색박스end-->
        <!--중간버튼-->
        <stockCommRowBtn
            :buttons="[
                { label: '입고등록', icon: 'pi pi-check', onClick: editHandler },
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
                      <div class ="flex justify-end mt-0 space-x-2">
                        <Button icon="pi pi-plus"  severity="success" rounded variant="outlined"  @click="addNewRow" />
                        <Button icon="pi pi-minus"  severity="success" rounded variant="outlined"  @click="removeRow" />
                      </div>
                        <!--0번탭 컨텐츠영역-->
                      <stockCommTable v-model:selection="selectPandingPrds" :columns="pandingCol" :dataRows="prdReceiptPanding"/>
                     
                    </TabPanel>
                    <TabPanel value="1">
                        <div class ="flex justify-end mt-0 space-x-2 invisible">
                            <Button icon="pi pi-plus"  severity="success" rounded variant="outlined"  />
                            <Button icon="pi pi-minus"  severity="success" rounded variant="outlined"  />
                        </div>
                        <!--1번탭 컨텐츠영역-->
                        <stockCommTable v-model:selection="selectPrdLots" :columns="ReceiptCol" :dataRows="prdReceipt"/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>

    <!--자재모달-->
    <commModal v-model="productModal" header="제품목록" style="width: 40rem">
        <div class="mt-5 mb-4 space-x-2">
            <label for="prdCode">제품코드</label>
            <InputText id="prdCode" type="text" />
            <label for="prdName">제품명</label>
            <InputText id="prdName" type="text" />
            <Button label="검색" />
        </div>
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
