<script setup>
import { ref } from 'vue';

const name = ref('');
const phone = ref('');
const email = ref('');
const hireDate = ref('');
const retireDate = ref('');
const empId = ref('자동생성');

const authority = ref('');
const dept = ref('');
</script>

<template>
    <div class="flex justify-end gap-2 mt-6">
        <Button label="저장" />
        <Button label="초기화" severity="info" />
    </div>
    <div class="font-semibold text-lg mb-4">등록/수정</div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">이름</label>
                    <InputText v-model="name" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">연락처</label>
                    <InputText v-model="phone" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">입사일자</label>
                    <Calendar v-model="hireDate" class="w-full" dateFormat="yy-mm-dd" />
                </div>
                <div>
                    <label class="block mb-1">권한</label>
                    <div class="flex gap-4">
                        <div class="flex items-center">
                            <RadioButton id="auth1" name="auth" value="일반사원" v-model="authority" />
                            <label for="auth1" class="ml-2">일반사원</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="auth2" name="auth" value="관리자" v-model="authority" />
                            <label for="auth2" class="ml-2">관리자</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="auth3" name="auth" value="최고관리자" v-model="authority" />
                            <label for="auth3" class="ml-2">최고관리자</label>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block mb-1">상태</label>
                    <div class="flex gap-4">
                        <div class="flex items-center">
                            <RadioButton id="status1" name="status" value="재직" v-model="status" />
                            <label for="status1" class="ml-2">재직</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="status2" name="status" value="휴직" v-model="status" />
                            <label for="status2" class="ml-2">휴직</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="status3" name="status" value="퇴직" v-model="status" />
                            <label for="status3" class="ml-2">퇴직</label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 오른쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">사원번호</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="empId" class="w-full" disabled />
                        <Button label="생성" size="small" />
                    </div>
                </div>
                <div>
                    <label class="block mb-1">E-Mail</label>
                    <InputText v-model="email" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">퇴사일자</label>
                    <Calendar v-model="retireDate" class="w-full" dateFormat="yy-mm-dd" />
                </div>
                <div>
                    <label class="block mb-1">부서</label>
                    <div class="flex gap-4">
                        <div class="flex items-center">
                            <RadioButton id="dep1" name="department" value="기준정보관리" v-model="dept" />
                            <label for="dep1" class="ml-2">기준정보관리</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="dep2" name="department" value="영업부" v-model="dept" />
                            <label for="dep2" class="ml-2">영업부</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="dep3" name="department" value="재고관리부" v-model="dept" />
                            <label for="dep3" class="ml-2">재고관리부</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="dep4" name="department" value="생산부" v-model="dept" />
                            <label for="dep4" class="ml-2">생산부</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="dep5" name="department" value="품질관리부" v-model="dept" />
                            <label for="dep5" class="ml-2">품질관리부</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="dep6" name="department" value="설비부" v-model="dept" />
                            <label for="dep6" class="ml-2">설비부</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
