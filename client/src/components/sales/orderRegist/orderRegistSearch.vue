<script setup>
// import { ref } from 'vue';
import InputGroup from 'primevue/inputgroup';
// import InputGroupAddon from 'primevue/inputgroupaddon';
</script>

<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="조회" rounded />
        <Button label="초기화" severity="info" rounded />
    </div>
    <div class="font-semibold text-xl mb-4">검색</div>
    <Toolbar>
        <template #center>
            <IconField>
                <div class="flex flex-col gap-6 items-center">
                    <!-- 1행 -->
                    <div class="flex flex-wrap justify-between w-[90%] gap-y-6">
                        <div class="flex flex-col basis-[45%]">
                            <label class="font-semibold text-sm mb-1">거래처코드</label>
                            <InputGroup>
                                <InputText placeholder="SUP002" />
                                <Button icon="pi pi-search" />
                            </InputGroup>
                        </div>
                        <div class="flex flex-col basis-[45%]">
                            <label class="font-semibold text-sm mb-1">배송지</label>
                            <InputText type="text" placeholder="LA" disabled />
                        </div>

                        <!-- 2행 -->
                        <div class="flex flex-col basis-[45%]">
                            <label class="font-semibold text-sm mb-1">공급단가</label>
                            <InputText type="text" placeholder="10000000000000" disabled />
                        </div>
                        <div class="flex flex-col basis-[45%]">
                            <label class="font-semibold text-sm mb-1">공급가액</label>
                            <InputText type="text" placeholder="9000000000000" disabled />
                        </div>

                        <!-- 3행 -->
                        <div class="flex flex-col basis-[45%]">
                            <label class="font-semibold text-sm mb-1">대표자</label>
                            <InputText type="text" placeholder="홍○○" disabled />
                        </div>
                        <div class="flex flex-col basis-[45%]">
                            <label class="font-semibold text-sm mb-1">거래처명</label>
                            <InputText type="text" placeholder="테존 랜치" disabled />
                        </div>
                    </div>
                </div>
            </IconField>
        </template>
    </Toolbar>

    <br />
    <div class="card">
        <DataTable :value="orders" dataKey="id" tableStyle="min-width: 60rem">
            <!-- 제품명 선택 -->
            <Column field="productName" header="제품명">
                <template #body="slotProps">
                    <Dropdown v-model="slotProps.data.productName" :options="productOptions" placeholder="제품 선택" class="w-full" />
                </template>
            </Column>

            <!-- 수량 -->
            <Column field="quantity" header="수량">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.quantity" :min="1" showButtons />
                </template>
            </Column>

            <!-- 납기일 -->
            <Column field="deliveryDate" header="납기일">
                <template #body="slotProps">
                    <Calendar v-model="slotProps.data.deliveryDate" dateFormat="yy-mm-dd" />
                </template>
            </Column>

            <!-- 규격 -->
            <Column field="spec" header="규격">
                <template #body="slotProps">
                    <InputText v-model="slotProps.data.spec" />
                </template>
            </Column>

            <!-- 제품단가 -->
            <Column field="unitPrice" header="제품단가">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.unitPrice" :min="0" />
                </template>
            </Column>

            <!-- 공급가액 -->
            <Column field="supplyAmount" header="공급가액">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.supplyAmount" :min="0" />
                </template>
            </Column>
        </DataTable>

        <!-- 주문내역 추가 버튼 -->
        <div class="mt-3 text-center">
            <Button label="주문내역 추가" icon="pi pi-plus" @click="addOrder" />
        </div>
    </div>
</template>
<style></style>
