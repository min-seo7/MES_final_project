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
            //(모달)선택된 자재
            selectMat: null,

            //모달용-테이블행선택rowIdex
            selectRow: null,

            //선택
            selectOutWaitMats: [],
            selectOutgMats: [],

            //자재출고대기컬럼
            outWaitgCol: [
                { field: 'w_dueDate', header: '출고요청일', headerStyle: 'width: 20rem' },
                { field: 'w_purNo', header: '지시번호', headerStyle: 'width: 18rem' },
                { field: 'w_matCode', header: '자재코드', headerStyle: 'width: 20rem' },
                { field: 'w_matName', header: '자재명', headerStyle: 'width: 13rem', inputTextWM: true, onClick: this.rowOpenMatModal },
                { field: 'w_reqQty', header: '요청수량', headerStyle: 'width: 15rem' },
                { field: 'w_receiptQty', header: '출고수량', headerStyle: 'width: 15rem', inputNumber: true },
                { field: 'w_unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'w_memo', header: '비고', headerStyle: 'width: 50rem', inputText: true }
            ],
            matOutWait: [],
            outCol: [
                { field: 'outDate', header: '출고일', headerStyle: 'width: 20rem' },
                { field: 'woNo', header: '지시번호', headerStyle: 'width: 18rem' },
                { field: 'matCode', header: '자재코드', headerStyle: 'width: 20rem' },
                { field: 'matName', header: '자재명', headerStyle: 'width: 13rem' },
                { field: 'outQty', header: '출고수량', headerStyle: 'width: 15rem' },
                { field: 'unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'eName', header: '담당자', headerStyle: 'width: 15rem' },
                { field: 'memo', header: '비고', headerStyle: 'width: 50rem' }
            ],
            matOut: []
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
        //행추가버튼
        addNewRow() {
            let newRow = {
                id: `temp-${Date.now()}`,
                w_dueDate: '',
                w_purNo: '',
                w_matCode: '',
                w_matName: '',
                w_reqQty: '',
                w_receiptQty: 0,
                w_unit: '',
                w_memo: ''
            };
            this.matOutWait.unshift(newRow);
        },
        //행삭제버튼
        removeRow() {
            // 자재코드가 비어있는 행을 찾아서 한줄씩 삭제
            let index = this.matOutWait.findIndex((row) => !row.w_reqQty);

            if (index !== -1) {
                this.matOutWait.splice(index, 1);
            } else {
                alert('삭제할 행이 없습니다.');
            }
        },
        //테이블===============================================================
        //출고요청목록
        async getReqOutMats() {
            try {
                const res = await axios.get('/api/stock/matWOutList');
                this.matOutWait = res.data.map((item) => ({
                    id: `${item.wo_no}-${item.material_id}`,
                    w_dueDate: item.req_date,
                    w_purNo: item.wo_no,
                    w_matCode: item.material_id,
                    w_matName: item.material_name,
                    w_reqQty: item.req_qty,
                    w_unit: item.unit,
                    w_reId: item.req_id
                }));
            } catch (error) {
                console.error('제품출고대기 불러오기 실패:', error);
            }
        },
        //출고완료목록
        async getOutMats() {
            try {
                const res = await axios.get('/api/stock/matOutList');
                this.matOut = res.data.map((item) => ({
                    id: `${item.mat_out_no}-${item.material_id}`,
                    outDate: item.out_date,
                    woNo: item.wo_no,
                    matCode: item.material_id,
                    matName: item.material_name,
                    outQty: item.out_qty,
                    unit: item.unit,
                    memo: item.comm,
                    matNo: item.mat_out_no
                }));
            } catch (error) {
                console.error('제품출고대기 불러오기 실패:', error);
            }
        },
        //자재출고등록
        async postMatOut() {
            try {
                // if (!this.dueDate || !this.partnerId || !this.empName) {
                //     alert('필수정보입력');
                //     return;
                let matOutInfo = this.selectOutWaitMats.map((row) => ({
                    req_id: row.w_reId,
                    material_id: row.w_matCode,
                    order_qty: row.w_receiptQty,
                    comm: row.w_memo || null
                }));
                console.log(matOutInfo);
                await axios.post('/api/stock/reMatOut', matOutInfo);
            } catch (error) {
                console.error('등록 실패', error);
            }
            alert('출고등록 완료');
            this.selectOutWaitMats = null;
            this.getReqOutMats();
            this.getOutMats();
        },
        //(모달)자재==================================================================
        openMatModal() {
            this.materialModal = true;
            this.getMatList();
        },
        onSelectMat() {
            if (this.selectRow !== null) {
                this.matOutWait[this.selectRow].w_matCode = this.selectMat.matCode;
                this.matOutWait[this.selectRow].w_matName = this.selectMat.matName;
                this.matOutWait[this.selectRow].w_unit = this.selectMat.unit;
            } else {
                //(모달)자재선택시 반영.
                this.materialCode = this.selectMat.matCode;
                this.materialName = this.selectMat.matName;
            }
            this.selectRow = null;
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
                    unit: item.unit
                }));
            } catch (error) {
                console.error('자재목록 불러오기 실패:', error);
            }
        },
        rowOpenMatModal(rowIndex) {
            this.selectRow = rowIndex; // 클릭한 테이블 행 index
            this.materialModal = true;
            this.getMatList();
        }
    },
    mounted() {
        console.log('자재출고');
        this.getReqOutMats();
        this.getOutMats();
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">자재출고페이지</div>

        <stockCommButton @search="onSearch()" @reset="onReset()" />

        <div class="card w-full">
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 출고예정일 -->
                <div class="flex items-center gap-2">
                    <label for="dueDate" class="whitespace-nowrap">출고예정일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="dueDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 생산번호 -->
                <div class="flex items-center gap-2">
                    <label for="orderNumber" class="whitespace-nowrap">생산번호</label>
                    <InputText id="orderNumber" type="text" class="w-60" v-model="orderNumber" />
                </div>

                <!-- 자재코드 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">자재코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="materialCode" type="text" class="w-60" v-model="materialCode" />
                        <InputIcon class="pi pi-search" @click="openMatModal()" />
                    </IconField>
                </div>

                <!-- 자재명 -->
                <div class="flex items-center gap-2">
                    <label for="materialName" class="whitespace-nowrap">자재명</label>
                    <InputText id="materialName" type="text" class="w-60" v-model="materialName" />
                </div>
            </div>
        </div>
        <!--검색박스end-->
        <!--중간버튼-->
        <stockCommRowBtn
            :buttons="[
                { label: '출고등록', icon: 'pi pi-check', onClick: postMatOut },
                { label: '출고취소', icon: 'pi pi-trash', onClick: postCanelLot }
            ]"
        />

        <!--텝 테이블-->
        <div class="card w-full">
            <Tabs value="0">
                <TabList>
                    <Tab value="0">자재출고대기</Tab>
                    <Tab value="1">자재출고확정</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <div class="flex justify-end mt-0 space-x-2">
                            <Button icon="pi pi-plus" severity="success" rounded variant="outlined" @click="addNewRow" />
                            <Button icon="pi pi-minus" severity="success" rounded variant="outlined" @click="removeRow" />
                        </div>
                        <!--0번탭 컨텐츠영역-->
                        <stockCommTable v-model:selection="selectOutWaitMats" :columns="outWaitgCol" :dataRows="matOutWait" />
                    </TabPanel>
                    <TabPanel value="1">
                        <!--1번탭 컨텐츠영역-->
                        <stockCommTable v-model:selection="selectOutgMats" :columns="outCol" :dataRows="matOut" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>

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
                <Button label="선택 완료" @click="onSelectMat" />
            </div>
        </template>
    </commModal>
</template>
