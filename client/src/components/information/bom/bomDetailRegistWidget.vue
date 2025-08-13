<script setup>
import { ref, defineEmits } from 'vue';

const emits = defineEmits(['bomDetail']);

const form = ref({
    materialId: '',
    materialName: '',
    unit: '',
    mixRatio: '',
    requiredQty: '',
    totalQty: '',
    status: ''
});

const addBOMdetail = () => {
    emits('bomDetail', form.value);
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div></div>
        <div class="space-x-2">
            <Button label=" 추가 " rounded @click="addBOMdetail()" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded" style="height: 550px">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">자재코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText v-model="form.materialId" class="w-full" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
                <div>
                    <label class="block mb-1">자재명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText v-model="form.materialName" class="w-full" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
                <div>
                    <label class="block mb-1">단위</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="unit1" name="unit" value="kg" v-model="form.unit" />
                        <label for="unit1" class="ml-2 mr-4">kg</label>
                        <RadioButton id="unit2" name="unit" value="L" v-model="form.unit" />
                        <label for="unit2" class="ml-2 mr-4">L</label>
                    </label>
                </div>
                <div>
                    <label class="block mb-1">혼합율</label>
                    <InputText v-model="form.mixRatio" class="w-full" />%
                </div>
                <div>
                    <label class="block mb-1">소요량</label>
                    <InputText v-model="form.requiredQty" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">총소요량</label>
                    <InputText v-model="form.totalQty" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">상태</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="활성" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">활성</label>
                        <RadioButton id="status2" name="status" value="비활성" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">비활성</label>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.font-semibold.text-xl.mb-4 {
    margin: 0;
}
</style>
