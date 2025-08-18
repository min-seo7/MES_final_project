<script setup>
import { ref, defineEmits } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['employeeFilterSearch']);

const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const search = ref({
    employeeId: '',
    department: '',
    auth: '',
    status: ''
});

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;
    selectedItem.value = null;

    if (type === 'employeeId') {
        resetSearch();
        const res = await axios.get('/api/information/employee/getEmployeeId');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            employeeId: item.employee_id,
            name: item.name,
            department: item.department,
            status: item.status,
            auth: item.auth
        }));
        columns.value = [
            { field: 'employeeId', header: '사원번호' },
            { field: 'name', header: '사원명' },
            { field: 'department', header: '부서명' },
            { field: 'auth', header: '권한' },
            { field: 'status', header: '상태' }
        ];
    } else if (type === 'department') {
        resetSearch();
        const departments = ['기준정보관리부', '영업부', '재고부', '생산부', '품질관리부', '설비부'];
        items.value = departments.map((dept) => ({ deptName: dept }));
        columns.value = [{ field: 'deptName', header: '부서명' }];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    search.value.employeeId = selectedItem.value.employeeId;
    search.value.department = selectedItem.value.department || selectedItem.value.deptName;
    search.value.auth = selectedItem.value.auth;
    search.value.status = selectedItem.value.status;

    showModal.value = false;
};

// 선택필터초기화
const resetSearch = () => {
    search.value.employeeId = '';
    search.value.department = '';
    search.value.auth = '';
    search.value.status = '';
    selectedItem.value = null;
};

// 검색
const selectSearch = async () => {
    try {
        const payload = {
            employeeId: search.value.employeeId || null,
            department: search.value.department || null,
            auth: search.value.auth || null,
            status: search.value.status || null
        };

        const res = await axios.post('/api/information/employee/search', payload);
        console.log(res.data.result);
        emits('employeeFilterSearch', res.data.result);
    } catch (err) {
        console.log('사원검색실패');
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>검색조건</div>
        <div class="space-x-2">
            <Button label=" 조회 " rounded @click="selectSearch"></Button>
            <Button label=" 초기화 " severity="info" rounded @click="resetSearch"></Button>
        </div>
    </div>

    <Toolbar>
        <template #center>
            <div class="flex items-center gap-6">
                <!-- 사원번호 -->
                <div class="flex items-center gap-2">
                    <label for="employeeId" class="whitespace-nowrap">사원번호</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="employeeId" type="text" class="w-60" v-model="search.employeeId" />
                        <InputIcon class="pi pi-search" @click="openModal('employeeId')" />
                    </IconField>
                </div>

                <!-- 부서 -->
                <div class="flex items-center gap-2">
                    <label for="department" class="whitespace-nowrap">부서명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="department" type="text" class="w-60" v-model="search.department" />
                        <InputIcon class="pi pi-search" @click="openModal('department')" />
                    </IconField>
                </div>

                <!-- 권한 라디오 그룹 -->

                <div class="flex items-center gap-2">
                    <label for="auth" class="whitespace-nowrap">권한</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="auth1" name="auth" value="일반사원" v-model="search.auth" />
                            <label for="auth1" class="ml-2 mr-4">일반사원</label>
                            <RadioButton id="auth2" name="auth" value="관리자" v-model="search.auth" />
                            <label for="auth2" class="ml-2 mr-4">관리자</label>
                            <RadioButton id="auth3" name="auth" value="최고관리자" v-model="search.auth" />
                            <label for="auth3" class="ml-2 mr-4">최고관리자</label>
                        </label>
                    </div>
                </div>

                <!-- 상태 라디오 그룹 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">상태</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="status1" name="status" value="재직" v-model="search.status" />
                            <label for="status1" class="ml-2 mr-4">재직</label>
                            <RadioButton id="status2" name="status" value="휴직" v-model="search.status" />
                            <label for="status2" class="ml-2">휴직</label>
                            <RadioButton id="status3" name="status" value="퇴직" v-model="search.status" />
                            <label for="status3" class="ml-2">퇴직</label>
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </Toolbar>

    <CommonModal v-model:visible="showModal" :modalType="modalType" :items="items" :columns="columns" v-model:selectedItem="selectedItem" :showFilter="modalType === 'employeeId'" @confirm="selectModalValue" />
</template>
