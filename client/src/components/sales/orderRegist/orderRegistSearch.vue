<script setup></script>
<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="조회" rounded />
        <Button label="초기화" severity="info" rounded />
    </div>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl mb-4">검색</div>
            <Toolbar>
                <template #center>
                    <IconField>
                        <div class="flex flex-col md:flex-row gap-2">
                            <div class="font-semibold text-xl mb-2">
                                거래처코드
                                <InputText type="text" placeholder="Default" />
                                <Button type="button" class="mr-2 mb-2" icon="pi pi-search" />
                            </div>
                            <div class="font-semibold text-xl mb-4">
                                배송지
                                <InputText type="text" placeholder="Disabled" :disabled="true" />
                            </div>
                            <div class="font-semibold text-xl mb-4">
                                공급대가
                                <InputText type="text" placeholder="100000000000" :disabled="true" />
                            </div>
                            <div class="font-semibold text-xl mb-4">
                                공급가액
                                <InputText type="text" placeholder="9000000000" :disabled="true" />
                            </div>
                            <div class="font-semibold text-xl mb-4">
                                대표자
                                <InputText type="text" placeholder="홍oo" :disabled="true" />
                            </div>
                            <div class="font-semibold text-xl mb-4">
                                거래처명
                                <InputText type="text" placeholder="농협" :disabled="true" />
                            </div>
                        </div>
                    </IconField>
                </template>
            </Toolbar>
        </div>
    </div>
</template>
