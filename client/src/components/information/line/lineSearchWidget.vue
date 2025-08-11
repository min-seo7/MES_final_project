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
                <!-- 라인번호 -->
                <div class="flex items-center gap-2">
                    <label for="lineId" class="whitespace-nowrap">라인번호</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="lineId" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 라인명 -->
                <div class="flex items-center gap-2">
                    <label for="lineName" class="whitespace-nowrap">라인명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="lineName" type="text" class="w-60" />
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
