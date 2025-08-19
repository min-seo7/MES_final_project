<!--폐기물-->
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
            outDate: '',
            waName: '',
            warehouse: '',
            partner: '',

            //모달
            WarehouseModal: false,
            partnerModal: false,
            //(모달)선택된 제품
            selectPartner: null,
            selectWare: null,
            partners: [],
            warehouses: [],
            //테이블 행 - 행인덱스!!
            selectRow: null,
            //테이블 데이터
            wasteList: [],
            selectedWaste: []
        };
    },
    methods: {
        //초기화
        onReset() {
            this.outDate = '';
            this.waName = '';
            this.warehouse = '';
            this.partner = '';
        },
        //조회
        async onSearch() {
            try {
                // 검색조건 객체 생성
                const filters = {
                    out_date: this.dateFormat(this.outDate) || null,
                    waste_name: this.waName || null,
                    warehouse: this.warehouse || null,
                    partner: this.partner || null
                };

                console.log(filters);

                const res = await axios.post('/api/stock/searchWasteList', filters);
                //조회결과
                this.wasteList = res.data.map((item) => ({
                    id: item.seq, // 행식별 위한 인덱스용,
                    reDate: item.re_date,
                    wasteId: item.waste_id,
                    wasteName: item.waste_name,
                    qty: item.qty,
                    unit: item.unit,
                    warehouse: item.warehouse,
                    status: item.pro_status,
                    date: item.out_date,
                    partnerId: '',
                    partner: item.partner_name,
                    memo: item.comm
                }));
            } catch (error) {
                console.error('조회 실패:', error);
            }
        },
        //폐기물리스트
        async getWasteList() {
            try {
                let res = await axios.get('/api/stock/wasteList');
                this.wasteList = res.data.map((item) => ({
                    id: item.seq, // 행식별 위한 인덱스용,
                    reDate: item.re_date,
                    wasteId: item.waste_id,
                    wasteName: item.waste_name,
                    qty: item.qty,
                    unit: item.unit,
                    warehouse: item.warehouse,
                    status: item.pro_status,
                    date: item.out_date,
                    partnerId: '',
                    partner: item.partner_name,
                    memo: item.comm
                }));
            } catch (error) {
                console.error('폐기물목록 불러오기 실패:', error);
            }
        },
        //모달=============================================
        //보관장소
        openWhModal() {
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
            this.warehouse = this.selectWare.warerName;
            this.selectWare = [];
            this.WarehouseModal = false;
        },
        //거래처(처리업체)
        openPatenrModal(rowIndex) {
            this.selectRow = rowIndex; // 클릭한 테이블 행 index
            this.partnerModal = true;
            this.getPartnerList();
        },
        async getPartnerList() {
            try {
                const res = await axios.get('/api/stock/modalPartnerList');
                console.log('거래처 응답:', res.data);
                this.partners = res.data.map((item) => ({
                    partnerType: item.partner_type,
                    partnerId: item.partner_id,
                    partnerName: item.partner_name
                }));
            } catch (error) {
                console.error('거래처목록 불러오기 실패:', error);
            }
        },
        onSelectPartner() {
            if (this.selectRow !== null && this.selectPartner) {
                this.wasteList[this.selectRow].partner = this.selectPartner.partnerName;
                this.wasteList[this.selectRow].partnerId = this.selectPartner.partnerId;
            }

            this.selectPartner = null;
            this.partnerModal = false;
        },
        //반출버튼=========================================
        // async postOutWaste() {
        //     if (!this.selectedWaste.length) {
        //         alert('확정할 항목을 선택하세요.');
        //         return;
        //     }
        //     try {
        //         let outInfo = this.selectedWaste.map((row) => ({
        //             seq: row.id,
        //             out_date: this.dateFormat(row.date),
        //             partner_id: row.partnerId,
        //             comm: row.memo
        //         }));
        //         await axios.post('/api/stock/wasteOutReg', outInfo);
        //     } catch (error) {
        //         console.lof('등록실패', error);
        //     }
        //     this.getWasteList();
        //     this.selectedWaste = [];
        // },
        //수정버튼==============================================
        async postUpdate() {
            try {
                let updateInfo = this.selectedWaste.map((row) => ({
                    seq: row.id
                }));
                await axios.post('/api/stock/wasteRewri', updateInfo);
            } catch (error) {
                console.lof('등록실패', error);
            }
            this.getWasteList();
            this.selectedWaste = [];
        },
        //날짜양식
        dateFormat(date) {
            let newDateFormat = new Date(date);
            return newDateFormat.getFullYear() + '-' + String(newDateFormat.getMonth() + 1).padStart(2, '0') + '-' + String(newDateFormat.getDate()).padStart(2, '0');
        }
    },
    mounted() {
        console.log('폐기물리스트');
        this.getWasteList();
    }
};
</script>
<template>
    <div>
        <div class="font-semibold text-2xl mb-4">폐기물 반출</div>

        <stockCommButton @search="onSearch()" @reset="onReset()" />

        <!-- 검색 박스 -->
        <div class="card w-full">
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <div class="flex items-center gap-2">
                    <label for="outDate" class="whitespace-nowrap">반출일자</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="outDate" dateFormat="yy-mm-dd" />
                </div>
                <div class="flex items-center gap-2">
                    <label for="waName" class="whitespace-nowrap">폐기물명</label>
                    <InputText id="waName" type="text" class="w-60" v-model="waName" />
                </div>
                <div class="flex items-center gap-2">
                    <label for="warehouse" class="whitespace-nowrap">보관위치</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="warehouse" type="text" class="w-60" v-model="warehouse" @click="openWhModal" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
                <div class="flex items-center gap-2">
                    <label for="artner" class="whitespace-nowrap">처리업체</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="artner" type="text" class="w-60" v-model="partner" @click="openPrdModal" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
            </div>
        </div>

        <!-- 중간 버튼 -->
        <stockCommRowBtn
            :buttons="[
                { label: '반출등록', icon: 'pi pi-check', onClick: postOutWaste },
                { label: '수정', icon: 'pi pi-check', onClick: postUpdate }
            ]"
        />

        <!-- 테이블 -->
        <div class="card w-full">
            <DataTable v-model:selection="selectedWaste" selectionMode="multiple" dataKey="id" :value="wasteList" tableStyle="min-width: 50rem" scrollable scrollHeight="400px">
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="reDate" header="등록일자" style="width: 12rem" />
                <Column field="wasteId" header="폐기물코드" style="width: 10rem; display: none" />
                <Column field="wasteName" header="폐기물명" style="width: 20rem" />
                <Column field="qty" header="수량" style="width: 7rem" />
                <Column field="unit" header="단위" style="width: 5rem" />
                <Column field="warehouse" header="보관위치" style="width: 10rem" />
                <Column header="반출일자" style="width: 15rem">
                    <template #body="slotProps">
                        <DatePicker :showIcon="true" :showButtonBar="true" v-model="slotProps.data.date" dateFormat="yy-mm-dd" :disabled="slotProps.data.status === '확정'" />
                    </template>
                </Column>
                <Column header="처리업체" style="width: 10rem">
                    <template #body="slotProps">
                        <InputText v-model="slotProps.data.partner" @click="openPatenrModal(slotProps.index)" :disabled="slotProps.data.status === '확정'" />
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

    <!--거래처-->
    <commModal v-model="partnerModal" header="거래처목록">
        <div class="mt-5 mb-4 space-x-2">
            <label for="partnerId">거래처코드</label>
            <InputText id="partnerId" type="text" />
            <label for="partnerName">거래처명</label>
            <InputText id="partnerName" type="text" />
            <Button label="검색" />
        </div>
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
                <Button label="선택 완료" @click="onSelectPartner" />
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
                <Button label="선택 완료" @click="onSelectWare" />
            </div>
        </template>
    </commModal>
</template>
