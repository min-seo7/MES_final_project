<script setup>
import { ref } from 'vue';

const items = ref([]);
</script>

<template>
    <!--
    <div class="flex flex-col">
        <div class="card">
            
    <div class="p-4">
                    -->
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">직원 목록</h2>
        <div class="flex gap-2">
            <Button label="등록" icon="pi pi-plus" />
            <Button label="삭제" icon="pi pi-trash" severity="danger" />
        </div>
    </div>

    <DataTable :value="items" :rows="5" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="ecode" header="사원번호" />
        <Column field="name" header="이름" />
        <Column field="department" header="부서" />
        <Column field="phone" header="연락처" />
        <Column field="email" header="이메일" />
        <Column field="hiredate" header="입사일자" />
        <Column field="enddate" header="퇴사일자" />
        <Column field="pw" header="비밀번호" />

        <Column field="pwstatus" header="비밀번호변경유무" />
        <Column field="status" header="상태" />
        <Column field="role" header="권한" />
    </DataTable>

    <!--
        </div>
        </div>
    </div>
    -->
</template>
