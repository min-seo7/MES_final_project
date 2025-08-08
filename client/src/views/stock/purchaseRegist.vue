<script>
export default {
    data() {
        return {
            purshaseList: [
                {
                    id: '',
                    mat_id: '',
                    mat_name: '',
                    purch_qty: '',
                    unit: '',
                    patner: '',
                    comm: ''
                }
            ],
            lowMat: [{ id: '1', matCode: 'm001', matName: '왕겨', safeStock: '50', nowStock: '30', shortage: '20', unit: 'kg' }]
        };
    },
    methods: {
        addEmptyRow() {
            this.purshaseList.push({
                id: '1',
                mat_id: '',
                mat_name: '',
                purch_qty: '',
                unit: '',
                patner: '',
                comm: ''
            });
        },
        reset() {
            this.purshaseList.pop({});
        }
    },
    mounted() {
        console.log('발주등록페이지');
    }
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">발주등록페이지</div>
    </div>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" + 추 가 " rounded @click="addEmptyRow()" />
        <Button label=" 등 록 " rounded />
        <Button label=" 초기화 " severity="info" rounded @click="reset()" />
    </div>

    <!--테이블-->
    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">안전재고 기준 미달 자재</div>
                <DataTable :value="lowMat" scrollable scrollHeight="400px" class="mt-6" style="width: 100%">
                    <Column field="matCode" header="자재코드" style="min-width: 80px" frozen class="font-bold"></Column>
                    <Column field="matName" header="자재명" style="min-width: 100px"></Column>
                    <Column field="safeStock" header="안전재고" style="min-width: 80px"></Column>
                    <Column field="nowStock" header="현재고" style="min-width: 80px"></Column>
                    <Column field="shortage" header="부족" style="min-width: 80px"></Column>
                    <Column field="unit" header="단위" style="min-width: 80px"></Column>
                </DataTable>
            </div>
        </div>
        <!--안전재고미달-->
        <!--발주등록-->
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">발주등록</div>
                <!--input입력박스-->
                <div class="purchase-info">
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="reDate">등록일</label>
                            <InputText id="reDate" type="text" class="w-full" dateFormat="yy-mm-dd" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="dueDate">납기요청일</label>
                            <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue" dateFormat="yy-mm-dd"></DatePicker>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="partnerId">공급처코드</label>
                            <IconField iconPosition="left" class="w-full">
                                <InputText id="partnerId" type="text" class="w-full" />
                                <InputIcon class="pi pi-search" />
                            </IconField>
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="email2">공급처</label>
                            <InputText id="email2" type="text" class="w-full" />
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2 invisible">
                            <label for="name2">====</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="email2">담당자</label>
                            <InputText id="email2" type="text" />
                        </div>
                    </div>
                </div>
                <!--입력 input박스끝-->
                <div>
                    <DataTable :value="purshaseList" scrollable scrollHeight="400px" class="mt-6" style="width: 100%">
                        <Column field="mat_id" header="자재코드" style="min-width: 80px" frozen class="font-bold"></Column>
                        <Column field="mat_name" header="자재명" style="min-width: 100px"></Column>
                        <Column field="purch_qty" header="발주량" style="min-width: 80px"></Column>
                        <Column field="unit" header="단위" style="min-width: 80px"></Column>
                        <Column field="patner" header="공급처" style="min-width: 80px"></Column>
                        <Column field="comm" header="비고" style="min-width: 80px"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
