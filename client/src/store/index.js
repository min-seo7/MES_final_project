import { defineStore } from 'pinia';
// pinia를 통해 관리할 store(저장소)를 정의
//  : defineStore(store_id, option 객체 | setup function)
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // 로그인 안 됐을 땐 null로 초기화 권장
  }),
  getters: {
    userId: (state) => state.user?.id ?? null,
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
  },
});