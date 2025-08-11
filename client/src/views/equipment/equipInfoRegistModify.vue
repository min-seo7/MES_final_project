<script setup>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Dialog from 'primevue/dialog';

const form = ref({
    equipmentCode: '',
    equipmentName: '',
    manufacturer: '',
    serialNo: '',
    purchaseDate: null,
    startDate: null,
    equipmentType: '',
    location: '',
    status: '사용',
    note: '',
    lawFile: null,
    manualFile: null,
    equipmentLocation: ''
});

const search = ref({
    equipmentCode: '',
    equipmentType: '',
    equipmentName: '',
    location: '',
    status: ''
});

const showModal = ref(false);
const modalType = ref('');

const openModal = (type) => {
    modalType.value = type;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const selectModalValue = (value) => {
    if (modalType.value === 'equipmentCode') search.value.equipmentCode = value;
    else if (modalType.value === 'equipmentType') search.value.equipmentType = value;
    else if (modalType.value === 'equipmentName') search.value.equipmentName = value;
    else if (modalType.value === 'location') search.value.location = value;
    showModal.value = false;
};

const equipmentCodeList = [
    'EQP-0001', 'EQP-0002', 'EQP-0003', 'EQP-0004', 'EQP-0005',
    'EQP-0006', 'EQP-0007', 'EQP-0008', 'EQP-0009', 'EQP-0010',
    'EQP-0011', 'EQP-0012', 'EQP-0013', 'EQP-0014', 'EQP-0015',
    'EQP-0016', 'EQP-0017', 'EQP-0018', 'EQP-0019', 'EQP-0020'
];

const currentPage = ref(1);
const pageSize = 5;

const totalPages = computed(() => Math.ceil(equipmentCodeList.length / pageSize));
const pagedEquipmentCodes = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return equipmentCodeList.slice(start, start + pageSize);
});

const onFileLaw = (event) => {
    form.value.lawFile = event.files;
};
const onFileManual = (event) => {
    form.value.manualFile = event.files;
};

const onSave = () => {
    console.log('저장할 데이터:', form.value);
};
const onReset = () => {
    Object.assign(form.value, {
        equipmentCode: '',
        equipmentName: '',
        manufacturer: '',
        serialNo: '',
        purchaseDate: null,
        startDate: null,
        equipmentType: '',
        location: '',
        status: '사용',
        note: '',
        lawFile: null,
        manualFile: null
    });
};

const onSearch = () => {
    console.log('조회조건:', search.value);
};
const onSearchReset = () => {
    Object.assign(search.value, {
        equipmentCode: '',
        equipmentType: '',
        equipmentName: '',
        location: '',
        status: ''
    });
};
</script>

