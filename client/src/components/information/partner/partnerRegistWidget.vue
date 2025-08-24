<script setup>
import { ref, defineProps, watch } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import RadioButton from 'primevue/radiobutton';

const item = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    }
});

const form = ref({
    partnerType: '',
    partnerId: '',
    partnerName: '',
    businessNo: '',
    manager: '',
    address: '',
    email: '',
    emailDomain: '',
    mainTel: '',
    status: ''
});

const modifyPartner = async () => {
    try {
        // 수정 시 이메일 도메인 합치기
        if (form.value.emailDomain) {
            form.value.email = form.value.email.split('@')[0] + '@' + form.value.emailDomain;
        }

        const res = await axios.post('/api/information/partner/modify', form.value);
        form.value = {
                partnerType: '',
                partnerId: '',
                partnerName: '',
                businessNo: '',
                manager: '',
                address: '',
                email: '',
                emailDomain: '',
                mainTel: '',
                status: ''
            };
        
        alert('수정이 완료되었습니다.');
    } catch (err) {
        alert('수정할 수 없습니다.');
    }
};

const resetRegist = async () => {
    if (form.value.partnerId?.trim()) {
        // 수정 상태: 현재 선택된 데이터를 다시 form에 반영
        if (props.items && props.items.length) {
            form.value = { ...props.items[0], partnerId: props.items[0].partnerId?.trim() || '' };
        }
    } else {
        // 등록 상태: 전체 필드 초기화
        form.value = {
            partnerType: '',
            partnerId: '',
            partnerName: '',
            businessNo: '',
            manager: '',
            address: '',
            email: '',
            emailDomain: '',
            mainTel: '',
            status: ''
        };
    }
};

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;
    selectedItem.value = null;

    if (type === 'partnerType') {
        const partners = ['판매처', '공급처', '폐기물업체', '배송업체'];
        item.value = partners.map((partner) => ({ partnerType: partner }));
        columns.value = [{ field: 'partnerType', header: '거래처유형' }];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    form.value.partnerType = selectedItem.value.partnerType;

    showModal.value = false;
};

watch(
    () => props.items,
    (newVal) => {
        if (newVal && newVal.length) {
            form.value = { ...newVal[0], partnerId: newVal[0].partnerId?.trim() || '' };
        } else {
            form.value = {
                partnerType: '',
                partnerId: '',
                partnerName: '',
                businessNo: '',
                manager: '',
                address: '',
                email: '',
                emailDomain: '',
                mainTel: '',
                status: ''
            };
        }
    },
    { immediate: true }
);

const emailDomains = ['naver.com', 'gmail.com', 'daum.net', 'hanmail.net', 'nate.com'];

const registPartner = async () => {
    try {
        // 등록 시 이메일 도메인 합치기
        if (form.value.emailDomain) {
            form.value.email = form.value.email.split('@')[0] + '@' + form.value.emailDomain;
        }
        
        const res = await axios.post('/api/information/partner', form.value);
        form.value = {
                partnerType: '',
                partnerId: '',
                partnerName: '',
                businessNo: '',
                manager: '',
                address: '',
                email: '',
                emailDomain: '',
                mainTel: '',
                status: ''
            };
        alert('등록이 완료되었습니다.');
    } catch (err) {
        alert('등록할 수 없습니다.');
    }
};

const onPhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자만 추출
    if (value.length > 3 && value.length <= 7) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length > 7) {
        value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
    }
    form.value.mainTel = value;
};

const onBusinessNoInput = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자만 추출
    if (value.length > 3 && value.length <= 5) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length > 5) {
        value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5, 10);
    }
    form.value.businessNo = value;
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div></div>
        <div class="space-x-2">
            <Button label=" 등록 " size="small" rounded @click="registPartner()" :disabled="form.partnerId?.trim() !== ''" />
            <Button label=" 수정 " size="small" rounded :disabled="form.partnerId?.trim() === ''" @click="modifyPartner()" />
            <Button label=" 초기화 " size="small" severity="info" rounded @click="resetRegist()" />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">거래처코드</label>
                    <InputText v-model="form.partnerId" class="w-full" readonly placeholder="자동생성" style="background-color: lightgrey" />
                </div>
                <div>
                    <label class="block mb-1">거래처유형</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="partnerType" type="text" class="w-full" v-model="form.partnerType" />
                        <InputIcon class="pi pi-search" @click="openModal('partnerType')" />
                    </IconField>
                </div>
                <div>
                    <label class="block mb-1">담당자 E-Mail</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.email" placeholder="이메일 아이디" class="w-2/3" />
                        <span class="self-center">@</span>
                        <select v-model="form.emailDomain" class="w-1/3 h-[38px] border rounded px-2">
                            <option value="" disabled>선택</option>
                            <option v-for="domain in emailDomains" :key="domain" :value="domain">{{ domain }}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block mb-1">거래처주소</label>
                    <InputText v-model="form.address" class="w-full" />
                </div>
            </div>

            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">거래처명</label>
                    <InputText v-model="form.partnerName" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">사업자번호</label>
                    <InputText :value="form.businessNo" @input="onBusinessNoInput" class="w-full" />
                </div>
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label class="block mb-1">담당자</label>
                        <InputText v-model="form.manager" class="w-full" />
                    </div>
                    <div class="flex-1">
                        <label class="block mb-1">대표번호</label>
                        <InputText :value="form.mainTel" @input="onPhoneInput" class="w-full" />
                    </div>
                </div>
                <div>
                    <label class="block mb-1">상태</label>
                    <div class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="사용" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">사용</label>
                        <RadioButton id="status2" name="status" value="미사용" v-model="form.status" />
                        <label for="status2" class="ml-2">미사용</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CommonModal v-model:visible="showModal" :modalType="modalType" :items="item" :columns="columns" v-model:selectedItem="selectedItem" @confirm="selectModalValue" />
</template>

<style scoped>
.font-semibold.text-xl.mb-4 {
    margin: 0;
}
</style>