<script setup>
import { ref } from 'vue';

const authValue = ref('');
const statusValue = ref('');
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
                <!-- 사원번호 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">사원번호</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 부서 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">부서</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 권한 라디오 그룹 -->

                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">권한</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="auth1" name="auth" value="일반사원" v-model="authValue" />
                            <label for="auth1" class="ml-2 mr-4">일반사원</label>
                            <RadioButton id="auth2" name="auth" value="관리자" v-model="authValue" />
                            <label for="auth2" class="ml-2 mr-4">관리자</label>
                            <RadioButton id="auth3" name="auth" value="최고관리자" v-model="authValue" />
                            <label for="auth3" class="ml-2">최고관리자</label>
                        </label>
                    </div>
                </div>

                <!-- 상태 라디오 그룹 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">상태</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="status1" name="status" value="재직" v-model="statusValue" />
                            <label for="status1" class="ml-2 mr-4">재직</label>
                            <RadioButton id="status2" name="status" value="휴직" v-model="statusValue" />
                            <label for="status2" class="ml-2 mr-4">휴직</label>
                            <RadioButton id="status3" name="status" value="퇴직" v-model="statusValue" />
                            <label for="status3" class="ml-2">퇴직</label>
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </Toolbar>
</template>
