<!--제품조회-->
<script>
import stockCommButton from '@/components/stock/stockCommBtn.vue';
import commModal from '@/components/stock/stockCommModal.vue';
import axios from 'axios';

export default {
    components: { stockCommButton, commModal },
    data() {
        return {
            //검색박스
            prdLotNo: '',
            prdCode: '',
            prdName: '',
            warehouse: '',
            //모달
            productModal: false,
            WarehouseModal: false,
            products: [],
            warehouses: [],
            //(모달)선택된 제품
            selectPrd: [],
            selectWare: [],

            prdLotList: []
        };
    },
    methods: {
        //초기화
        onReset() {
            this.prdLotNo = '';
            this.prdCode = '';
            this.prdName = '';
            this.warehouse = '';
            this.getPrdSearchList();
        },
        //조회
        async onSearch() {
            try {
                // 검색조건 객체 생성
                const filters = {
                    prdLotNo: this.prdLotNo || null,
                    prdCode: this.prdCode || null,
                    prdName: this.prdName || null,
                    warehouse: this.warehouse || null
                };

                console.log(filters);

                const res = await axios.post('/api/stock/searchPrdLotList', filters);
                //조회결과
                this.prdLotList = res.data.map((item) => ({
                    id: `${item.prd_lot_no}-${item.product_id}`,
                    reDate: item.open_date,
                    prdNo: item.prd_lot_no,
                    prdType: item.product_type,
                    prdCode: item.product_id,
                    prdName: item.product_name,
                    prdQty: item.curr_qty,
                    unit: item.unit,
                    warehouse: item.warehouse,
                    status: item.pro_status
                }));
            } catch (error) {
                console.error('조회 실패:', error);
            }
        },
        //테이블 ================================================
        async getPrdSearchList() {
            try {
                const res = await axios.get('/api/stock/prdSearchList');
                this.prdLotList = res.data.map((item) => ({
                    id: `${item.prd_lot_no}-${item.product_id}`,
                    reDate: item.open_date,
                    prdNo: item.prd_lot_no,
                    prdType: item.product_type,
                    prdCode: item.product_id,
                    prdName: item.product_name,
                    prdQty: item.curr_qty,
                    unit: `${'EA'}`,
                    warehouse: item.warehouse,
                    status: item.pro_status
                }));
            } catch (error) {
                console.error('제품목록 불러오기 실패:', error);
            }
        },
        //모달 ==========================================================================
        //(모달)제품
        openPrdModal() {
            //검색용
            this.productModal = true;
            this.getPrdList();
        },
        onSelectonSelectPrd() {
            this.prdCode = this.selectPrd.prdCode;
            this.prdName = this.selectPrd.prdName;

            this.selectPrd = [];
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
        //보관창고(모달)
        openWarehouseeModal() {
            this.WarehouseModal = true;
            this.getWareList();
        },
        onSelectWare() {
            this.warehouse = this.selectWare.warerName;
            (this.selectWare = []), (this.WarehouseModal = false);
        },
        //창고목록
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
        }
    },
    mounted() {
        console.log('제품조회페이지');
        this.getPrdSearchList();
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">제품재고조회</div>
    </div>
    <stockCommButton @search="onSearch" @reset="onReset" />

    <!--검색박스영역-->
    <div class="card w-full">
        <div class="flex flex-wrap justify-center gap-6 my-6">
            <div class="flex items-center gap-2">
                <label for="prdLotNo" class="whitespace-nowrap">제품 LOT번호</label>
                <InputText id="prdLotNo" type="text" class="w-60" v-model="prdLotNo" />
            </div>
            <div class="flex items-center gap-2">
                <label for="prdCode" class="whitespace-nowrap">제품코드</label>
                <IconField iconPosition="left" class="w-full">
                    <InputText id="prdCode" type="text" class="w-60" v-model="prdCode" />
                    <InputIcon class="pi pi-search" @click="openPrdModal" />
                </IconField>
            </div>
            <div class="flex items-center gap-2">
                <label for="prdName" class="whitespace-nowrap">제품명</label>
                <InputText id="prdName" type="text" class="w-60" v-model="prdName" />
            </div>
            <div class="flex items-center gap-2">
                <label for="warehouse" class="whitespace-nowrap">보관창고</label>
                <IconField iconPosition="left" class="w-full">
                    <InputText id="warehouse" type="text" class="w-60" v-model="warehouse" />
                    <InputIcon class="pi pi-search" @click="openWarehouseeModal" />
                </IconField>
            </div>
        </div>
    </div>

    <!--목록 테이블 -->
    <div class="card w-full">
        <DataTable :value="prdLotList" sortMode="multiple" tableStyle="min-width: 50rem" crollable scrollHeight="400px">
            <Column field="id" header="-" style="display: none"></Column>
            <Column field="reDate" header="등록일" sortable></Column>
            <Column field="prdNo" header="제품LOT번호" sortable></Column>
            <Column field="prdType" header="제품유형" sortable></Column>
            <Column field="prdCode" header="제품코드" sortable></Column>
            <Column field="prdName" header="제품명" sortable></Column>
            <Column field="prdQty" header="재고수량" sortable></Column>
            <Column field="unit" header="단위"></Column>
            <Column field="warehouse" header="보관위치" sortable></Column>
            <Column field="status" header="상태" sortable></Column>
        </DataTable>
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
