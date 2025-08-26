<script setup>
import { ref, computed, onMounted } from "vue";
import RadioButton from "primevue/radiobutton";
import Tag from "primevue/tag";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Calendar from "primevue/calendar";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import axios from "axios";

// 상태 변수
const ship = ref("");
const searchFilters = ref({
  partnerId: "",
  partnerName: "",
  productId: "",
  productName: "",
  startDate: null,
  endDate: null,
});
const customers2 = ref([]);

// 페이징
const rows = ref(10);

// 거래처 모달
const showSupplierDialog = ref(false);
const allSuppliers = ref([]);
const selectedSupplierFromDialog = ref(null);

// 제품 모달
const showProductDialog = ref(false);
const allProducts = ref([]);
const selectedProductFromDialog = ref(null);

// 출하 상태 매핑
const shipStateMap = { 1: "출하대기", 2: "출하중", 3: "출하완료" };
const shipStateMapReverse = computed(() =>
  Object.fromEntries(Object.entries(shipStateMap).map(([k, v]) => [v, k]))
);

const getSeverity = (status) => {
  switch (status) {
    case "출하대기":
      return "contrast";
    case "출하중":
      return "warning";
    case "출하완료":
      return "success";
    default:
      return null;
  }
};
const formatDate = (date) =>
  date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`
    : null;

// 출하 목록 조회
const fetchShipList = async () => {
  try {
    const params = {
      productId: searchFilters.value.productId || null,
      partnerId: searchFilters.value.partnerId || null,
      shipStatus: ship.value ? shipStateMapReverse.value[ship.value] : null,
      startDate: searchFilters.value.startDate
        ? formatDate(searchFilters.value.startDate)
        : null,
      endDate: searchFilters.value.endDate
        ? formatDate(searchFilters.value.endDate)
        : null,
    };
    const res = await axios.get("/api/sales/shipReqSearch", { params });
    customers2.value =
      res.data?.list?.map((item) => ({
        shipmentId: item.shipment_id,
        productId: item.product_id,
        productName: item.product_name,
        partnerId: item.partner_id,
        partnerName: item.partner_name,
        quantity: item.quantity,
        deliveryAddr: item.delivery_addr,
        delDate: item.del_date,
        shipmentDate: item.shipment_date,
        shipState: shipStateMap[item.ship_status] ?? item.ship_status,
        manager: item.manager,
        orderManager: item.order_manager,
      })) || [];
  } catch (err) {
    console.error("출하 내역 로드 실패", err);
    customers2.value = [];
  }
};

// 거래처 모달
const fetchSuppliers = async () => {
  try {
    const res = await axios.get("/api/sales/ordPaModalList");
    allSuppliers.value = res.data.list.map((item) => ({
      partnerId: item.partner_id,
      partnerName: item.partner_name,
      deliveryAddr: item.address,
      manager: item.manager,
    }));
  } catch (err) {
    console.error("거래처 데이터 로드 실패", err);
    allSuppliers.value = [];
  }
};
const openSupplierModal = async () => {
  selectedSupplierFromDialog.value = null;
  await fetchSuppliers();
  showSupplierDialog.value = true;
};
const selectSupplierAndClose = () => {
  if (selectedSupplierFromDialog.value) {
    searchFilters.value.partnerId = selectedSupplierFromDialog.value.partnerId;
    searchFilters.value.partnerName =
      selectedSupplierFromDialog.value.partnerName;
  }
  showSupplierDialog.value = false;
};

// 제품 모달
const fetchProducts = async () => {
  try {
    const res = await axios.get("/api/sales/ordModalPrdList");
    allProducts.value = res.data.list.map((item) => ({
      productId: item.product_id,
      productName: item.product_name,
      spec: item.specification,
      stock: item.stock || 0,
    }));
  } catch (err) {
    console.error("제품 데이터 로드 실패", err);
    allProducts.value = [];
  }
};
const openProductModal = async () => {
  selectedProductFromDialog.value = null;
  await fetchProducts();
  showProductDialog.value = true;
};
const selectProductAndClose = () => {
  if (selectedProductFromDialog.value) {
    searchFilters.value.productId = selectedProductFromDialog.value.productId;
    searchFilters.value.productName =
      selectedProductFromDialog.value.productName;
  }
  showProductDialog.value = false;
};

// 조회 / 초기화
const searchOrders = () => fetchShipList();
const resetFilters = () => {
  searchFilters.value = {
    partnerId: "",
    partnerName: "",
    productId: "",
    productName: "",
    startDate: null,
    endDate: null,
  };
  ship.value = "";
  fetchShipList();
};

// 초기 로딩
onMounted(fetchShipList);
</script>

<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">출하요청조회</h1>
      <div class="flex space-x-2">
        <Button label="조회" rounded @click="searchOrders" />
        <Button label="초기화" severity="info" rounded @click="resetFilters" />
      </div>
    </div>

    <div class="p-4 border rounded-md shadow-md mb-8 bg-white">
      <div class="flex flex-row flex-wrap gap-4 items-end">
        <!-- 제품 -->
        <div class="flex-1">
          <label class="font-semibold text-sm mb-1">제품</label>
          <InputGroup>
            <IconField iconPosition="right">
              <InputText
                v-model="searchFilters.productId"
                placeholder="제품코드"
                readonly
              />
              <InputIcon
                class="pi pi-search cursor-pointer"
                @click="openProductModal"
              />
            </IconField>
          </InputGroup>
          <!-- <span class="ml-2 text-gray-700">{{ searchFilters.productName }}</span> -->
        </div>

        <!-- 거래처 -->
        <div class="flex-1">
          <label class="font-semibold text-sm mb-1">거래처</label>
          <InputGroup>
            <IconField iconPosition="right">
              <InputText
                v-model="searchFilters.partnerId"
                placeholder="거래처코드"
                readonly
              />
              <InputIcon
                class="pi pi-search cursor-pointer"
                @click="openSupplierModal"
              />
            </IconField>
          </InputGroup>
          <!-- <span class="ml-2 text-gray-700">{{ searchFilters.partnerName }}</span> -->
        </div>

        <!-- 납기일 -->
        <div class="flex-none">
          <label class="font-semibold text-sm mb-1">조회 납기일</label>
          <div class="flex gap-2">
            <Calendar
              v-model="searchFilters.startDate"
              dateFormat="yy-mm-dd"
              placeholder="시작일"
              showIcon
            />
            <span>~</span>
            <Calendar
              v-model="searchFilters.endDate"
              dateFormat="yy-mm-dd"
              placeholder="종료일"
              showIcon
            />
          </div>
        </div>

        <!-- 출하상태 -->
        <div class="flex-none">
          <label class="font-semibold text-sm mb-1">출하상태</label>
          <div class="flex gap-3">
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="ship"
                inputId="ship1"
                name="ship"
                value="출하대기"
              />
              <label for="ship1">출하대기</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="ship"
                inputId="ship2"
                name="ship"
                value="출하중"
              />
              <label for="ship2">출하중</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="ship"
                inputId="ship3"
                name="ship"
                value="출하완료"
              />
              <label for="ship3">출하완료</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 출하 목록 -->
    <DataTable :value="customers2" :paginator="true" :rows="rows" class="mt-3">
      <Column field="shipmentId" header="출하번호" />
      <Column field="productId" header="제품코드" />
      <Column field="productName" header="제품명" />
      <Column field="partnerId" header="거래처코드" />
      <Column field="partnerName" header="거래처명" />
      <Column field="quantity" header="수량" />
      <Column field="deliveryAddr" header="배송지" />
      <Column field="delDate" header="납기일자" />
      <Column field="shipmentDate" header="출하일자" />
      <Column field="shipState" header="출하상태">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.shipState"
            :severity="getSeverity(slotProps.data.shipState)"
            rounded
          />
        </template>
      </Column>
      <Column field="orderManager" header="담당자" />
    </DataTable>

    <!-- 거래처 모달 -->
    <Dialog
      v-model:visible="showSupplierDialog"
      modal
      header="거래처 검색"
      :style="{ width: '50vw' }"
    >
      <DataTable
        :value="allSuppliers"
        selectionMode="single"
        dataKey="partnerId"
        v-model:selection="selectedSupplierFromDialog"
        :rowHover="true"
        :paginator="true"
        :rows="5"
      >
        <Column selectionMode="single" />
        <Column field="partnerId" header="거래처코드" />
        <Column field="partnerName" header="거래처명" />
        <Column field="deliveryAddr" header="주소" />
        <Column field="manager" header="담당자" />
      </DataTable>
      <template #footer>
        <div class="flex justify-center w-full">
          <Button label="선택 완료" @click="selectSupplierAndClose" />
        </div>
      </template>
    </Dialog>

    <!-- 제품 모달 -->
    <Dialog
      v-model:visible="showProductDialog"
      modal
      header="제품 목록"
      :style="{ width: '50vw' }"
    >
      <DataTable
        :value="allProducts"
        selectionMode="single"
        dataKey="productId"
        v-model:selection="selectedProductFromDialog"
        :rowHover="true"
        :paginator="true"
        :rows="5"
      >
        <Column selectionMode="single" />
        <Column field="productId" header="제품코드" />
        <Column field="productName" header="제품명" />
        <Column field="spec" header="규격" />
        <Column field="stock" header="재고" />
      </DataTable>
      <template #footer>
        <div class="flex justify-center w-full">
          <Button label="선택 완료" @click="selectProductAndClose" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.bg-gray-200 {
  background-color: #e5e7eb;
}
</style>
