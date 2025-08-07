<script setup>
import stockCommButton from '@/components/stock/stockCommButton.vue';
import { onBeforeMount, ref } from 'vue';

const customers2 = ref([])

onBeforeMount(() => {
    console.log('검사등록 페이지');

    customers2.value = [
        { name: 'M001', id: '강철판', safety: 100, stock: 50, shortage: 50, unit: 'EA' },
        { name: 'M002', id: '볼트', safety: 200, stock: 100, shortage: 100, unit: 'EA' }
    ]

});
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">검사등록페이지</div>
    </div>
    <div>
        <stockCommButton/>
    </div>


<!--테이블-->
<div class="flex flex-col md:flex-row gap-8">
    <div class="md:w-1/2">
        <div class="card flex flex-col gap-4">
            <div class="font-semibold text-xl mb-4">검사 대기 목록</div>
                <DataTable  :value="customers2" scrollable scrollHeight="400px" class="mt-6" style="width: 100%;">
                    <Column field="name" header="자재코드" style="min-width: 80px" frozen class="font-bold"></Column>
                    <Column field="id" header="자재명" style="min-width: 100px"></Column>
                    <Column field="id" header="안전재고" style="min-width: 80px"></Column>
                    <Column field="id" header="현재고" style="min-width: 80px"></Column>
                    <Column field="id" header="부족" style="min-width: 80px"></Column>
                    <Column field="id" header="단위" style="min-width: 80px"></Column>
                </DataTable>
        </div>
    </div>
    <div class="md:w-1/2">
        <div class="card flex flex-col gap-4">
            <div class="font-semibold text-xl mb-4">자재 입고 검사 등록</div>
            <!--input박스-->
            <div class="purchase-info">
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="name2">검사코드</label>
                            <InputText id="name2" type="text" readonly style="background-color: #f0f0f0;"/>
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="email2">검사명</label>
                            <InputText id="email2" type="text" />
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="name2">발주번호</label>
                            <InputText id="name2" type="text" readonly style="background-color: #f0f0f0;"/>
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="email2">자재코드</label>
                            <InputText id="email2" type="text" readonly style="background-color: #f0f0f0;"/>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="name2">자재명</label>
                            <InputText id="name2" type="text" readonly style="background-color: #f0f0f0;"/>
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="email2">수량</label>
                            <InputText id="email2" type="text" readonly style="background-color: #f0f0f0;"/>
                        </div>
                    </div>
                     <div class="flex flex-wrap gap-4 my-4 ">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="name2">담당자</label>
                            <InputText id="name2" type="text" readonly style="background-color: #f0f0f0;"/>
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="email2">비고</label>
                            <InputText id="email2" type="text" />
                        </div>
                    </div>
            </div>
            
        </div>
    </div>
</div>



</template>
