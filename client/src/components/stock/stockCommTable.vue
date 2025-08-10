<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
    components: {DataTable, Column},
    props: {
        columns: {
            type: Array,
            required: true
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
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> <!--채크박스영역-->

            <!--컬럼 동적으로 사용. 호출하는 곳 data()영역에 columns 정의해줄것. 
                columns : [{field:'matName', header: '자재명' },{field:'matCode', header: '자재코드'}]-->
            <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :headerStyle="col.headerStyle"/>
        </DataTable>
    </div>
</template>
