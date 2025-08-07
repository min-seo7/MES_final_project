<script setup>
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

const products = ref([
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 200 },
    { id: 3, name: 'Product C', price: 300 },
    { id: 4, name: 'Product D', price: 400 },
    { id: 5, name: 'Product E', price: 500 }
]);

const onCellEditComplete = (event) => {
    // event 객체에서 편집된 정보를 가져옵니다.
    let { data, newValue, field } = event;

    // 예시: 가격이 0보다 작으면 업데이트하지 않음
    if (field === 'price' && newValue < 0) {
        console.error('가격은 0보다 작을 수 없습니다.');
        return;
    }

    // 데이터 업데이트
    data[field] = newValue;
    // 여기에서 API 호출 등의 로직을 추가할 수 있습니다.
};
</script>
<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 조회 " rounded />
        <Button label=" 초기화 " severity="info" rounded />
    </div>
    <!-- <div class="flex mt-8">
        <div class="card flex">
            <InputGroup>
                <label for="lastname">생산계획코드</label>
                <InputText placeholder="Keyword" />
                <InputGroupAddon>
                    <Button icon="pi pi-search" severity="secondary" variant="text" @click="toggle" />
                </InputGroupAddon>
            </InputGroup>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="lastname">지시자</label>
                    <InputText id="lastname" type="text" readonly />
                </div>
            </div>
        </div>
    </div> -->
    <div class="card flex flex-col md:flex-row gap-4 w-full">
        <div class="flex flex-col gap-2 w-full">
            <!-- <label for="planCode">생산계획코드</label>
            <InputText id="planCode" type="text" /> -->
            <InputGroup>
                <label for="lastname">생산계획코드</label>
                <InputText placeholder="Keyword" />
                <InputGroupAddon>
                    <Button icon="pi pi-search" severity="secondary" variant="text" @click="toggle" />
                </InputGroupAddon>
            </InputGroup>
        </div>

        <div class="flex flex-col gap-2 w-full">
            <!-- <label for="assigner">지시자</label>
            <InputText id="assigner" type="text" readonly /> -->
            <div class="flex flex-wrap gap-2 w-full">
                <label for="lastname">지시자</label>
                <InputText id="lastname" type="text" readonly />
            </div>
        </div>
    </div>
    <div class="flex mt-8">
        <DataTable
            :value="products"
            scrollable
            scrollHeight="400px"
            editMode="cell"
            @cell-edit-complete="onCellEditComplete"
            :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }) => ({
                        class: [{ '!py-0': state['d_editing'] }]
                    })
                }
            }"
        >
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="width: 25%">
                <template #body="{ data, field }">
                    {{ field === 'price' ? formatCurrency(data[field]) : data[field] }}
                </template>
                <template #editor="{ data, field }">
                    <template v-if="field !== 'price'">
                        <InputText v-model="data[field]" autofocus fluid />
                    </template>
                    <template v-else>
                        <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US" autofocus fluid />
                    </template>
                </template>
            </Column>
        </DataTable>
    </div>
    <!-- <div class="card">
        <div class="font-semibold text-xl mb-4">Frozen Columns</div>
        <ToggleButton v-model="balanceFrozen" onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Balance" offLabel="Balance" />

        <DataTable :value="customers2" class="mt-6">
            <Column field="name" header="Name" style="min-width: 200px" frozen class="font-bold"></Column>
            <Column field="id" header="Id" style="min-width: 100px" value="a">1</Column>
            <Column field="name" header="Name" style="min-width: 200px">2</Column>
            <Column field="country.name" header="Country" style="min-width: 200px">3</Column>
            <Column field="date" header="Date" style="min-width: 200px">4</Column>
            <Column field="company" header="Company" style="min-width: 200px">5</Column>
            <Column field="status" header="Status" style="min-width: 200px">6</Column>
            <Column field="activity" header="Activity" style="min-width: 200px">7</Column>
            <Column field="representative.name" header="Representative" style="min-width: 200px">8</Column>
            <Column field="balance" header="Balance" style="min-width: 200px" alignFrozen="right" :frozen="balanceFrozen">
                <template #body="{ data }">
                    <span class="font-bold">{{ formatCurrency(data.balance) }}</span>
                </template>
            </Column>
        </DataTable>
    </div> -->
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
    .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
.flex-warp {
    text-align: right;
}
</style>
