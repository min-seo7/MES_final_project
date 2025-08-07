<script setup>
import { ref } from 'vue';

const items = ref([
    { id: 1, name: '홍길동', department: '생산팀', position: '사원' },
    { id: 2, name: '김영희', department: '품질팀', position: '대리' },
    { id: 3, name: '이철수', department: '설비팀', position: '과장' }
]);
</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">직원 목록</h2>
                    <div class="flex gap-2">
                        <Button label="등록" icon="pi pi-plus" />
                        <Button label="삭제" icon="pi pi-trash" severity="danger" />
                    </div>
                </div>

                <DataTable :value="items" :rows="5" :paginator="true" showGridlines>
                    <Column field="id" header="ID" />
                    <Column field="name" header="이름" />
                    <Column field="department" header="부서" />
                    <Column field="position" header="직급" />
                </DataTable>
            </div>
        </div>
    </div>
</template>
