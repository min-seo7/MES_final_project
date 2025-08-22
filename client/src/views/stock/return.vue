<script>
import stockCommButton from '@/components/stock/stockCommBtn.vue';
import stockCommRowBtn from '@/components/stock/stockCommRowBtn.vue';
import commModal from '@/components/stock/stockCommModal.vue';
import 'primeicons/primeicons.css';
import axios from 'axios';

export default {
    components: { stockCommButton, commModal, stockCommRowBtn },
    data() {
        return {
            dueDate: '',
            orderNumber: '',
            prdCode: '',
            prdName: '',

            //모달
            productModal: false,
            WarehouseModal: false,
            //(모달)선택된 제품
            selectPrd: null,
            selectWare: null,
            products: [],
            warehouses: [],

            // 반품 리스트
            returnList: [
                // { id: 1, dueDate: '2025-08-01', outNo: 'R001', prdCode: 'M001', prdName: '테스트제품1', returnQty: 10, receiptQty: null, location: '', memo: '', status: '대기' },
                // { id: 2, dueDate: '2025-08-02', outNo: 'R002', prdCode: 'M002', prdName: '테스트제품2', returnQty: 5, receiptQty: 5, location: 'A-01', memo: '포장불량', status: '확정' }
            ],
            selectedReturnList: []
        };
    },
    methods: {
        //초기화
        onReset() {
            this.dueDate = '';
            this.orderNumber = '';
            this.prdCode = '';
            this.prdName = '';
        },
        //테이블===========================================
        async getList() {
            try {
                let res = await axios.get('/api/stock/returnList');
                this.returnList = res.data.map((item) => ({
                    id: item.id, // 행식별 위한 인덱스용,
                    dueDate: item.return_date,
                    outNo: item.prd_out_no,
                    prdCode: item.product_id,
                    prdName: item.product_name,
                    retunQty: item.quantity,
                    unit: `${'EA'}`,
                    status: item.inbound_pro,
                    receiptQty: item.in_qty,
                    location: item.warehouse_name,
                    memo: item.in_comm
                }));
            } catch (error) {
                console.error('반품목록 불러오기 실패:', error);
            }
            console.log(this.returnList);
        },
        //입고등록===========================================
        async postInreturn() {
            // if (!this.selectedReturnList.length) {
            //     alert('확정할 항목을 선택하세요.');
            //     return;
            // }
            try {
                let returnInfo = this.selectedReturnList.map((row) => ({
                    id: row.id,
                    re_qty: row.receiptQty,
                    warehouse: row.location,
                    comm: row.memo || null
                }));
                await axios.post('/api/stock/returnReg', returnInfo);
            } catch (error) {
                console.log('등록실패', error);
            }
            this.getList();
            this.selectedReturnList = [];
        },
        //수정버튼
        async postUpdate() {
            try {
                let updateInfo = this.selectedReturnList.map((row) => ({
                    id: row.id
                }));
                await axios.post('/api/stock/returnRewri', updateInfo);
            } catch (error) {
                console.log('수정실패', error);
            }
            this.getList();
            this.selectedReturnList = [];
        },
        //모달=============================================
        openPrdModal() {
            //검색용
            this.productModal = true;
            this.getPrdList();
        },
        onSelectonSelectPrd() {
            this.prdCode = this.selectPrd.prdCode;
            this.prdName = this.selectPrd.prdName;
            console.log(this.selectPrd.prdCode);
            this.selectPrd = [];
            this.productModal = false;
        },
        //(모달)제품목록가지고오기
        async getPrdList() {
            try {
                const res = await axios.get('/api/stock/modalPrdList');
                this.products = res.data.map((item) => ({
                    prdCode: item.product_id,
                    prdType: item.product_type,
                    prdName: item.product_name,
                    unit: item.unit
                }));
            } catch (error) {
                console.error('제품목록 불러오기 실패:', error);
            }
        }
    },
    mounted() {
        console.log('반품페이지');
        this.getList();
    }
};
</script>
<template>
    <div>
        <div class="font-semibold text-2xl mb-4">반품입고페이지</div>

        <stockCommButton @search="onSearch()" @reset="onReset()" />

        <!-- 검색 박스 -->
        <div class="card w-full">
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <div class="flex items-center gap-2">
                    <label for="dueDate" class="whitespace-nowrap">반품등록일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="dueDate" dateFormat="yy-mm-dd" />
                </div>
                <div class="flex items-center gap-2">
                    <label for="orderNumber" class="whitespace-nowrap">출고번호</label>
                    <InputText id="orderNumber" type="text" class="w-60" v-model="orderNumber" />
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
            </div>
        </div>

        <!-- 중간 버튼 -->
        <stockCommRowBtn
            :buttons="[
                { label: '입고등록', icon: 'pi pi-check', onClick: postInreturn },
                { label: '수정', icon: 'pi pi-pencil', onClick: postUpdate }
            ]"
        />

        <!-- 테이블 -->
        <div class="card w-full">
            <DataTable v-model:selection="selectedReturnList" selectionMode="multiple" dataKey="id" :value="returnList" tableStyle="min-width: 50rem">
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="dueDate" header="반품등록일" style="width: 12rem" />
                <Column field="outNo" header="출고번호" style="width: 15rem" />
                <Column field="prdCode" header="제품코드" style="width: 10rem" />
                <Column field="prdName" header="제품명" style="width: 15rem" />
                <Column field="retunQty" header="반품수량" style="width: 8rem" />

                <!-- 입고수량 (대기건만 입력가능) -->
                <Column header="입고수량" style="width: 10rem">
                    <template #body="slotProps">
                        <InputNumber v-model="slotProps.data.receiptQty" :disabled="slotProps.data.status === '확정'" />
                    </template>
                </Column>
                <Column field="unit" header="단위" style="width: 8rem" />
                <!-- 보관위치 -->
                <Column header="보관위치" style="width: 10rem">
                    <template #body="slotProps">
                        <InputText v-model="slotProps.data.location" :disabled="slotProps.data.status === '확정'" />
                    </template>
                </Column>

                <Column field="status" header="상태" style="width: 8rem" />
                <Column header="비고" style="width: 15rem">
                    <template #body="slotProps">
                        <InputText v-model="slotProps.data.memo" :disabled="slotProps.data.status === '확정'" />
                    </template>
                </Column>
            </DataTable>
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
