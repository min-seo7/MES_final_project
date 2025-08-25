<script setup>
import axios from 'axios';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import { useUserStore } from '@/store/index';
import { useRouter } from 'vue-router';

// 로그인 정보 (양방향 바인딩용)
const loginInfo = ref({});

// 스토어 사용
const userStore = useUserStore();

// 라우터 사용
const router = useRouter();

import biryong from './img/biryong.png';

// 로그인 함수
const userLogin = async () => {
    try {
        console.log('1. 요청 데이터:', loginInfo.value);
        const result = await axios.post('/api/modal/login', loginInfo.value);
        const loginRes = result.data;
        console.log('2. 서버 응답 결과:', result.status, loginRes);
        console.log(loginRes.name);

        if (loginRes.result) {
            userStore.setUser(loginRes);
            alert('로그인 성공!');
            router.push({ name: 'employee' }); //로그인 후 이동경로
        } else {
            alert(loginRes.message);
        }
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="page-background flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img :src="biryong" alt="Biryong" class="mb-10 w-40 shrink-0 mx-auto" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4 flex justify-center items-center">Biryong</div>
                    </div>

                    <div>
                        <form @submit.prevent="userLogin">
                            <label for="eId" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">사원번호</label>
                            <InputText id="eId" type="text" class="w-full md:w-[30rem] mb-8" v-model="loginInfo.eId" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">비밀번호</label>
                            <Password id="password1" v-model="loginInfo.password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                            <Button label="로그인" type="submit" class="w-full mt-3"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-background {
    background-color: #beef79;
}

.dark .page-background {
    background-color: #003300;
}

/* 기존 스타일 */
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
