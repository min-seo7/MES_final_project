<script setup>
import { ref } from 'vue';

const authValue = ref('');
const statusValue = ref('');
</script>

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
                <!-- 제품코드 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">제품코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 제품명 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">제품명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 제품유형 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">제품유형</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="auth1" name="auth" value="반제품" v-model="authValue" />
                            <label for="auth1" class="ml-2 mr-4">반제품</label>
                            <RadioButton id="auth2" name="auth" value="완제품" v-model="authValue" />
                            <label for="auth2" class="ml-2 mr-4">완제품</label>
                        </label>
                    </div>
                </div>

                <!-- 제품형태 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">제품형태</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="status1" name="status" value="분말형" v-model="statusValue" />
                            <label for="status1" class="ml-2 mr-4">분말형</label>
                            <RadioButton id="status2" name="status" value="과립형" v-model="statusValue" />
                            <label for="status2" class="ml-2 mr-4">과립형</label>
                            <RadioButton id="status3" name="status" value="액상형" v-model="statusValue" />
                            <label for="status3" class="ml-2">액상형</label>
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </Toolbar>
</template>
