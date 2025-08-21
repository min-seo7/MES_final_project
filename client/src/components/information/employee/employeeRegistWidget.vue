<script setup>
import { ref, defineProps, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    }
});

const form = ref({
    name: '',
    phone: '',
    email: '',
    hireDate: '',
    leaveDate: '',
    employeeId: '',
    auth: '',
    department: ''
});

watch(
    () => props.items,
    (newVal) => {
        if (newVal && newVal.length) {
            // 공백이면 빈 문자열로 변환
            form.value = {
                ...newVal[0],
                employeeId: newVal[0].employeeId?.trim() || ''
            };
        } else {
            form.value = {
                employeeId: '',
                name: '',
                phone: '',
                email: '',
                hireDate: '',
                leaveDate: '',
                auth: '',
                department: '',
                status: ''
            };
        }
    },
    { immediate: true }
);

const emailDomains = ['naver.com', 'gmail.com', 'daum.net', 'hanmail.net', 'nate.com'];

const registEmployee = async () => {
    try {
        // 도메인을 선택했으면 합쳐서 email 완성
        if (form.value.emailDomain) {
            form.value.email = form.value.email.split('@')[0] + '@' + form.value.emailDomain;
        }
        const res = await axios.post('/api/information/employee', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('사원등록실패');
    }
};

const modifyEmployee = async () => {
    try {
        const res = await axios.post('/api/information/employee/modify', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('사원수정실패');
    }
}

const onPhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자만 추출
    if (value.length > 3 && value.length <= 7) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length > 7) {
        value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
    }
    form.value.phone = value;
};

const resetRegist = async () => {
    if (form.value.employeeId?.trim()) {
        // 수정 상태: 현재 선택된 데이터를 다시 form에 반영
        if (props.items && props.items.length) {
            form.value = { ...props.items[0], employeeId: props.items[0].employeeId?.trim() || '' };
        }
    } else {
        // 등록 상태: 전체 필드 초기화
        form.value = {
            name: '',
    phone: '',
    email: '',
    hireDate: '',
    leaveDate: '',
    employeeId: '',
    auth: '',
    department: ''
        };
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록/수정</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registEmployee()" :disabled="form.employeeId?.trim() !== ''" />
            <Button label=" 수정 " rounded :disabled="form.employeeId?.trim() === ''" @click="modifyEmployee()" />
            <Button label=" 초기화 " severity="info" rounded @click="resetRegist()" />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">이름</label>
                    <InputText v-model="form.name" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">연락처</label>
                    <InputText :value="form.phone" @input="onPhoneInput" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">입사일자</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="form.hireDate" dateFormat="yy-mm-dd" class="w-full"></DatePicker>
                </div>
                <div>
                    <label class="block mb-1">권한</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="auth1" name="auth" value="일반사원" v-model="form.auth" />
                        <label for="auth1" class="ml-2 mr-4">일반사원</label>

                        <RadioButton id="auth2" name="auth" value="관리자" v-model="form.auth" />
                        <label for="auth2" class="ml-2 mr-4">관리자</label>

                        <RadioButton id="auth3" name="auth" value="최고관리자" v-model="form.auth" />
                        <label for="auth3" class="ml-2">최고관리자</label>
                    </label>
                </div>
                <div>
                    <label class="block mb-1">상태</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="재직" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">재직</label>

                        <RadioButton id="status2" name="status" value="휴직" v-model="form.status" />
                        <label for="status2" class="ml-2 mr-4">휴직</label>

                        <RadioButton id="status3" name="status" value="퇴직" v-model="form.status" />
                        <label for="status3" class="ml-2">퇴직</label>
                    </label>
                </div>
            </div>

            <!-- 오른쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">사원번호</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.employeeId" :readonly="true" :placeholder="!form.employeeId?.trim() ? '자동생성' : ''" class="w-full" :style="{ backgroundColor: 'lightgrey' }" />
                    </div>
                </div>
                <div>
                    <label class="block mb-1">E-Mail</label>
                    <div class="flex gap-2">
                        <!-- 아이디 입력 -->
                        <InputText v-model="form.email" placeholder="이메일 아이디" class="w-2/3" />

                        <span class="self-center">@</span>

                        <!-- 도메인 선택 -->
                        <select v-model="form.emailDomain" class="w-1/3 border rounded px-2">
                            <option value="" disabled>선택</option>
                            <option v-for="domain in emailDomains" :key="domain" :value="domain">{{ domain }}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block mb-1">퇴사일자</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="form.leaveDate" dateFormat="yy-mm-dd" class="w-full"></DatePicker>
                </div>
                <div>
                    <label class="block mb-1">부서</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="dep1" name="department" value="기준정보관리부" v-model="form.department" />
                        <label for="dep1" class="ml-2 mr-4">기준정보관리</label>
                        <RadioButton id="dep2" name="department" value="영업부" v-model="form.department" />
                        <label for="dep2" class="ml-2 mr-4">영업부</label>
                        <RadioButton id="dep3" name="department" value="재고관리부" v-model="form.department" />
                        <label for="dep3" class="ml-2 mr-4">재고관리부</label>
                        <RadioButton id="dep4" name="department" value="생산부" v-model="form.department" />
                        <label for="dep4" class="ml-2 mr-4">생산부</label>
                        <RadioButton id="dep5" name="department" value="품질관리부" v-model="form.department" />
                        <label for="dep5" class="ml-2 mr-4">품질관리부</label>
                        <RadioButton id="dep6" name="department" value="설비부" v-model="form.department" />
                        <label for="dep6" class="ml-2">설비부</label>
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
