<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import RadioButton from 'primevue/radiobutton';
import Panel from 'primevue/panel';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

// --- 상태 및 옵션 ---
const orderStateMap = { 1: '주문서등록', 2: '생산대기', 3: '생산중', 4: '품질검수완료', 5: '제품입고' };
const search = ref({ partnerId: '', productName: '', spec: '', deliveryDate: null });
const orders = ref([]);
const selectedOrders = ref([]); // 다중 선택으로 변경
const isLoading = ref(false);

const productList = ['분말형', '과립형', '액상형'];
const productSpecs = { 분말형: ['20KG', '40KG'], 과립형: ['20KG', '40KG'], 액상형: ['5L', '10L', '20L'] };
const specOptions = computed(() => productSpecs[search.value.productName] || []);

const toast = useToast();

// --- 주문 조회 ---
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
        const response = await axios.get('/api/sales/pdfEmail', { params: queryParams });
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
                totalQty: item.total_qty,
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
        toast.add({ severity: 'error', summary: '실패', detail: '데이터 로드 실패', life: 3000 });
    }
};

// --- Reset ---
const resetFilters = () => {
    search.value = { partnerId: '', productName: '', spec: '', deliveryDate: null };
    selectedOrders.value = [];
};

// --- Computed Forms (selectedOrders의 첫 번째 항목 사용) ---
const pdfForm = computed(() => {
    const selectedOrder = selectedOrders.value[0];
    if (!selectedOrder) {
        return { fileName: '', partnerName: '', deliveryAddr: '', totalQty: '', productName: '', delDate: '' };
    }
    const d = selectedOrder;
    return {
        fileName: `${(d.orderDate || '').replace(/-/g, '')}_${d.partnerName || ''}_${d.orderId || ''}_주문서.pdf`,
        partnerName: d.partnerName,
        deliveryAddr: d.deliveryAddr,
        totalQty: d.totalQty,
        productName: d.productName,
        delDate: d.delDate
    };
});

const emailForm = computed(() => {
    const selectedOrder = selectedOrders.value[0];
    if (!selectedOrder) {
        return { partnerEmail: '', managerEmail: '', subject: '', body: '' };
    }
    const d = selectedOrder;
    return {
        partnerEmail: d.partnerEmail,
        managerEmail: d.orderManagerEmail,
        subject: `[주문서] ${d.partnerName || ''}_${d.orderDate || ''}_주문서`,
        body: `거래처: ${d.partnerName}\n배송지: ${d.deliveryAddr}\n수량: ${d.totalQty}\n제품명: ${d.productName}\n납기일: ${d.delDate}\n\n[파일 첨부: ${pdfForm.value.fileName}]`
    };
});

