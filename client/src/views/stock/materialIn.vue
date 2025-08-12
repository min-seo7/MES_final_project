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

            //입고대기 테이블 컬럼
            pandingCol: [
                { field: 'dueDate', header: '입고예정일', headerStyle: 'width: 20rem' },
                { field: 'purNo', header: '발주번호', headerStyle: 'width: 18rem' },
                { field: 'matCode', header: '자재코드', headerStyle: 'width: 20rem' },
                { field: 'matName', header: '자재명', headerStyle: 'width: 13rem' },
                { field: 'testResult', header: '검사결과', headerStyle: 'width: 13rem' },
                { field: 'testPassQty', header: '검수수량', headerStyle: 'width: 15rem' },
                { field: 'receiptQty', header: '입고수량', headerStyle: 'width: 15rem', inputNumber: true },
                { field: 'unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'partnerName', header: '공급처', headerStyle: 'width: 15rem' },
                { field: 'warehouse', header: '보관창고', headerStyle: 'width: 20rem', inputTextWM: true, onClick: this.openWarehouseeModal }, //창고위치모달.
                { field: 'memo', header: '비고', headerStyle: 'width: 50rem', inputText: true }
            ],
            //입고대기 데이터
            MatReceiptPanding: [
                {
                    dueDate: '2025-08-15',
                    purNo: 'PO20250811001',
                    matCode: 'MAT001',
                    matName: '왕겨',
                    testResult: '합격',
                    testPassQty: 100,
                    receiptQty: '',
                    unit: 'KG',
                    partnerName: '왕겨상회',
                    warehouse: '',
                    memo: ''
                },
                {
                    dueDate: '2025-08-16',
                    purNo: 'PO20250811002',
                    matCode: 'MAT002',
                    matName: '쌀겨',
                    testResult: '불합격',
                    testPassQty: 0,
                    receiptQty: '',
                    unit: 'KG',
                    partnerName: '쌀겨가게',
                    warehouse: '',
                    memo: ''
                }
            ],

            //입고등록 테이블 컬럼
            ReceiptCol: [
                { field: 'inDate', header: '입 고 일', headerStyle: 'width: 20rem' },
                { field: 'matLotNo', header: '자재 Lot번호', headerStyle: 'width: 25rem' },
                { field: 'matCode', header: '자재코드', headerStyle: 'width: 20rem' },
                { field: 'matName', header: '자재명', headerStyle: 'width: 20rem' },
                { field: 'receiptQty', header: '입고수량', headerStyle: 'width: 15rem' },
                { field: 'unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'partnerName', header: '공급처', headerStyle: 'width: 15rem' },
                { field: 'warehouse', header: '보관창고', headerStyle: 'width: 20rem'},
                { field: 'empName', header: '담당자', headerStyle: 'width: 20rem' },
                { field: 'memo', header: '비고', headerStyle: 'width: 50rem' }
            ]
        };
    },
    methods: {
        //초기화버튼
        onReset() {
            this.dueDate = '';
            this.orderNumber = '';
            this.materialCode = '';
            this.materialName = '';
            this.MatInDate = '';
            this.MatLotNo = '';
        },
        //모달==============================================================================
        //(모달)자재
        openMatModal() {
            this.materialModal = true;
            this.getMatList();
        },
        onSelectMat() {
            //(모달)자재선택시 반영.
            this.materialCode = this.selectMat.matCode;
            this.materialName = this.selectMat.matName;

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
        //보관창고(모달) ===========
        openWarehouseeModal(rowIndex){
            console.log(rowIndex);
            this.selectRow = rowIndex;
            this.WarehouseModal = true;
            this.getWareList();
        },
        async getWareList(){
            try {
                const res = await axios.get('/api/stock/modalWareList');
                this.warehouses = res.data.map((item) =>({
                    wareCode: item.warehouse_id,
                    warerName: item.warehouse,
                    warerType: item.warehouse_type,  
                }));
            } catch(error) {
                console.error('창고목록 불러오기 실패:', error);
            }
        },
        onSelectWare(){
            this.MatReceiptPanding[this.selectRow].warehouse = this.selectWare.warerName;
            this.WarehouseModal = false;
        },
    },
    mounted() {
        console.log('자재입고');
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
                { label: '입고등록', icon: 'pi pi-check', onClick: editHandler },
                { label: '신규', icon: 'pi pi-plus', onClick: deleteHandler },
                { label: '반품', icon: 'pi pi-box', onClick: deleteHandler },
                { label: '수정', icon: 'pi pi-pencil', onClick: deleteHandler },
                { label: '입고취소', icon: 'pi pi-trash', onClick: deleteHandler }
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
                        <stockCommTable v-model="MatReceiptPanding" :columns="pandingCol" :dataRows="MatReceiptPanding" />
                    </TabPanel>
                    <TabPanel value="1">
                        <!--1번탭 컨텐츠영역-->
                        <stockCommTable v-model="MatReceipt" :columns="ReceiptCol" />
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
