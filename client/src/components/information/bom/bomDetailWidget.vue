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
            materialId: item.materialId,
            materialName: item.materialName,
            unit: item.unit,
            mixRatio: item.mixRatio,
            requiredQty: item.requiredQty,
            totalQty: item.totalQty,
            status: item.status
        }));
    } else if (data && typeof data === 'object') {
        baseItems = [
            {
                num: 1,
                materialId: data.materialId,
                materialName: data.materialName,
                unit: data.unit,
                mixRatio: data.mixRatio,
                requiredQty: data.requiredQty,
                totalQty: data.totalQty,
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
                materialId: '',
                materialName: '',
                unit: '',
                mixRatio: '',
                requiredQty: '',
                totalQty: '',
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
        <h2 class="text-xl font-bold">BOM상세</h2>
    </div>
    <div class="card mt-4 p-4 border rounded" style="height: 550px">
        <DataTable :value="items" :rows="rowsPerPage" :paginator="true" showGridlines @page="onPageChange">
            <Column field="num" header="" />
            <Column field="materialId" header="자재코드" />
            <Column field="materialName" header="자재명" />
            <Column field="unit" header="단위" />
            <Column field="mixRatio" header="혼합율" />
            <Column field="requiredQty" header="소요량" />
            <Column field="totalQty" header="총소요량" />
            <Column field="status" header="상태" />
        </DataTable>
    </div>
</template>
