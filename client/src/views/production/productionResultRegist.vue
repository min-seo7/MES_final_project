<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const products = ref([
    {
        process: '분말형',
        line: 'A01',
        planQuantity: 10000,
        productionQuantity: 1000,
        productName: '분말형비료 20kg',
        equipmentCode: 'EQ-COMB-01',
        equipmentName: '배합기#1',
        startDate: '2025-08-10 09:00',
        endDate: '2025-08-12 17:30',
        status: '완료'
    },
    {
        process: '분말형',
        line: 'A01',
        planQuantity: 10000,
        productionQuantity: 1000,
        productName: '분말형비료 20kg',
        equipmentCode: 'EQ-FERM-01',
        equipmentName: '발효기#1',
        startDate: '2025-08-10 09:00',
        endDate: '2025-08-12 17:30',
        status: '진행'
    }
    // ... 이미지에 표시된 다른 행 데이터들
]);

const onCellEditComplete = (event) => {
    // 셀 수정 완료 시 처리 로직을 여기에 구현
    console.log('셀 수정 완료:', event);
};
</script>
<template>
    <div class="col-span-1 flex items-center gap-2">
        <div class="w-full flex justify-end gap-2">
            <Button label=" 실적등록 " rounded @click="performanceInsert" />
            <Button label=" 실적시작 " rounded @click="registStartPerformance" />
            <Button label=" 실적종료 " rounded @click="registEndPerformance" />
            <Button label=" 초기화 " severity="info" rounded @click="resetData" />
        </div>
    </div>
    <div class="p-6 bg-gray-100 min-h-screen">
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <div class="grid grid-cols-4 gap-4 items-center">
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">작업자</label>
                    <InputText class="flex-1" value="박형식" />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">공정</label>
                    <InputText class="flex-1" value="분말형" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">실적시작일시</label>
                    <Calendar class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" value="2025-08-10 09:00" />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">실적종료일시</label>
                    <Calendar class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" value="2025-08-12 17:30" />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">계획수량</label>
                    <InputNumber class="flex-1" value="10000" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">라인</label>
                    <InputText class="flex-1" value="A01" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">제품명</label>
                    <InputText class="flex-1" value="분말형 비료 20kg" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">실적번호</label>
                    <InputText class="flex-1" value="PR20250812-001" disabled />
                </div>

                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">설비 코드</label>
                    <InputText class="flex-1" value="EQ-COMB-01" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">설비명</label>
                    <InputText class="flex-1" value="배합기#1" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">생산 수량</label>
                    <InputNumber class="flex-1" value="1000" disabled />
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <DataTable :value="products" scrollable scrollHeight="400px" editMode="cell" @cell-edit-complete="onCellEditComplete">
                <Column field="process" header="공정"></Column>
                <Column field="line" header="라인"></Column>
                <Column field="planQuantity" header="계획수량"></Column>
                <Column field="productionQuantity" header="생산수량"></Column>
                <Column field="productName" header="제품명"></Column>
                <Column field="equipmentCode" header="설비코드"></Column>
                <Column field="equipmentName" header="설비명"></Column>
                <Column field="startDate" header="작업시작일시"></Column>
                <Column field="endDate" header="작업종료일시"></Column>
                <Column field="status" header="상태"></Column>
            </DataTable>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
    .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
