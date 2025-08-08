<script setup>
import stockCommButton from '@/components/stock/stockCommBtn.vue';
//import stockCommSearchBox from '@/components/stock/stockCommSearchBox.vue';
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">발주조회페이지</div>
    </div>
    <stockCommButton />

    <!--검색박스영역-->
    <div class="card w-full">
        <!--검색1열-->
        <div class="flex flex-wrap justify-center gap-6 my-6">
            <!-- 등록일 -->
            <div class="flex items-center gap-2">
                <label for="registerDate" class="whitespace-nowrap">등록일</label>
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
    </div>
    <!--삭제버튼-->
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="삭제" />
    </div>
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
</template>
