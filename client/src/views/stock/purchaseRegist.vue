<script>
import commModal from '@/components/stock/stockCommModal.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import axios from 'axios';

//발주수량 0이상 입력될 수 있도록 제어. 납기요청일 설정시 과거지정 불가능하게.

export default {
    components: { commModal, DataTable, Column, InputText, Button },
    data() {
        return {
            reDate: '',
            dueDate: '',
            partnerId: '',
            partnerName: '',

            //모달
            partnerModal: false,
            materialModal: false,

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
            lowMat: [{ id: '1', matCode: 'm001', matName: '왕겨', safeStock: '50', nowStock: '30', shortage: '20', unit: 'KG' }],
            //거래처 모달
            partners: [
                { id: 1, partnerType: '공급처', partnerId: 'P001', partnerName: '왕겨가게', memo: '계약일 24-08-01' },
                { id: 2, partnerType: '공급처', partnerId: 'P002', partnerName: '쌀겨상회', memo: '계약일 24-08-01' }
            ],
            //원자재모달 data
            materials: []
        };
    },
    methods: {
        onSelectPartner() {
            //(모달)거래처선택시 반영.
            this.partnerId = this.selectPartner.partnerId;
            this.partnerName = this.selectPartner.partnerName;

            this.purshaseList.forEach((row) => {
                //배열의 각 행을 순환하면서 거래처명.
                row.patner = this.partnerName;
            });

            this.partnerModal = false;
        },
        openMatModal(rowIndex) {
            this.getMatList();
            //자재코드 모달클릭시 index번호 추출
            this.selectRow = rowIndex;
            this.materialModal = true;
        },
        onSelectMat() {
            //(모달)자재선택시 반영
            this.purshaseList[this.selectRow].mat_id = this.selectMat.matCode;
            this.purshaseList[this.selectRow].mat_name = this.selectMat.matName;
            this.purshaseList[this.selectRow].unit = this.selectMat.unit;

            this.materialModal = false;
        },

        addEmptyRow() {
            //행추가
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
        async getMatList() {
            try {
                const res = await axios.get('/api/stock/modalMatList');
                console.log('자재 응답:', res.data);
                // 받은 데이터를 프론트에 맞게 가공
                this.materials = res.data.map((item) => ({
                    matCode: item.material_id,
                    matName: item.material_name,
                    unit: item.unit
                }));
            } catch (error) {
                console.error('자재목록 불러오기 실패:', error);
            }
        }
    },
    mounted() {
        console.log('발주등록페이지');
        //등록일 자동입력
        let today = new Date();
        this.reDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">발주등록페이지</div>
    </div>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" + 추 가 " rounded @click="addEmptyRow()" />
        <Button label=" 등 록 " rounded @click="insertPurse()" />
        <Button label=" 초기화 " severity="info" rounded @click="reset()" />
    </div>

    <!--테이블-->
    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">안전재고 기준 미달 자재</div>
                <DataTable :value="lowMat" scrollable scrollHeight="400px" class="mt-6" style="width: 100%">
                    <Column field="matCode" header="자재코드" style="min-width: 80px" frozen class="font-bold"></Column>
                    <Column field="matName" header="자재명" style="min-width: 100px"></Column>
                    <Column field="safeStock" header="안전재고" style="min-width: 80px"></Column>
                    <Column field="nowStock" header="현재고" style="min-width: 80px"></Column>
                    <Column field="shortage" header="부족" style="min-width: 80px"></Column>
                    <Column field="unit" header="단위" style="min-width: 80px"></Column>
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
                            <InputText id="reDate" type="text" v-model="reDate" class="w-full" dateFormat="yy-mm-dd" />
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
                                <InputText id="partnerId" type="text" class="w-full" readonly v-model="partnerId" @click="partnerModal = true" />
                                <InputIcon class="pi pi-search" />
                            </IconField>
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="partnerName">공급처</label>
                            <InputText id="partnerName" type="text" class="w-full" readonly v-model="partnerName" />
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2 invisible">
                            <label for="name2">안보이는영역 싸이즈 맞추기</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="empName">담당자</label>
                            <InputText id="empName" type="text" />
                        </div>
                    </div>
                </div>
                <!--입력 input박스끝-->
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
    <commModal v-model="partnerModal" header="공급처목록">
        <div class="mt-5 mb-4 space-x-2">
            <label for="partnerId">공급처코드</label>
            <InputText id="partnerId" type="text" />
            <label for="partnerName">공급처명</label>
            <InputText id="partnerName" type="text" />
            <Button label="검색" />
        </div>
        <!--v-model:selection는 선택행을 selectPartner 변수에 넣어줌.-->
        <DataTable v-model:selection="selectPartner" :value="partners" dataKey="id" tableStyle="min-width: 40rem">
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
</template>
