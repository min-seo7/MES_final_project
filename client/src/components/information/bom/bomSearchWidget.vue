<script setup>
import { ref } from 'vue';

const prodTypeValue = ref('');
</script>

<template>
    <!--
    <div class="flex flex-col">
        <div class="card">
            -->
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
                <!-- BOM번호 -->
                <div class="flex items-center gap-2">
                    <label for="bomCode" class="whitespace-nowrap">BOM번호</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 제품코드 -->
                <div class="flex items-center gap-2">
                    <label for="prodCode" class="whitespace-nowrap">제품코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 자재코드 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">자재코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 제품유형 라디오 그룹 -->

                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">제품유형</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="prodType1" name="prodType" value="반제품" v-model="prodTypeValue" />
                            <label for="prodType1" class="ml-2 mr-4">반제품</label>
                            <RadioButton id="prodType2" name="prodType" value="완제품" v-model="prodTypeValue" />
                            <label for="prodType2" class="ml-2">완제품</label>
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </Toolbar>
</template>
