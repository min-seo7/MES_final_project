<script setup>
import { ref, watch, defineProps } from 'vue';

const items = ref([]);
const currentPage = ref(1);
const rowsPerPage = 10;

const props = defineProps({
    detailData: {
        type: [Array, Object],
        default: () => []
    }
});

function padItems(data) {
    let baseItems = [];
    if (Array.isArray(data)) {
        baseItems = data.map((item, index) => ({
            num: index + 1,
            processId: item.processId,
            processName: item.processName,
            order: item.useOrder,
            status: item.status
        }));
    } else if (data && typeof data === 'object') {
        baseItems = [
            {
                num: 1,
                processId: data.processId,
                processName: data.processName,
                order: data.useOrder,
                status: data.status
            }
        ];
    }

    const totalNeeded = rowsPerPage * Math.ceil(baseItems.length / rowsPerPage || 1);
    const paddingCount = totalNeeded - baseItems.length;

    if (paddingCount > 0) {
        const emptyRows = Array(paddingCount)
            .fill(null)
            .map((_, i) => ({
                num: baseItems.length + i + 1,
                processId: '',
                processName: '',
                order: '',
                status: ''
            }));
        return [...baseItems, ...emptyRows];
    }
    return baseItems;
}

watch(
    () => props.detailData,
    (newVal) => {
        items.value = padItems(newVal);
        currentPage.value = 1; // 페이지 초기화
    },
    { immediate: true }
);

function onPageChange(event) {
    currentPage.value = event.page + 1;
}
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>
    <div class="card mt-4 p-4 border rounded" style="height: 550px">
        <DataTable :value="items" :rows="10" :paginator="true" showGridlines @page="onPageChange">
            <Column field="num" header="" />
            <Column field="processId" header="공정코드" />
            <Column field="processName" header="공정명" />
            <Column field="order" header="순서" />
            <Column field="status" header="상태" />
        </DataTable>
    </div>
</template>
