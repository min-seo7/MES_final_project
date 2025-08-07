<script setup>
import stockCommButton from '@/components/stock/stockCommButton.vue';
//import stockCommSearchBox from '@/components/stock/stockCommSearchBox.vue';
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">발주조회페이지</div>
    </div>
    <stockCommButton />

    <div class="flex flex-col items-center">
        <!--검색박스영역-->
        <div class="card w-full">
            <!--검색1열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 등록일 -->
                <div class="flex items-center gap-2">
                    <label for="registerDate" class="whitespace-nowrap">등록일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue"></DatePicker>
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
        <!--테이블 -->
        <div class="card">
            <DataTable
                :value="customers3"
                rowGroupMode="subheader"
                selectionMode="checkbox"
                groupRowsBy="representative.name"
                sortMode="single"
                sortField="representative.name"
                :sortOrder="1"
                scrollable
                scrollHeight="400px"
                tableStyle="min-width: 50rem"
            >
                <template #groupheader="slotProps">
                    <div class="flex items-center gap-2">
                        <img :alt="slotProps.data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.data.representative.image}`" width="32" style="vertical-align: middle" />
                        <span>{{ slotProps.data.representative.name }}</span>
                    </div>
                </template>
                <Column field="representative.name" header="Representative"></Column>
                <Column field="name" header="발행번호" style="min-width: 200px" selectionMode="checkbox"></Column>
                <Column field="date" header="등록일" style="min-width: 30px"></Column>
                <Column field="country" header="자재코드" style="min-width: 30px"></Column>
                <Column field="company" header="자재명" style="min-width: 100px"></Column>
                <Column field="status" header="발주수량" style="min-width: 30px"></Column>
                <Column field="status" header="단위" style="min-width: 50px"></Column>
                <Column field="status" header="공급처" style="min-width: 200px"></Column>
                <Column field="status" header="담당자" style="min-width: 200px"></Column>
                <Column field="date" header="납기요청일" style="min-width: 200px"></Column>
            </DataTable>
        </div>
    </div>
</template>
