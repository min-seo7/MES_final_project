<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
    name: '',
    phone: '',
    email: '',
    hireDate: '',
    leaveDate: '',
    empId: '',
    auth: '',
    dept: ''
});

const registEmployee = async () => {
    try {
        const res = await axios.post('/api/information/employee', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('사원등록실패');
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록/수정</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registEmployee()" />
            <Button label=" 초기화 " severity="info" rounded />
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
                    <InputText v-model="form.phone" class="w-full" />
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
                        <InputText v-model="form.empId" class="w-full" />
                        <!--<Button label="생성" size="small" />-->
                    </div>
                </div>
                <div>
                    <label class="block mb-1">E-Mail</label>
                    <InputText v-model="form.email" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">퇴사일자</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="form.leaveDate" dateFormat="yy-mm-dd" class="w-full"></DatePicker>
                </div>
                <div>
                    <label class="block mb-1">부서</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="dep1" name="department" value="기준정보관리" v-model="form.dept" />
                        <label for="dep1" class="ml-2 mr-4">기준정보관리</label>
                        <RadioButton id="dep2" name="department" value="영업부" v-model="form.dept" />
                        <label for="dep2" class="ml-2 mr-4">영업부</label>
                        <RadioButton id="dep3" name="department" value="재고관리부" v-model="form.dept" />
                        <label for="dep3" class="ml-2 mr-4">재고관리부</label>
                        <RadioButton id="dep4" name="department" value="생산부" v-model="form.dept" />
                        <label for="dep4" class="ml-2 mr-4">생산부</label>
                        <RadioButton id="dep5" name="department" value="품질관리부" v-model="form.dept" />
                        <label for="dep5" class="ml-2 mr-4">품질관리부</label>
                        <RadioButton id="dep6" name="department" value="설비부" v-model="form.dept" />
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