// --- 단일 PDF 다운로드 ---
const savePdf = async () => {
    if (!selectedOrders.value || selectedOrders.value.length === 0) {
        toast.add({ severity: 'warn', summary: '알림', detail: '주문 내역이 선택되지 않았습니다.', life: 3000 });
        return;
    }
    const orderId = selectedOrders.value[0].orderId;
    isLoading.value = true;
    try {
        const response = await axios.get(`/api/sales/pdf/download/${orderId}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', pdfForm.value.fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.add({ severity: 'success', summary: '완료', detail: 'PDF 다운로드 성공', life: 3000 });
    } catch (error) {
        console.error('PDF 다운로드 실패:', error);
        toast.add({ severity: 'error', summary: '실패', detail: 'PDF 다운로드 실패', life: 3000 });
    } finally {
        isLoading.value = false;
    }
};

// --- 다중 PDF 다운로드 ---
const savePdfMultiple = async () => {
    if (!selectedOrders.value.length) {
        toast.add({ severity: 'warn', summary: '알림', detail: '주문 내역이 선택되지 않았습니다.', life: 3000 });
        return;
    }
    isLoading.value = true;
    try {
        const orderIds = selectedOrders.value.map((order) => order.orderId);
        const response = await axios.post('/api/sales/pdf/download-multiple', { orders: orderIds }, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Orders_${Date.now()}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.add({ severity: 'success', summary: '완료', detail: '다중 PDF 다운로드 성공', life: 3000 });
    } catch (error) {
        console.error('다중 PDF 다운로드 실패:', error);
        toast.add({ severity: 'error', summary: '실패', detail: '다중 PDF 다운로드 실패', life: 3000 });
    } finally {
        isLoading.value = false;
    }
};

// --- 단일 이메일 전송 ---
const sendEmail = async () => {
    if (!selectedOrders.value || selectedOrders.value.length === 0) {
        toast.add({ severity: 'warn', summary: '알림', detail: '주문 내역이 선택되지 않았습니다.', life: 3000 });
        return;
    }
    try {
        const selectedOrder = selectedOrders.value[0];
        const payload = {
            orderId: selectedOrder.orderId,
            emailDetails: {
                to: emailForm.value.partnerEmail,
                cc: emailForm.value.managerEmail,
                subject: emailForm.value.subject,
                body: emailForm.value.body
            }
        };
        await axios.post('/api/sales/email/send', payload);
        toast.add({ severity: 'success', summary: '완료', detail: '이메일 전송 성공', life: 3000 });
    } catch (error) {
        console.error('이메일 전송 실패:', error);
        toast.add({ severity: 'error', summary: '실패', detail: '이메일 전송 실패', life: 3000 });
    }
};

// --- 다중 이메일 전송 ---
const sendEmailMultiple = async () => {
    if (!selectedOrders.value.length) {
        toast.add({ severity: 'warn', summary: '알림', detail: '주문 내역이 선택되지 않았습니다.', life: 3000 });
        return;
    }
    try {
        const payload = { orders: selectedOrders.value, emailDetails: { subject: `[주문서] ${new Date().toISOString().slice(0, 10)}_통합주문서`, body: `첨부된 PDF 파일을 확인해주세요.` } };
        await axios.post('/api/sales/email/send-multiple', payload);
        toast.add({ severity: 'success', summary: '완료', detail: '다중 이메일 전송 성공', life: 3000 });
    } catch (error) {
        console.error('다중 이메일 전송 실패:', error);
        toast.add({ severity: 'error', summary: '실패', detail: '다중 이메일 전송 실패', life: 3000 });
    }
};

onMounted(() => fetchOrders());
</script>

<template>
    <div>
        <Toast />
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">주문서 관리</h1>
            <div class="flex space-x-2">
                <Button label="조회" rounded @click="fetchOrders" />
                <Button label="초기화" severity="info" rounded @click="resetFilters" />
            </div>
        </div>

        <Toolbar class="mb-4">
            <template #center>
                <div class="flex flex-wrap gap-6 p-4">
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">거래처코드</label>
                        <IconField iconPosition="left" class="w-full">
                            <InputText v-model="search.partnerId" readonly class="w-60" />
                            <InputIcon class="pi pi-search" @click.stop="fetchOrders" />
                        </IconField>
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
            </template>
        </Toolbar>

        <DataTable :value="orders" selectionMode="multiple" dataKey="orderId" v-model:selection="selectedOrders" :rowHover="true">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="orderId" header="주문번호" frozen class="font-bold" />
            <Column field="productId" header="제품코드" />
            <Column field="partnerEmail" header="거래처이메일" />
            <Column field="productName" header="제품명" />
            <Column field="partnerName" header="거래처명" />
            <Column field="spec" header="규격" />
            <Column field="totalQty" header="수량" />
            <Column field="deliveryAddr" header="배송지" />
            <Column field="orderDate" header="등록일자" />
            <Column field="delDate" header="납기일자" />
            <Column field="orderManagerEmail" header="담당자이메일" />
        </DataTable>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Panel header="이메일">
                <div v-if="selectedOrders.length" class="flex flex-col space-y-4">
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
                        <InputText v-model="emailForm.subject" class="flex-grow" />
                    </div>
                    <div class="flex items-start space-x-2">
                        <label class="font-semibold text-sm w-32 pt-2">본문</label>
                        <Textarea v-model="emailForm.body" rows="5" class="flex-grow" />
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="font-semibold text-sm w-32">주문서 파일</label>
                        <InputText v-model="pdfForm.fileName" readonly class="flex-grow" />
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-end space-x-2">
                        <Button label="전송" rounded @click="sendEmail" :disabled="selectedOrders.length === 0 || selectedOrders.length > 1" />
                        <!-- <Button label="다중 전송" rounded severity="success" @click="sendEmailMultiple" :disabled="!selectedOrders.length" /> -->
                        <Button label="초기화" rounded severity="secondary" @click="resetFilters" />
                    </div>
                </template>
            </Panel>

            <Panel header="PDF">
                <div v-if="selectedOrders.length" class="flex flex-col space-y-4">
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
                        <label class="font-semibold text-sm w-32">총수량</label>
                        <InputText v-model="pdfForm.totalQty" readonly class="flex-grow" />
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-end space-x-2">
                        <Button label="저장" rounded @click="savePdf" :disabled="selectedOrders.length === 0 || selectedOrders.length > 1 || isLoading" :loading="isLoading" />
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
