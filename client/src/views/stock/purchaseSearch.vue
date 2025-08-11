<script>
import stockCommButton from '@/components/stock/stockCommBtn.vue';
import commModal from '@/components/stock/stockCommModal.vue';
import stockCommRowBtn from '@/components/stock/stockCommRowBtn.vue';
import axios from 'axios';

export default {
    components: { stockCommButton, commModal, stockCommRowBtn },
    data() {
        return {
            //검색박스
            registerDate: '',
            orderNumber: '',
            materialCode: '',
            materialName: '',
            //모달
            materialModal: false,
            //(모달)선택된 자재
            selectMat: null,
            //목록
            products: [{}],

            selectedProducts: [{}]
        };
    },
    methods: {
        //초기화
        onReset() {
            this.registerDate = '';
            this.orderNumber = '';
            this.materialCode = '';
            this.materialName = '';
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
        console.log('발주목록');
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">발주조회페이지</div>
    </div>
    <stockCommButton @search="onSearch()" @reset="onReset()" />

    <!--검색박스영역-->
    <div class="card w-full">
        <!--검색1열-->
        <div class="flex flex-wrap justify-center gap-6 my-6">
            <!-- 등록일 -->
            <div class="flex items-center gap-2">
                <label for="registerDate" class="whitespace-nowrap">등록일</label>
                <DatePicker :showIcon="true" :showButtonBar="true" v-model="registerDate" dateFormat="yy-mm-dd"></DatePicker>
            </div>

            <!-- 발주번호 -->
            <div class="flex items-center gap-2">
                <label for="orderNumber" class="whitespace-nowrap">발주번호</label>
                <InputText id="orderNumber" type="text" class="w-60" v-model="orderNumber" />
            </div>

            <!-- 자재코드 -->
            <div class="flex items-center gap-2">
                <label for="materialCode" class="whitespace-nowrap">자재코드</label>
                <IconField iconPosition="left" class="w-full" @click="openMatModal()">
                    <InputText id="materialCode" type="text" class="w-60" v-model="materialCode" />
                    <InputIcon class="pi pi-search" />
                </IconField>
            </div>

            <!-- 자재명 -->
            <div class="flex items-center gap-2">
                <label for="materialName" class="whitespace-nowrap">자재명</label>
                <InputText id="materialName" type="text" class="w-60" v-model="materialName" />
            </div>
        </div>
    </div>
    <!--중간 삭제버튼-->
    <stockCommRowBtn :buttons="[{ label: '발주취소', icon: 'pi pi-trash', onClick: deleteHandler }]" />

    <!--목록 테이블 -->
    <div class="card w-full">
        <DataTable v-model:selection="selectedProducts" :value="products" dataKey="id" tableStyle="min-width: 50rem">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="reDate" header="등록일"></Column>
            <Column field="purNo" header="발주번호"></Column>
            <Column field="matCode" header="자재코드"></Column>
            <Column field="matName" header="자재명"></Column>
            <Column field="purQty" header="발주량"></Column>
            <Column field="unit" header="단위"></Column>
            <Column field="supPatner" header="공급처"></Column>
            <Column field="eName" header="담당자"></Column>
            <Column field="dueDate" header="납기요청일"></Column>
            <Column field="status" header="진행상태"></Column>
        </DataTable>
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