<template>
  <div class="card p-6">
    <div class="text-2xl font-semibold mb-6">설비정보 등록 / 수정</div>

    <!-- 조회 타이틀 -->
    <div class="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-t-md text-base font-semibold mb-0.5">
      조회
    </div>

    <!-- 조회 입력 폼 -->
    <div class="border rounded-lg p-4 bg-gray-50">
      <div class="flex items-center gap-4 w-full">
        <div class="flex gap-1 flex-1 min-w-0">
          <InputText v-model="search.equipmentCode" placeholder="설비코드" readonly @click="openModal('equipmentCode')" class="w-full" />
          <Button icon="pi pi-search" size="small" @click="openModal('equipmentCode')" />
        </div>
        <div class="flex gap-1 flex-1 min-w-0">
          <InputText v-model="search.equipmentType" placeholder="설비유형" readonly @click="openModal('equipmentType')" class="w-full" />
          <Button icon="pi pi-search" size="small" @click="openModal('equipmentType')" />
        </div>
        <div class="flex gap-1 flex-1 min-w-0">
          <InputText v-model="search.equipmentName" placeholder="설비명" readonly @click="openModal('equipmentName')" class="w-full" />
          <Button icon="pi pi-search" size="small" @click="openModal('equipmentName')" />
        </div>
        <div class="flex gap-1 flex-1 min-w-0">
          <InputText v-model="search.location" placeholder="설비위치" readonly @click="openModal('location')" class="w-full" />
          <Button icon="pi pi-search" size="small" @click="openModal('location')" />
        </div>
        <div class="flex items-center gap-3 whitespace-nowrap pl-4">
          <span class="font-medium text-sm">설비상태</span>
          <RadioButton inputId="use" name="searchStatus" value="사용" v-model="search.status" />
          <label for="use">사용</label>
          <RadioButton inputId="notUse" name="searchStatus" value="미사용" v-model="search.status" />
          <label for="notUse">미사용</label>
        </div>
      </div>
    </div>

    <!-- 등록 타이틀 및 박스 -->
    <div class="border rounded-md bg-white mt-6">
      <div class="bg-gray-200 text-sm font-semibold px-3 py-2 border-b w-fit">
        등록
      </div>

      <div class="p-4">
        <div class="grid grid-cols-12 gap-3 mb-4">
          <div class="col-span-3">
            <label class="block text-sm mb-1">설비코드 *</label>
            <div class="flex gap-2">
              <InputText v-model="form.equipmentCode" class="flex-1" readonly @click="openModal('equipmentCode')" />
              <Button label="검색" class="px-3 py-1" @click="openModal('equipmentCode')" />
            </div>
          </div>
          <div class="col-span-3">
            <label class="block text-sm mb-1">설비명 *</label>
            <InputText v-model="form.equipmentName" />
          </div>
          <div class="col-span-3">
            <label class="block text-sm mb-1">제조사 *</label>
            <InputText v-model="form.manufacturer" />
          </div>
          <div class="col-span-3">
            <label class="block text-sm mb-1">제조번호</label>
            <InputText v-model="form.serialNo" placeholder="serial No." />
          </div>
          <div class="col-span-3">
            <label class="block text-sm mb-1">구매일 *</label>
            <Calendar v-model="form.purchaseDate" showIcon dateFormat="yy-mm-dd" />
          </div>
          <div class="col-span-3">
            <label class="block text-sm mb-1">사용시작일</label>
            <Calendar v-model="form.startDate" showIcon dateFormat="yy-mm-dd" />
          </div>
          <div class="col-span-3">
            <label class="block text-sm mb-1">설비유형 *</label>
            <InputText v-model="form.equipmentType" />
          </div>
          <div class="col-span-3">
            <label class="block text-sm mb-1">설비위치</label>
            <div class="flex gap-2">
              <InputText v-model="form.location" class="flex-1" />
              <Button icon="pi pi-search" class="p-button-secondary px-3" />
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm mb-1">비고</label>
          <Textarea v-model="form.note" rows="3" class="w-full" />
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-2">파일첨부</label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm mb-1">• 법적안전점검기준</div>
              <FileUpload mode="basic" name="lawFile" chooseLabel="파일 선택" @select="onFileLaw" />
            </div>
            <div>
              <div class="text-sm mb-1">• 작동매뉴얼</div>
              <FileUpload mode="basic" name="manualFile" chooseLabel="파일 선택" @select="onFileManual" />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button label="저장" icon="pi pi-save" @click="onSave" />
          <Button label="초기화" icon="pi pi-refresh" severity="secondary" @click="onReset" />
        </div>
      </div>
    </div>

    <!-- 모달 -->
    <Dialog v-model:visible="showModal" modal header="검색" :style="{ width: '40vw' }" @hide="closeModal">
      <div class="p-4">
        <p class="font-bold mb-3 text-lg">
          🔍
          {{ {
            equipmentCode: '설비코드',
            equipmentType: '설비유형',
            equipmentName: '설비명',
            location: '설비위치'
          }[modalType] }} 검색
        </p>

        <div v-if="modalType === 'equipmentCode'">
          <ul class="mb-3">
            <li v-for="code in pagedEquipmentCodes" :key="code" class="cursor-pointer hover:text-blue-600" @click="selectModalValue(code)">
              • {{ code }}
            </li>
          </ul>
          <div class="flex justify-center gap-2">
            <Button label="이전" @click="currentPage--" :disabled="currentPage === 1" size="small" />
            <span class="px-2">페이지 {{ currentPage }} / {{ totalPages }}</span>
            <Button label="다음" @click="currentPage++" :disabled="currentPage === totalPages" size="small" />
          </div>
        </div>

        <div v-else>
          <Button label="예시값1" @click="selectModalValue('예시값1')" />
          <Button label="예시값2" @click="selectModalValue('예시값2')" />
          <Button label="예시값3" @click="selectModalValue('예시값3')" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
