<script setup></script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>검색조건</div>
        <div class="space-x-2">
            <Button label=" 조회 " rounded />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>

    <Toolbar>
        <template #center>
            <div class="flex items-center gap-6">
                <!-- 흐름도코드 -->
                <div class="flex items-center gap-2">
                    <label for="flowId" class="whitespace-nowrap">흐름도코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="flowId" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 흐름도명 -->
                <div class="flex items-center gap-2">
                    <label for="flowName" class="whitespace-nowrap">흐름도명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="flowName" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 제품코드 -->
                <div class="flex items-center gap-2">
                    <label for="productId" class="whitespace-nowrap">제품코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="productId" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
                <!-- 제품명 -->
                <div class="flex items-center gap-2">
                    <label for="productName" class="whitespace-nowrap">제품명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="productName" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
            </div>
        </template>
    </Toolbar>
</template>
