<script>
import commModal from '@/components/stock/stockCommModal.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import 'primeicons/primeicons.css';
import axios from 'axios';
import { useUserStore } from '@/store/index';

export default {
    components: { commModal, DataTable, Column, InputText, Button },
    data() {
        return {
            reDate: '',
            dueDate: '',
            partnerId: '',
            partnerName: '',
            empName: '',

            //모달
            partnerModal: false,
            materialModal: false,

            //거래처 모달
            partners: [],
            //원자재모달 data
            materials: [],

            //(모달)선택할 거래처, 자재
            selectPartner: null,
            selectMat: null,

            //발주자재rowIdex
            selectRow: null,

            //발주자재번호
            count: 1,
            //자재목록
            purshaseList: [
                {
                    id: 1,
                    mat_id: '',
                    mat_name: '',
                    purch_qty: '',
                    unit: '',
                    patner: '',
                    comm: ''
                }
            ],
            //안전재고수량 미달
            lowMat: []
        };
    },
    methods: {
        //안전재고미달
        async getLessMatList() {
            try {
                const res = await axios.get('/api/stock/lessMatList');

                this.lowMat = res.data.map((item) => ({
                    low_matCode: item.material_id,
                    low_matName: item.material_name,
                    low_safeStock: item.safety_stock,
                    low_nowStock: item.total_curr_qty,
                    low_shortage: item.less,
                    low_unit: item.unit
                }));
            } catch (error) {
                console.error('부족목록 불러오기 실패:', error);
            }
        },
        //모달 ==========================================================================
        //거래처
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
        openPatenrModal() {
            this.partnerModal = true;
            this.getPartnerList();
        },
        onSelectPartner() {
            this.partnerId = this.selectPartner.partnerId;
            this.partnerName = this.selectPartner.partnerName;

            this.purshaseList.forEach((row) => {
                row.patner = this.partnerName;
            });
            this.selectPartner = null;
            this.partnerModal = false;
        },
        //자재용 모달
        async getMatList() {
            try {
                const res = await axios.get('/api/stock/modalMatList');
                console.log('자재 응답:', res.data);
                this.materials = res.data.map((item) => ({
                    //DB데이터, 모달용 테이블 컬럼 일치시킴.
                    matCode: item.material_id,
                    matName: item.material_name,
                    unit: item.unit
                }));
            } catch (error) {
                console.error('자재목록 불러오기 실패:', error);
            }
        },
        openMatModal(rowIndex) {
            this.getMatList();
            //자재코드 모달클릭시 index번호 추출
            this.selectRow = rowIndex;
            this.materialModal = true;
        },
        onSelectMat() {
            // 행 중복 체크
            let selectedMatCode = this.selectMat.matCode;
            const isDuplicate = this.purshaseList.some((item, index) => item.mat_id === selectedMatCode && index !== this.selectRow);
            if (isDuplicate) {
                alert('이미 선택된 자재입니다.');
                return;
            }

            //(모달)자재선택시 반영
            this.purshaseList[this.selectRow].mat_id = this.selectMat.matCode;
            this.purshaseList[this.selectRow].mat_name = this.selectMat.matName;
            this.purshaseList[this.selectRow].unit = this.selectMat.unit;

            this.selectMat = null;
            this.materialModal = false;
        },
        //=============================================================================================
        addEmptyRow() {
            //행추가버튼
            this.purshaseList.push({
                id: this.inceaseCount(),
                mat_id: '',
                mat_name: '',
                purch_qty: '',
                unit: '',
                patner: this.partnerName,
                comm: ''
            });
        },
        removeRow() {
            if (this.purshaseList.length > 1) {
                this.purshaseList.pop();
                this.count--;
            }
        },
        reset() {
            //초기화버튼
            console.log('초기화');

            this.dueDate = '';
            this.partnerId = '';
            this.partnerName = '';

            this.count = 1;
            this.purshaseList = [
                {
                    id: 1,
                    mat_id: '',
                    mat_name: '',
                    purch_qty: '',
                    unit: '',
                    patner: '',
                    comm: ''
                }
            ];
        },
        inceaseCount() {
            //발주목록 행추가시 목록번호 증가.
            return ++this.count;
        },
        //등록버튼
        //발주목록 DB insert[마스터 먼저 넣고, 발주번호 받은뒤 서브 넣기.]
        async insertPurse() {
            try {
                //마스터T 정보
                if (!this.dueDate || !this.partnerId || !this.empName) {
                    alert('필수정보입력');
                    return;
                }
                let masterInfo = {
                    re_date: this.reDate,
                    due_date: this.dateFormat(this.dueDate),
                    partner_id: this.partnerId,
                    manager: this.empName
                };
                //마스터 DB 저장
                let insertMaster = await axios.post('/api/stock/purchase', masterInfo);

                //발주시퀀스 받기.
                let purchaseNo = insertMaster.data.pur_no;

                console.log(purchaseNo);

                //서브T 정보
                let subInfo = this.purshaseList.map((row) => ({
                    material_id: row.mat_id,
                    pur_qty: row.purch_qty,
                    comm: row.comm,
                    pur_no: purchaseNo
                }));

                console.log(subInfo);

                //서브 DB저장
                await axios.post('/api/stock/purDetail', subInfo);

                //등록 알람
                alert('발주등록 완료');
                //초기화
                this.reset();
            } catch (error) {
                console.error('등록 실패', error);
            }
        },
        //DB에 맞게 날짜포멧 변환.
        dateFormat(date) {
            let newDateFormat = new Date(date);
            return newDateFormat.getFullYear() + '-' + String(newDateFormat.getMonth() + 1).padStart(2, '0') + '-' + String(newDateFormat.getDate()).padStart(2, '0');
        }
    },
    mounted() {
        console.log('발주등록페이지');
        //등록일 자동입력
        let today = new Date();
        this.reDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        this.getLessMatList();
        let userInfo = useUserStore();
        console.log(userInfo);
        if (userInfo.user) {
            this.empName = userInfo.user.name; // 로그인된 사용자 이름 세팅
        }
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">발주등록페이지</div>
    </div>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 등 록 " rounded @click="insertPurse()" />
        <Button label=" 초기화 " severity="info" rounded @click="reset()" />
    </div>

    <!--테이블-->
    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">안전재고 기준 미달 자재</div>
                <DataTable :value="lowMat" scrollable scrollHeight="400px" class="mt-6" style="width: 100%" sortMode="multiple">
                    <Column field="low_matCode" header="자재코드" style="min-width: 80px" frozen class="font-bold" sortable></Column>
                    <Column field="low_matName" header="자재명" style="min-width: 100px" sortable></Column>
                    <Column field="low_safeStock" header="안전재고" style="min-width: 80px" sortable></Column>
                    <Column field="low_nowStock" header="현재고" style="min-width: 80px" sortable></Column>
                    <Column field="low_shortage" header="부족" style="min-width: 80px" sortable></Column>
                    <Column field="low_unit" header="단위" style="min-width: 80px"></Column>
                </DataTable>
            </div>
        </div>
        <!--안전재고미달-->
        <!--발주등록-->
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">발주등록</div>
                <!--input입력박스-->
                <div class="purchase-info">
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="reDate">등록일</label>
                            <InputText id="reDate" type="text" v-model="reDate" class="w-full" dateFormat="yy-mm-dd" readonly />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="dueDate">납기요청일</label>
                            <DatePicker :showIcon="true" :showButtonBar="true" v-model="dueDate" dateFormat="yy-mm-dd"></DatePicker>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="partnerId">공급처코드</label>
                            <IconField iconPosition="left" class="w-full">
                                <InputText id="partnerId" type="text" class="w-full" v-model="partnerId" />
                                <InputIcon class="pi pi-search" @click="openPatenrModal()" />
                            </IconField>
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="partnerName">공급처</label>
                            <InputText id="partnerName" type="text" class="w-full" v-model="partnerName" />
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2 invisible">
                            <label for="name2">안보이는영역 싸이즈 맞추기</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="empName">담당자</label>
                            <InputText id="empName" type="text" v-model="empName" readonly />
                        </div>
                    </div>
                </div>
                <!--입력 input박스끝-->
                <div class="flex justify-end mt-0 space-x-2">
                    <Button icon="pi pi-plus" severity="success" rounded variant="outlined" @click="addEmptyRow()" />
                    <Button icon="pi pi-minus" severity="success" rounded variant="outlined" @click="removeRow()" />
                </div>
                <div>
                    <DataTable :value="purshaseList" scrollable scrollHeight="400px" class="mt-6" style="width: 100%">
                        <Column field="id" header="" style="min-width: 30px" frozen class="font-bold"></Column>
                        <Column field="mat_id" header="자재코드" style="min-width: 80px" frozen class="font-bold">
                            <template #body="slotProps">
                                <InputText v-model="slotProps.data.mat_id" @click="openMatModal(slotProps.index)" style="width: 80px" />
                            </template>
                        </Column>
                        <Column field="mat_name" header="자재명" style="min-width: 100px"></Column>
                        <Column field="purch_qty" header="발주수량" style="min-width: 30px">
                            <template #body="slotProps">
                                <InputText v-model="slotProps.data.purch_qty" :min="0" type="number" style="width: 80%" />
                            </template>
                        </Column>
                        <Column field="unit" header="단위" style="min-width: 80px"></Column>
                        <Column field="patner" header="공급처" style="min-width: 80px"></Column>
                        <Column field="comm" header="비고" style="min-width: 150px">
                            <template #body="slotProps">
                                <InputText v-model="slotProps.data.comm" type="text" style="width: 100%" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>

    <!--모달영역-->
    <!--공급처모달-->
    <commModal v-model="partnerModal" header="거래처목록">
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
                <Button label="선택 완료" @click="onSelectPartner()" />
            </div>
        </template>
    </commModal>

    <!--자재모달-->
    <commModal v-model="materialModal" :value="materials" header="자재목록" style="width: 40rem">
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
</template>
