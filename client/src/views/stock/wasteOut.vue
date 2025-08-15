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

            //자재출고대기컬럼
            outPandingCol: [
                { field: 'dueDate', header: '출고예정일', headerStyle: 'width: 20rem' },
                { field: 'purNo', header: '지시번호', headerStyle: 'width: 18rem' },
                { field: 'matCode', header: '자재코드', headerStyle: 'width: 20rem' },
                { field: 'matName', header: '자재명', headerStyle: 'width: 13rem' },
                { field: 'testPassQty', header: '요청수량', headerStyle: 'width: 15rem' },
                { field: 'receiptQty', header: '출고수량', headerStyle: 'width: 15rem', inputNumber: true },
                { field: 'unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'memo', header: '비고', headerStyle: 'width: 50rem', inputText: true }
            ],
            outCol: [
                { field: 'dueDate', header: '출고일', headerStyle: 'width: 20rem' },
                { field: 'purNo', header: '지시번호', headerStyle: 'width: 18rem' },
                { field: 'matCode', header: '자재코드', headerStyle: 'width: 20rem' },
                { field: 'matName', header: '자재명', headerStyle: 'width: 13rem' },
                { field: 'testPassQty', header: '요청수량', headerStyle: 'width: 15rem' },
                { field: 'receiptQty', header: '출고수량', headerStyle: 'width: 15rem' },
                { field: 'unit', header: '단위', headerStyle: 'width: 13rem' },
                { field: 'receiptQty', header: '담당자', headerStyle: 'width: 15rem' },
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
        console.log('자재출고');
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">폐기물출고페이지</div>

        <stockCommButton @search="onSearch()" @reset="onReset()" />

        <div class="card w-full">
            <!--검색1열-->
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
                <!-- 출고일 -->
                <div class="flex items-center gap-2">
                    <label for="MatInDate" class="whitespace-nowrap">출 고 일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="MatInDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 선택된 재고?????? -->
                <div class="flex items-center gap-2">
                    <label for="MatLotNo" class="whitespace-nowrap">??????</label>
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
        <!--검색박스end-->
        <!--중간버튼-->
        <stockCommRowBtn
            :buttons="[
                { label: '출고등록', icon: 'pi pi-check', onClick: editHandler },
                { label: '신규', icon: 'pi pi-plus', onClick: deleteHandler },
                { label: '수정', icon: 'pi pi-pencil', onClick: deleteHandler }
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
                        <!--0번탭 컨텐츠영역-->
                        <stockCommTable v-model="MatOutPanding" :columns="outPandingCol" />
                    </TabPanel>
                    <TabPanel value="1">
                        <!--1번탭 컨텐츠영역-->
                        <stockCommTable v-model="MatOut" :columns="outCol" />
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
</template>
