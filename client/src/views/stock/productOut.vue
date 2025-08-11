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
            //(모달)선택된 자재
            selectPrd: null
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
        //(모달)제품
        openPrdModal() {
            console.log('제품모달');
            this.productModal = true;

            this.getMatList();
        },
        onSelectMat() {
            //(모달)자재선택시 반영.
            this.prdCode = this.selectPrd.prdCode;
            this.prdName = this.selectPrd.prdName;

            this.productModal = false;
        },
        //(모달)자재목록가지고오기
        async getMatList() {
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
        }
    },
    mounted() {
        console.log('제품입고');
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">제품출고페이지</div>

        <stockCommButton @search="onSearch()" @reset="onReset()" />

        <div class="card w-full">
            <!--검색1열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 제품입고예정일 -->
                <div class="flex items-center gap-2">
                    <label for="dueDate" class="whitespace-nowrap">출고예정일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="dueDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 생산/검수번호 -->
                <div class="flex items-center gap-2">
                    <label for="shipNumber" class="whitespace-nowrap">출하번호</label>
                    <InputText id="shipNumber" type="text" class="w-60" v-model="shipNumber" />
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
                    <label for="prdOutDate" class="whitespace-nowrap">출 고 일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="prdOutDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 제품LOT번호 -->
                <div class="flex items-center gap-2">
                    <label for="prdLotNo" class="whitespace-nowrap">LOT번호</label>
                    <InputText id="prdLotNo" type="text" class="w-60" v-model="prdLotNo" />
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
                    <Tab value="0">제품출고대기</Tab>
                    <Tab value="1">제품출고확정</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <!--0번탭 컨텐츠영역-->
                        <stockCommTable v-model="prdReceiptPanding" :columns="pandingCol" />
                    </TabPanel>
                    <TabPanel value="1">
                        <!--1번탭 컨텐츠영역-->
                        <stockCommTable v-model="prdReceipt" :columns="ReceiptCol" />
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
                <Button label="선택 완료" @click="onSelectMat()" />
            </div>
        </template>
    </commModal>
</template>
