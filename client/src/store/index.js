import { defineStore } from 'pinia';
// pinia를 통해 관리할 store(저장소)를 정의
//  : defineStore(store_id, option 객체 | setup function)
export const useUserStore = defineStore('user', {
    // state : store(저장소)를 통해 관리할 대상(데이터) => data로 작성
    state: () => ({ user: {} }),
    // getters : state의 값을 필터링하거나 readonly로 조회하기 위한 함수 정의 => computed로 작성
    getters: {
        userId: (state) => state.user.id
    },
    // actions : state를 변경하기 위한 함수
    actions: {
        addLoginId(loginId) {
            this.user.id = loginId;
        },
        removeLoginId() {
            this.user = {};
        }
    }
});
