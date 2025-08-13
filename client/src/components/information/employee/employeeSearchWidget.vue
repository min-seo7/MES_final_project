<script setup>
import { ref, defineEmits } from 'vue';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from 'axios';

const emits = defineEmits(['search']);
const items = ref([]);
const modalSearchName = ref('');
const modalSearchDept = ref('');
const search = ref({
    employeeId: '',
    department: '',
    auth: '',
    status: ''
});

// 모달 상태 관리
const showModal = ref(false);
const modalType = ref('');

const openModal = (type) => {
    modalType.value = type;
    showModal.value = true;

    // 모달 초기화
    selectedEmployee.value = null;
    modalSearchName.value = '';
    modalSearchDept.value = '';

    getEmployeeForModal();
};

const closeModal = () => {
    showModal.value = false;
};

const resetModalFilter = () => {};

const selectedEmployee = ref(null);
const selectModalValue = () => {
    if (!selectedEmployee.value) {
        alert('사원을 선택하세요.');
        return;
    }

    // 검색창에 자동 채우기
    search.value.employeeId = selectedEmployee.value.employeeId;
    search.value.department = selectedEmployee.value.department;
    search.value.auth = selectedEmployee.value.auth;
    search.value.status = selectedEmployee.value.status;

    closeModal();
    selectSearch();
};

const resetSearch = () => {
    search.value.employeeId = '';
    search.value.department = '';
    search.value.auth = '';
    search.value.status = '';
    selectedEmployee.value = null;
};

const selectSearch = async () => {
    emits('search', search.value);
};

const getEmployeeForModal = async () => {
    try {
        const response = await axios.get('/api/information/employee/getEmployeeId');
        items.value = response.data.map((item, index) => ({
            num: index + 1,
            employeeId: item.employee_id,
            name: item.name,
            department: item.department,
            status: item.status,
            auth: item.auth
        }));
    } catch (error) {
        console.error('실패:', error);
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
                        <InputIcon class="pi pi-search" />
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

    <Dialog v-model:visible="showModal" modal header="사원번호찾기" :style="{ width: '40vw' }" @hide="closeModal">
        <p class="font-bold mb-4 text-lg">
            🔍
            {{
                {
                    employeeId: '사원번호',
                    employeeName: '사원명',
                    department: '부서명',
                    auth: '권한',
                    status: '상태'
                }[modalType]
            }}
        </p>
        <div v-if="modalType === 'employeeId'">
            <div class="mt-5 mb-4 space-x-2 flex justify-center">
                <label for="employeeName">사원명</label>
                <InputText id="employeeName" type="text" />
                <label for="department">부서</label>
                <InputText id="department" type="text" />
                <Button label="검색" />
                <Button label="초기화" @click="resetModalFilter()" />
            </div>
            <DataTable :value="items" tableStyle="min-width: 20rem" class="mb-3">
                <Column header="">
                    <template #body="slotProps"> <RadioButton :inputId="'employeeSelect' + slotProps.index" name="employeeSelect" :value="slotProps.data" v-model="selectedEmployee" /> </template>
                </Column>
                <Column field="employeeId" header="사원번호"> </Column>
                <Column field="name" header="사원명"></Column>
                <Column field="department" header="부서명"></Column>
                <Column field="auth" header="권한"></Column>
                <Column field="status" header="상태"></Column>
            </DataTable>
        </div>
        <div class="mt-5 flex justify-center">
            <Button label="선택 완료" @click="selectModalValue" />
        </div>
    </Dialog>
</template>
