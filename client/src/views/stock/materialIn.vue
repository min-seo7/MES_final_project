<script>
import stockCommButton from '@/components/stock/stockCommBtn.vue';
import stockCommTable from '@/components/stock/stockCommTable.vue';

export default {
    components: {
        stockCommButton,
        stockCommTable
    },
    data() {
        return {
            tableColumns: [
                { field: 'dueDate', header: '입고예정일' },
                { field: 'purNo', header: '발주번호' },
                { field: 'matCode', header: '자재코드' },
                { field: 'matName', header: '자재명' },
                { field: 'succeQty', header: '검수완료수량' },
                { field: 'inQty', header: '입고수량' },
                { field: 'unit', header: '단위' },
                { field: 'supPatner', header: '공급처' },
                { field: 'location ', header: '보관위치' },
                { field: 'comm', header: '비고' }
            ],
            tableData: [
                {
                    id: 1,
                    reDate: '2025-08-08',
                    purNo: 'PO12345',
                    matCode: 'M001',
                    matName: '철판',
                    purQty: 100,
                    unit: 'kg',
                    supPatner: 'ABC 상사',
                    eName: '김담당',
                    dueDate: '2025-08-15',
                    status: '진행중'
                }
            ]
        };
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">자재입고페이지</div>

        <stockCommButton />

        <div class="card w-full">
            <!--검색1열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 등록일 -->
                <div class="flex items-center gap-2">
                    <label for="registerDate" class="whitespace-nowrap">입고예정일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 발주번호 -->
                <div class="flex items-center gap-2">
                    <label for="orderNumber" class="whitespace-nowrap">발주번호</label>
                    <InputText id="orderNumber" type="text" class="w-60" />
                </div>

                <!-- 자재코드 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">자재코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 자재명 -->
                <div class="flex items-center gap-2">
                    <label for="materialName" class="whitespace-nowrap">자재명</label>
                    <InputText id="materialName" type="text" class="w-60" />
                </div>
            </div>
            <!--end 검색1열-->

            <!--검색2열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 등록일 -->
                <div class="flex items-center gap-2">
                    <label for="registerDate" class="whitespace-nowrap">입고일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 발주번호 -->
                <div class="flex items-center gap-2">
                    <label for="orderNumber" class="whitespace-nowrap">LOT번호</label>
                    <InputText id="orderNumber" type="text" class="w-60" />
                </div>

                <!-- 자재코드 -->
                <div class="flex items-center gap-2 invisible">
                    <label for="materialCode" class="whitespace-nowrap">자재코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 자재명 -->
                <div class="flex items-center gap-2 invisible">
                    <label for="materialName" class="whitespace-nowrap">자재명</label>
                    <InputText id="materialName" type="text" class="w-60" />
                </div>
            </div>
        </div>

        <div class="flex justify-end mb-4 space-x-2">
            <ButtonGroup>
                <Button label="Save" icon="pi pi-check" />
                <Button label="Delete" icon="pi pi-trash" />
                <Button label="Cancel" icon="pi pi-times" />
            </ButtonGroup>
        </div>

        <stockCommTable :columns="tableColumns" :rows="tableData" />
    </div>
</template>
