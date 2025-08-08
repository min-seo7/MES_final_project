<script>
export default {
    name: 'stockCommTable',
    props: {
        columns: {
            type: Array,
            required: true
            // 예: [{ field: 'reDate', header: '등록일' }, ...]
        },
        rows: {
            type: Array,
            required: true
        }
    }
};
</script>

<template>
    <div class="card w-full">
        <DataTable :value="rows" dataKey="id" tableStyle="min-width: 50rem">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <!-- 동적 컬럼 렌더링 -->
            <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" />
        </DataTable>
    </div>
</template>
