<script setup>
import { ref } from 'vue';

const authValue = ref('');
const statusValue = ref('');
</script>

<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 조회 " rounded />
        <Button label=" 초기화 " severity="info" rounded />
    </div>
    <!--
    <div class="flex flex-col">
        <div class="card">
            -->
    <div class="font-semibold text-xl mb-4">검색조건</div>
    <Toolbar>
        <template #center>
            <div class="flex flex-wrap gap-4 w-full">
                <!-- 사원번호 -->
                <IconField iconPosition="left">
                    사원번호
                    <InputText type="text" placeholder="Search" />
                    <InputIcon class="pi pi-search" />
                </IconField>

                <!-- 부서 -->
                <IconField iconPosition="left">
                    부서
                    <InputText type="text" placeholder="Search" />
                    <InputIcon class="pi pi-search" />
                </IconField>

                <!-- 권한 라디오 그룹 -->
                <div class="flex items-start border rounded p-4 md:w-[40%] w-full">
                    <div class="w-10 font-medium mt-1">권한</div>
                    <div class="flex flex-wrap gap-4 ml-4">
                        <div class="flex items-center">
                            <RadioButton id="auth1" name="auth" value="일반사원" v-model="authValue" />
                            <label for="auth1" class="ml-2">일반사원</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="auth2" name="auth" value="관리자" v-model="authValue" />
                            <label for="auth2" class="ml-2">관리자</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="auth3" name="auth" value="최고관리자" v-model="authValue" />
                            <label for="auth3" class="ml-2">최고관리자</label>
                        </div>
                    </div>
                </div>

                <!-- 상태 라디오 그룹 -->
                <div class="flex items-start border rounded p-4 md:w-[30%] w-full">
                    <div class="w-10 font-medium mt-1">상태</div>
                    <div class="flex flex-wrap gap-4 ml-4">
                        <div class="flex items-center">
                            <RadioButton id="status1" name="status" value="재직" v-model="statusValue" />
                            <label for="status1" class="ml-2">재직</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="status2" name="status" value="휴직" v-model="statusValue" />
                            <label for="status2" class="ml-2">휴직</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="status3" name="status" value="퇴직" v-model="statusValue" />
                            <label for="status3" class="ml-2">퇴직</label>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Toolbar>
    <!--
        </div>
    </div>
    -->
</template>
