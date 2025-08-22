<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['partnerFilterSearch']);

const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const search = ref({
    partnerId: '',
    partnerName: '',
    partnerType: '',
    status: ''
});

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;
    selectedItem.value = null;

    if (type === 'partnerName') {
        resetSearch();
        const res = await axios.get('/api/information/partner/getPartnerName');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            partnerName: item.partner_name
        }));
        columns.value = [{ field: 'partnerName', header: '거래처명' }];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    search.value.partnerId = selectedItem.value.partnerId;
    search.value.partnerName = selectedItem.value.partnerName;
    search.value.partnerType = selectedItem.value.partnerType;
    search.value.status = selectedItem.value.status;

    showModal.value = false;
};

// 선택필터초기화
const resetSearch = () => {
    search.value.partnerId = '';
    search.value.partnerName = '';
    search.value.partnerType = '';
    search.value.status = '';
    selectedItem.value = null;

    selectSearch();
};

// 검색
const selectSearch = async () => {
    try {
        const payload = {
            partnerId: search.value.partnerId || null,
            partnerName: search.value.partnerName || null,
            partnerType: search.value.partnerType || null,
            status: search.value.status || null
        };

        const res = await axios.post('/api/information/partner/search', payload);
        console.log(res.data.result);
        emits('partnerFilterSearch', res.data.result);
    } catch (err) {
        console.log('거래처검색실패');
    }
};

onMounted(() => {
    selectSearch();
});
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>검색조건</div>
        <div class="space-x-2">
            <Button label=" 조회 " size="small" rounded @click="selectSearch"></Button>
            <Button label=" 초기화 " size="small" severity="info" rounded @click="resetSearch"></Button>
        </div>
    </div>

    <Toolbar>
        <template #center>
            <div class="flex items-center gap-6">
                <!-- 거래처코드 -->
                <div class="flex items-center gap-2">
                    <label for="partnerId" class="whitespace-nowrap">거래처코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="partnerId" type="text" class="w-60" v-model="search.partnerId" />
                    </IconField>
                </div>

                <!-- 거래처명 -->
                <div class="flex items-center gap-2">
                    <label for="partnerName" class="whitespace-nowrap">거래처명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="partnerName" type="text" class="w-60" v-model="search.partnerName" />
                        <InputIcon class="pi pi-search" @click="openModal('partnerName')" />
                    </IconField>
                </div>

                <!-- 거래처유형 라디오 그룹 -->

                <div class="flex items-center gap-2">
                    <label for="partnerType" class="whitespace-nowrap">거래처유형</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="type1" name="type" value="판매처" v-model="search.partnerType" />
                            <label for="type1" class="ml-2 mr-4">판매처</label>
                            <RadioButton id="type2" name="type" value="공급처" v-model="search.partnerType" />
                            <label for="type2" class="ml-2 mr-4">공급처</label>
                            <RadioButton id="type3" name="type" value="폐기물업체" v-model="search.partnerType" />
                            <label for="type3" class="ml-2 mr-4">폐기물업체</label>
                            <RadioButton id="type4" name="type" value="배송업체" v-model="search.partnerType" />
                            <label for="type4" class="ml-2">배송업체</label>
                        </label>
                    </div>
                </div>

                <!-- 상태 라디오 그룹 -->
                <div class="flex items-center gap-2">
                    <label for="status" class="whitespace-nowrap">상태</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="status1" name="status" value="사용" v-model="search.status" />
                            <label for="status1" class="ml-2 mr-4">사용</label>
                            <RadioButton id="status2" name="status" value="미사용" v-model="search.status" />
                            <label for="status2" class="ml-2">미사용</label>
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </Toolbar>
    <CommonModal v-model:visible="showModal" :modalType="modalType" :items="items" :columns="columns" v-model:selectedItem="selectedItem" @confirm="selectModalValue" />
</template>
