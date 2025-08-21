<script setup>
import { onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/store'

const userStore = useUserStore()

onMounted(async () => {
  try {
    const res = await axios.get('api/modal/check-session', {
      withCredentials: true // 쿠키 포함 요청
    })

  if (res.data.result) {
  console.log('로그인 유지됨:', res.data.user);
  userStore.setUser(res.data.user); // 여기 user가 객체면 그대로 넣기
  } else {
  console.log('로그인 상태 아님');
  userStore.clearUser();
 }
  } catch (err) {
    console.error('세션 확인 실패:', err)
  }
})
</script>

<template>
    <router-view />
</template>

<style scoped></style>
