<script setup>
import { ref } from 'vue';
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
                <!-- 창고번호 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">창고코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="warehouseId" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 창고 -->
                <div class="flex items-center gap-2">
                    <label for="warehouse" class="whitespace-nowrap">창고</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="warehouse" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 구역 -->
                <div class="flex items-center gap-2">
                    <label for="zone" class="whitespace-nowrap">구역</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="zone" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 세부구역 -->
                <div class="flex items-center gap-2">
                    <label for="subZone" class="whitespace-nowrap">세부구역</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="subZone" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 층 -->
                <div class="flex items-center gap-2">
                    <label for="floor" class="whitespace-nowrap">층</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="floor" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
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
