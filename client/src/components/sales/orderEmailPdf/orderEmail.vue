<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import RadioButton from 'primevue/radiobutton';
import Panel from 'primevue/panel'; // Dialog 대신 Panel 사용
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';

// --- 주문 조회 및 필터링 관련 ---
const orderStateMap = { 1: '주문서등록', 2: '생산대기', 3: '생산중', 4: '품질검수완료', 5: '제품입고' };
const search = ref({ partnerId: '', productName: '', spec: '', deliveryDate: null });
const orders = ref([]);
const selectedOrder = ref(null);

const productList = ['분말형', '과립형', '액상형'];
const productSpecs = { 분말형: ['20KG', '40KG'], 과립형: ['20KG', '40KG'], 액상형: ['5L', '10L', '20L'] };
const specOptions = computed(() => productSpecs[search.value.productName] || []);

const fetchOrders = async () => {
    try {
        const delDateValue = search.value.deliveryDate;
        let formattedDelDate = delDateValue ? `${delDateValue.getFullYear()}-${String(delDateValue.getMonth() + 1).padStart(2, '0')}-${String(delDateValue.getDate()).padStart(2, '0')}` : null;

        const queryParams = {
            partnerId: search.value.partnerId || null,
            productName: search.value.productName || null,
            spec: search.value.spec || null,
            delDate: formattedDelDate
        };
        const response = await axios.get('/api/sales/orderSearch', { params: queryParams });
        if (response.data?.list && Array.isArray(response.data.list)) {
            orders.value = response.data.list.map((item) => ({
                ...item,
                orderId: item.order_id,
                partnerId: item.partner_id,
                partnerName: item.partner_name,
                partnerEmail: item.partner_email,
                productId: item.product_id,
                productName: item.product_name,
                spec: item.spec,
                quantity: item.quantity,
                deliveryAddr: item.delivery_addr,
                orderDate: item.order_date,
                delDate: item.del_date,
                orderManager: item.order_manager,
                orderManagerEmail: item.order_manager_email,
                ordState: orderStateMap[item.ord_status] || '알수없음'
            }));
        } else {
            orders.value = [];
        }
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};

const resetFilters = () => {
    search.value = { partnerId: '', productName: '', spec: '', deliveryDate: null };
    selectedOrder.value = null;
    isPdfGenerated.value = false;
    pdfForm.value = { fileName: '', partnerName: '', deliveryAddr: '', quantity: '', productName: '', delDate: '' };
    emailForm.value = { partnerEmail: '', managerEmail: '', subject: '', body: '' };
    fetchOrders();
};

const onRowSelect = (event) => {
    selectedOrder.value = event.data;
    isPdfGenerated.value = false;

    // PDF 폼 자동 채우기
    const data = event.data;
    pdfForm.value.fileName = `${data.orderDate.replace(/-/g, '')}_${data.partnerName}_${data.orderId}_주문서.pdf`;
    pdfForm.value.partnerName = data.partnerName;
    pdfForm.value.deliveryAddr = data.deliveryAddr;
    pdfForm.value.quantity = data.quantity;
    pdfForm.value.productName = data.productName;
    pdfForm.value.delDate = data.delDate;

    // 이메일 폼 초기화 (PDF 생성 후 채워짐)
    emailForm.value = {
        partnerEmail: data.partnerEmail,
        managerEmail: data.orderManagerEmail,
        subject: `[주문서] ${data.partnerName}_${data.orderDate}_주문서`,
        body: `거래처: ${data.partnerName}\n배송지: ${data.deliveryAddr}\n수량: ${data.quantity}\n제품명: ${data.productName}\n납기일: ${data.delDate}\n\n[파일 첨부: ${pdfForm.value.fileName}]`
    };
};

// --- PDF 생성 및 이메일 전송 제어 관련 ---
const isPdfGenerated = ref(false);

const pdfForm = ref({ fileName: '', partnerName: '', deliveryAddr: '', quantity: '', productName: '', delDate: '' });
const emailForm = ref({ partnerEmail: '', managerEmail: '', subject: '', body: '' });

const savePdf = async () => {
    if (!selectedOrder.value) {
        alert('주문 내역이 선택되지 않았습니다.');
        return;
    }
    try {
        const response = await axios.post('/api/pdf/generate', selectedOrder.value, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', pdfForm.value.fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();

        alert('PDF 파일이 성공적으로 다운로드되었습니다.');
        isPdfGenerated.value = true;
    } catch (error) {
        console.error('PDF 생성 실패:', error);
        alert('PDF 파일 생성에 실패했습니다.');
    }
};

const sendEmail = async () => {
    if (!selectedOrder.value) {
        alert('주문 내역이 선택되지 않았습니다.');
        return;
    }
    if (!isPdfGenerated.value) {
        alert('먼저 PDF를 생성해야 이메일을 보낼 수 있습니다.');
        return;
    }
    try {
        const payload = {
            to: emailForm.value.partnerEmail,
            from: emailForm.value.managerEmail,
            subject: emailForm.value.subject,
            text: emailForm.value.body
        };
        await axios.post('/api/email/send', payload);
        alert('이메일이 성공적으로 전송되었습니다.');
        isPdfGenerated.value = false;
        selectedOrder.value = null;
    } catch (error) {
        console.error('이메일 전송 실패:', error);
        alert('이메일 전송에 실패했습니다.');
    }
};

onMounted(() => {
    fetchOrders();
});
</script>

<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">주문서 관리</h1>
            <div class="flex space-x-2">
                <Button label="조회" rounded @click="fetchOrders" />
                <Button label="초기화" severity="info" rounded @click="resetFilters" />
            </div>
        </div>
        <div class="mb-6 p-4 border rounded-md bg-gray-100">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
                <div class="flex flex-col space-y-1">
                    <label class="font-semibold text-sm">거래처코드</label>
                    <InputGroup>
                        <InputText v-model="search.partnerId" placeholder="SUP002" />
                        <Button icon="pi pi-search" class="p-button-secondary" @click="fetchOrders" />
                    </InputGroup>
                </div>
                <div class="flex flex-col space-y-1">
                    <label class="font-semibold text-sm">품명</label>
                    <div class="flex space-x-4">
                        <div v-for="product in productList" :key="product" class="flex items-center">
                            <RadioButton v-model="search.productName" :inputId="product" :value="product" name="productName" class="mr-2" />
                            <label :for="product">{{ product }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col space-y-1">
                    <label class="font-semibold text-sm">규격</label>
                    <div class="flex space-x-4">
                        <div v-for="spec in specOptions" :key="spec" class="flex items-center">
                            <RadioButton v-model="search.spec" :inputId="spec" :value="spec" name="spec" class="mr-2" />
                            <label :for="spec">{{ spec }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col space-y-1">
                    <label class="font-semibold text-sm">납기</label>
                    <Calendar v-model="search.deliveryDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" :manualInput="false" />
                </div>
            </div>
        </div>

        <div class="font-semibold text-xl mb-4 mt-7 flex justify-between items-center">
            <span>주문내역</span>
        </div>
        <DataTable :value="orders" selectionMode="single" dataKey="orderId" v-model:selection="selectedOrder" @rowSelect="onRowSelect" :rowHover="true">
            <Column field="orderId" header="주문번호" frozen class="font-bold" />
            <Column field="productId" header="제품코드" />
            <Column field="partnerEmail" header="거래처이메일" />
            <Column field="productName" header="제품명" />
            <Column field="partnerName" header="거래처명" />
            <Column field="spec" header="규격" />
            <Column field="quantity" header="수량" />
            <Column field="deliveryAddr" header="배송지" />
            <Column field="orderDate" header="등록일자" />
            <Column field="delDate" header="납기일자" />
            <Column field="orderManagerEmail" header="담당자이메일" />
        </DataTable>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Panel header="이메일">
                <div class="flex flex-col space-y-4">
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">거래처이메일</label>
                        <InputText v-model="emailForm.partnerEmail" readonly class="flex-grow" />
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">담당자이메일</label>
                        <InputText v-model="emailForm.managerEmail" readonly class="flex-grow" />
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">제목</label>
                        <InputText v-model="emailForm.subject" placeholder="제목을 입력하세요" class="flex-grow" />
                    </div>
                    <div class="flex items-start space-x-2">
                        <label class="font-semibold text-sm w-32 pt-2">본문</label>
                        <Textarea v-model="emailForm.body" rows="5" placeholder="내용을 입력하세요" class="flex-grow" />
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">주문서 파일</label>
                        <div class="flex items-center flex-grow space-x-2">
                            <span class="text-sm">파일</span>
                            <InputText v-model="pdfForm.fileName" readonly class="flex-grow" />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-end space-x-2">
                        <Button label="저장" rounded @click="sendEmail" class="p-button-success" :disabled="!isPdfGenerated" />
                        <Button label="취소" rounded severity="secondary" @click="resetFilters" />
                    </div>
                </template>
            </Panel>

            <Panel header="PDF">
                <div class="flex flex-col space-y-4">
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">파일이름</label>
                        <InputText v-model="pdfForm.fileName" readonly class="flex-grow" />
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">거래처명</label>
                        <InputText v-model="pdfForm.partnerName" readonly class="flex-grow" />
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">배송지</label>
                        <InputText v-model="pdfForm.deliveryAddr" readonly class="flex-grow" />
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">수량</label>
                        <InputText v-model="pdfForm.quantity" readonly class="flex-grow" />
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">제품명</label>
                        <InputText v-model="pdfForm.productName" readonly class="flex-grow" />
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">납기일</label>
                        <InputText v-model="pdfForm.delDate" readonly class="flex-grow" />
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-end space-x-2">
                        <Button label="저장" rounded @click="savePdf" class="p-button-success" :disabled="!selectedOrder" />
                        <Button label="취소" rounded severity="secondary" @click="resetFilters" />
                    </div>
                </template>
            </Panel>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
    background-color: #e3f2fd !important;
    color: #1565c0 !important;
    font-weight: bold;
}
:deep(.p-datatable .p-datatable-tbody > tr:hover) {
    background-color: #e8eaf6 !important;
    cursor: pointer;
}
</style>
