<!--자재재고조회-->
<script>
import stockCommButton from '@/components/stock/stockCommBtn.vue';
import commModal from '@/components/stock/stockCommModal.vue';
import axios from 'axios';

export default {
    components: { stockCommButton, commModal },
    data() {
        return {
            //검색박스
            matLotNo: '',
            matCode: '',
            matName: '',
            warehouse: '',
            //모달
            materialModal: false,
            WarehouseModal: false,
            materials: [],
            warehouses: [],
            //(모달)선택된 제품
            selectMat: [],
            selectWare: [],

            //테이블 데이터
            matLotList: []
        };
    },
    methods: {
        //초기화
        onReset() {
            this.matLotNo = '';
            this.matCode = '';
            this.matName = '';
            this.warehouse = '';
            this.getMatSearchLotList();
        },
        //조회
        async onSearch() {
            try {
                // 검색조건 객체 생성
                const filters = {
                    matLotNo: this.matLotNo || null,
                    matCode: this.matCode || null,
                    matName: this.matName || null,
                    warehouse: this.warehouse || null
                };

                console.log(filters);

                const res = await axios.post('/api/stock/searchMatLotList', filters);
                //조회결과
                this.matLotList = res.data.map((item) => ({
                    id: `${item.lot_no}-${item.material_id}`,
                    reDate: item.open_date,
                    matNo: item.lot_no,
                    matCode: item.material_id,
                    matName: item.material_name,
                    matQty: item.curr_qty,
                    unit: item.unit,
                    warehouse: item.warehouse,
                    status: item.pro_status
                }));
            } catch (error) {
                console.error('조회 실패:', error);
            }
        },
        //데이터테이블 영역=========================================================================
        async getMatSearchLotList() {
            try {
                const res = await axios.get('/api/stock/matSearchList');
                this.matLotList = res.data.map((item) => ({
                    id: `${item.lot_no}-${item.material_id}`,
                    reDate: item.open_date,
                    matNo: item.lot_no,
                    matCode: item.material_id,
                    matName: item.material_name,
                    matQty: item.curr_qty,
                    unit: item.unit,
                    warehouse: item.warehouse,
                    status: item.pro_status
                }));
            } catch (error) {
                console.error('자재목록 불러오기 실패:', error);
            }
        },
        //모달 ==========================================================================
        //(모달)자재
        openMatModal() {
            this.materialModal = true;
            this.getMatList();
        },
        onSelectMat() {
            //(모달)자재선택시 반영.
            this.matCode = this.selectMat.matCode;
            this.matName = this.selectMat.matName;

            this.selectMat = [];
            this.materialModal = false;
        },
        //(모달)자재목록가지고오기
        async getMatList() {
            try {
                const res = await axios.get('/api/stock/modalMatList');
                console.log('자재 응답:', res.data);
                // 받은 데이터를 프론트에 맞게 가공
                this.materials = res.data.map((item) => ({
                    matCode: item.material_id,
                    matName: item.material_name,
                    unit: item.uni
                }));
            } catch (error) {
                console.error('자재목록 불러오기 실패:', error);
            }
        },
        //보관창고(모달)========================================================
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
        console.log('자재조회페이지');
        this.getMatSearchLotList();
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">자재재고조회</div>
    </div>
    <stockCommButton @search="onSearch" @reset="onReset" />

    <!--검색박스영역-->
    <div class="card w-full">
        <div class="flex flex-wrap justify-center gap-6 my-6">
            <div class="flex items-center gap-2">
                <label for="matLotNo" class="whitespace-nowrap">자재 LOT번호</label>
                <InputText id="matLotNo" type="text" class="w-60" v-model="matLotNo" />
            </div>
            <div class="flex items-center gap-2">
                <label for="matCode" class="whitespace-nowrap">자재코드</label>
                <IconField iconPosition="left" class="w-full">
                    <InputText id="matCode" type="text" class="w-60" v-model="matCode" />
                    <InputIcon class="pi pi-search" @click="openMatModal" />
                </IconField>
            </div>
            <div class="flex items-center gap-2">
                <label for="matName" class="whitespace-nowrap">자재명</label>
                <InputText id="matName" type="text" class="w-60" v-model="matName" />
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
        <DataTable :value="matLotList" sortMode="multiple" tableStyle="min-width: 50rem" crollable scrollHeight="400px">
            <Column field="id" header="-" style="display: none"></Column>
            <Column field="reDate" header="등록일" sortable></Column>
            <Column field="matNo" header="자재LOT번호" sortable></Column>
            <Column field="matCode" header="자재코드" ></Column>
            <Column field="matName" header="자재명" sortable></Column>
            <Column field="matQty" header="재고수량" sortable></Column>
            <Column field="unit" header="단위"></Column>
            <Column field="warehouse" header="보관위치" ></Column>
            <Column field="status" header="상태" sortable></Column>
        </DataTable>
    </div>

    <!--자재모달-->
    <commModal v-model="materialModal" header="자재목록" style="width: 40rem">
        <DataTable v-model:selection="selectMat" :value="materials" dataKey="matCode" tableStyle="min-width: 20rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="matCode" header="자재코드" headerStyle="width: 10rem"></Column>
            <Column field="matName" header="자재명" headerStyle="width: 10em"></Column>
        </DataTable>

        <!-- footer 슬롯 -->
        <template #footer>
            <div class="mt-5 flex justify-center">
                <Button label="선택 완료" @click="onSelectMat" />
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
