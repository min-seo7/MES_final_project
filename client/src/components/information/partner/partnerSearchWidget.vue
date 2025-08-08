<script setup>
import { ref } from 'vue';

const typeValue = ref('');
const statusValue = ref('');
</script>

<template>
    <!--
    <div class="flex flex-col">
        <div class="card">
            -->
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>검색조건</div>
        <div class="space-x-2">
            <Button label=" 조회 " rounded />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>

    <Toolbar>
        <template #center>
            <div class="flex items-center gap-6">
                <!-- 거래처코드 -->
                <div class="flex items-center gap-2">
                    <label for="pId" class="whitespace-nowrap">거래처코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 거래처명 -->
                <div class="flex items-center gap-2">
                    <label for="pName" class="whitespace-nowrap">거래처명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 거래처유형 라디오 그룹 -->

                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">거래처유형</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="type1" name="type" value="판매처" v-model="typeValue" />
                            <label for="type1" class="ml-2 mr-4">판매처</label>
                            <RadioButton id="type2" name="type" value="공급처" v-model="typeValue" />
                            <label for="type2" class="ml-2 mr-4">공급처</label>
                            <RadioButton id="type3" name="type" value="폐기물업체" v-model="typeValue" />
                            <label for="type3" class="ml-2 mr-4">폐기물업체</label>
                            <RadioButton id="type4" name="type" value="배송업체" v-model="typeValue" />
                            <label for="type4" class="ml-2">배송업체</label>
                        </label>
                    </div>
                </div>

                <!-- 상태 라디오 그룹 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">상태</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="status1" name="status" value="활성" v-model="statusValue" />
                            <label for="status1" class="ml-2 mr-4">활성</label>
                            <RadioButton id="status2" name="status" value="비활성" v-model="statusValue" />
                            <label for="status2" class="ml-2">비활성</label>
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </Toolbar>
</template>
