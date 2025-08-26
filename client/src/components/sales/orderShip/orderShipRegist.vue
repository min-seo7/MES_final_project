<script setup>
import { ref, watch, computed, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";
import Calendar from "primevue/calendar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Tag from "primevue/tag";
import axios from "axios";

// // 상태코드(int) → 출하상태명 매핑
// const shipStateMap = {
//     1: '출하대기',
//     2: '출하중',
//     3: '출하완료'
// };
// const shipStateMapReverse = computed(() => Object.fromEntries(Object.entries(shipStateMap).map(([k, v]) => [v, k])));
// const getShipSeverity = (status) => {
//     switch (status) {
//         case '출하대기':
//             return 'contrast';
//         case '출하중':
//             return 'warning';
//         case '출하완료':
//             return 'success';
//         default:
//             return null;
//     }
// };

// 상태코드(int) → 상태명 매핑
const orderStateMap = {
  1: "주문서등록",
  2: "생산대기",
  3: "생산중",
  4: "품질검수완료",
  5: "제품입고",
};
const getStatusText = (code) => orderStateMap[code] ?? "알수없음";

// 검색 폼
const searchForm = ref({
  partnerId: "",
  partnerName: "",
  productId: "",
  productName: "",
  startDate: null,
  endDate: null,
  searchForm: "",
});

// 조회된 주문서 목록 (상단 테이블)
const filteredShipmentOrders = ref([]);
// 선택된 주문서 (상단 테이블에서 선택)
const selectedOrder = ref(null);
// 조회된 주문 상세 내역 (하단 테이블)
const shipmentDetails = ref([]);
// 여러 개의 주문 상세 내역 선택 (하단 테이블)
const selectedOrderDetails = ref([]);
const tableKey = ref(0); // 테이블 강제 재렌더링을 위한 key

// --- 거래처 모달 ---
const showSupplierDialog = ref(false);
const allSuppliers = ref([]);
const selectedSupplierFromDialog = ref(null);
// --- 제품 모달 ---
const showProductDialog = ref(false);
const allProducts = ref([]);
const selectedProductFromDialog = ref(null);
// 날짜 포맷팅
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

// --- API 호출 함수 ---

const fetchSuppliers = async () => {
  try {
    const response = await axios.get("/api/sales/ordPaModalList");
    allSuppliers.value = response.data.list.map((item) => ({
      partnerId: item.partner_id,
      partnerName: item.partner_name,
      ceo: item.manager,
      address: item.address,
      manager: item.manager,
      mainTel: item.main_tel,
    }));
  } catch (error) {
    console.error("거래처 데이터 로드 실패:", error);
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
    searchForm.value.partnerId = selectedSupplierFromDialog.value.partnerId;
    searchForm.value.partnerName = selectedSupplierFromDialog.value.partnerName;
  }
  showSupplierDialog.value = false;
};

const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/sales/ordModalPrdList");
    allProducts.value = response.data.list.map((item) => ({
      productId: item.product_id,
      productType: item.product_type,
      productName: item.product_name,
      specification: item.specification,
      productPrice: item.product_price,
      unit: item.unit,
      price: item.price,
    }));
  } catch (error) {
    console.error("제품 데이터 로드 실패:", error);
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
    searchForm.value.productId = selectedProductFromDialog.value.productId;
    searchForm.value.productName = selectedProductFromDialog.value.productName;
  }
  showProductDialog.value = false;
};

const searchOrders = async () => {
  try {
    const queryParams = {
      partnerId: searchForm.value.partnerId || null,
      productId: searchForm.value.productId || null,
      startDate: formatDate(searchForm.value.startDate),
      endDate: formatDate(searchForm.value.endDate),
    };
    const response = await axios.get("/api/sales/shipReqOrders", {
      params: queryParams,
    });
    filteredShipmentOrders.value =
      response.data?.list?.map((item) => ({
        ...item,
        orderId: item.order_id,
        partnerId: item.partner_id,
        partnerName: item.partner_name,
        manager: item.manager,
        totalQty: item.total_qty,
        deliveryAddr: item.delivery_addr,
        orderDate: item.order_date,
        ordState: getStatusText(item.ord_status),
        orderManager: item.order_manager,
      })) || [];
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    filteredShipmentOrders.value = [];
  }
  resetShipmentForm();
};

const loadOrderDetails = async (event) => {
  const order = event.data;
  selectedOrder.value = order;
  resetShipmentForm();

  try {
    const response = await axios.get(
      `/api/sales/shipReqRegist/${order.orderId}`
    );
    shipmentDetails.value =
      response.data?.list?.map((item) => ({
        ...item,
        item_seq: item.item_seq,
        order_detail_id: item.order_detail_id,
        quantity: item.quantity,
        shippedQuantity: item.shipped_qty || 0,
        curr_qty: item.curr_qty || 0,
        shipmentId: item.shipment_id || null,
        // shipState: item.ship_state != null ? (shipStateMap[Number(item.ship_state)] ?? '알수없음') : '알수없음'
      })) || [];
    console.log(
      response.data.list.map((item) => ({
        shipmentId: item.shipment_id,
        ship_state: item.ship_state,
      }))
    );

    tableKey.value++;
  } catch (error) {
    console.error("주문 상세 내역 로드 실패:", error);
    shipmentDetails.value = [];
    tableKey.value++;
  }
};

const getSeverity = (status) => {
  switch (status) {
    case "주문서등록":
      return "contrast";
    case "생산대기":
      return "warn";
    case "생산중":
      return "danger";
    case "품질검수완료":
      return "success";
    case "제품입고":
      return "info";
    default:
      return null;
  }
};

const resetSearch = () => {
  searchForm.value = {
    partnerId: "",
    partnerName: "",
    productId: "",
    productName: "",
    startDate: null,
    endDate: null,
  };
  filteredShipmentOrders.value = [];
  resetShipmentForm();
};

const shipmentForm = ref({
  tradeName: "",
  shipmentDate: new Date(),
});
const isSaving = ref(false);

const computedTotalOrderQuantity = computed(() =>
  selectedOrderDetails.value.reduce((sum, item) => sum + item.quantity, 0)
);
const computedTotalRemainingQuantity = computed(() =>
  selectedOrderDetails.value.reduce(
    (sum, item) => sum + (item.curr_qty - item.quantity),
    0
  )
);
const computedShipmentQuantity = computed(() =>
  selectedOrderDetails.value.reduce((sum, item) => sum + item.quantity, 0)
);

watch(
  selectedOrderDetails,
  () => {
    shipmentForm.value.tradeName =
      selectedOrderDetails.value.length > 0
        ? selectedOrderDetails.value[0].partner_name
        : "";
    tableKey.value++;
  },
  { deep: true }
);

const saveShipment = async () => {
  if (selectedOrderDetails.value.length === 0) {
    alert("출하할 주문 상세 내역을 1건 이상 선택해주세요.");
    return;
  }

  if (computedShipmentQuantity.value <= 0) {
    alert("출하 수량은 0보다 커야 합니다.");
    return;
  }

  isSaving.value = true;
  try {
    const shipmentItems = selectedOrderDetails.value.map((detail) => ({
      shipmentId: detail.shipment_id,
      item_seq: detail.item_seq,
      product_code: detail.product_id,
      shipment_qty: detail.quantity,
      shipment_date: formatDate(shipmentForm.value.shipmentDate),
      ship_status: 1,
      order_manager: detail.manager,
      product_name: detail.product_name,
      order_detail_id: detail.order_detail_id,
    }));

    await axios.post("/api/sales/shipReqRegist", { shipmentItems });
    alert(`총 ${selectedOrderDetails.value.length}건의 출하가 등록되었습니다.`);

    resetShipmentForm();
    searchOrders();
  } catch (error) {
    console.error("출하 등록 실패:", error);
    alert("출하 등록에 실패했습니다. 이미 출하되었거나 문제가 발생했습니다.");
  } finally {
    isSaving.value = false;
  }
};

const resetShipmentForm = () => {
  shipmentDetails.value = [];
  selectedOrder.value = null;
  selectedOrderDetails.value = [];
  shipmentForm.value = {
    tradeName: "",
    shipmentDate: new Date(),
  };
  tableKey.value++;
};

const isRowSelectable = (event) => {
  // const isShipped = !!event.data.shipmentId;
  const isStockSufficient = event.data.curr_qty >= event.data.quantity;
  // return !isShipped && isStockSufficient;
  return isStockSufficient;
};

// 체크박스 변경을 수동으로 처리
const onCheckboxChange = (event, data) => {
  if (event.target.checked) {
    if (isRowSelectable({ data })) {
      selectedOrderDetails.value.push(data);
    } else {
      // 비활성화된 체크박스를 체크하려고 할 때
      event.target.checked = false;
    }
  } else {
    selectedOrderDetails.value = selectedOrderDetails.value.filter(
      (item) => item.item_seq !== data.item_seq
    );
  }
};

// 체크박스 상태를 확인
const isSelected = (data) => {
  return selectedOrderDetails.value.some(
    (item) => item.item_seq === data.item_seq
  );
};

onMounted(() => {
  searchOrders();
});
</script>

<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">출하요청등록</h1>
      <div class="flex space-x-2">
        <Button label="조회" rounded @click="searchOrders" />
        <Button label="초기화" severity="info" rounded @click="resetSearch" />
      </div>
    </div>

    <div
      class="p-4 border rounded-md shadow-md mb-8"
      style="background-color: white"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">거래처</label>
          <div class="flex gap-2">
            <InputGroup>
              <IconField iconPosition="right">
                <InputText
                  v-model="searchForm.partnerId"
                  placeholder="거래처코드"
                  readonly
                />
                <InputIcon
                  class="pi pi-search cursor-pointer"
                  @click="openSupplierModal"
                />
              </IconField>
            </InputGroup>
            <InputText
              v-model="searchForm.partnerName"
              placeholder="거래처명"
              disabled
              style="background-color: lightgrey"
            />
          </div>
        </div>
        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">제품</label>
          <div class="flex gap-2">
            <InputGroup>
              <IconField iconPosition="right">
                <InputText
                  v-model="searchForm.productId"
                  placeholder="제품코드"
                  readonly
                />
                <InputIcon
                  class="pi pi-search cursor-pointer"
                  @click="openProductModal"
                />
              </IconField>
            </InputGroup>
            <InputText
              v-model="searchForm.productName"
              placeholder="제품명"
              disabled
              style="background-color: lightgrey"
            />
          </div>
        </div>
        <div class="flex flex-col col-span-2">
          <label class="font-semibold text-sm mb-1">기간</label>
          <div class="flex gap-2">
            <Calendar
              v-model="searchForm.startDate"
              dateFormat="yy-mm-dd"
              placeholder="시작일"
              class="w-1/2"
              showIcon
            />
            <Calendar
              v-model="searchForm.endDate"
              dateFormat="yy-mm-dd"
              placeholder="종료일"
              class="w-1/2"
              showIcon
            />
          </div>
        </div>
      </div>
    </div>

    <DataTable
      :value="filteredShipmentOrders"
      scrollable
      scrollHeight="200px"
      selectionMode="single"
      v-model:selection="selectedOrder"
      @row-select="loadOrderDetails"
      class="mt-4"
    >
      <Column field="orderId" header="주문번호" style="min-width: 100px" />
      <Column field="partnerId" header="거래처번호" style="min-width: 100px" />
      <Column field="partnerName" header="거래처명" style="min-width: 100px" />
      <Column field="manager" header="거래처담당자" style="min-width: 100px" />
      <Column field="totalQty" header="총수량" style="min-width: 80px" />
      <Column field="deliveryAddr" header="배송지" style="min-width: 100px" />
      <Column field="orderDate" header="등록일자" style="min-width: 100px" />
      <Column field="ordState" header="주문상태" style="min-width: 100px">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.ordState"
            :severity="getSeverity(slotProps.data.ordState)"
            :rounded="true"
            class="px-3 py-1 text-sm"
          />
        </template>
      </Column>
      <Column
        field="orderManager"
        header="영업담당자"
        style="min-width: 120px"
      />
    </DataTable>

    <div
      class="font-semibold text-xl mb-4 mt-8 flex justify-between items-center"
    >
      <h1 class="text-2xl font-bold">등록</h1>
      <div class="space-x-2">
        <Button
          label="저장"
          rounded
          @click="saveShipment"
          :disabled="isSaving"
        />
        <Button
          label="초기화"
          severity="info"
          rounded
          @click="resetShipmentForm"
        />
      </div>
    </div>
    <div
      class="p-4 border rounded-md shadow-md mt-4"
      style="background-color: white"
    >
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">거래처명</label>
          <InputText
            v-model="shipmentForm.tradeName"
            disabled
            style="background-color: lightgrey"
          />
        </div>
        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">총 요청수량</label>
          <InputText
            :value="computedTotalOrderQuantity"
            disabled
            style="background-color: lightgrey"
          />
        </div>
        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">총 잔여수량</label>
          <InputText
            :value="computedTotalRemainingQuantity"
            disabled
            style="background-color: lightgrey"
          />
        </div>
        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">출하일정</label>
          <Calendar
            v-model="shipmentForm.shipmentDate"
            dateFormat="yy-mm-dd"
            showIcon
          />
        </div>
        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">출하수량</label>
          <InputText
            :value="computedShipmentQuantity"
            disabled
            style="background-color: lightgrey"
          />
        </div>
      </div>

      <DataTable
        :value="shipmentDetails"
        scrollable
        scrollHeight="200px"
        v-model:selection="selectedOrderDetails"
        :key="tableKey"
        class="mt-4"
      >
        <Column headerStyle="width: 3rem">
          <template #body="slotProps">
            <input
              type="checkbox"
              :checked="isSelected(slotProps.data)"
              :disabled="!isRowSelectable(slotProps)"
              @change="onCheckboxChange($event, slotProps.data)"
            />
          </template>
        </Column>

        <Column
          field="partner_id"
          header="거래처코드"
          style="min-width: 120px"
        />
        <Column
          field="partner_name"
          header="거래처명"
          style="min-width: 120px"
        />
        <Column field="product_id" header="제품코드" style="min-width: 120px" />
        <Column field="product_name" header="제품명" style="min-width: 120px" />
        <Column field="manager" header="거래담당자" style="min-width: 120px" />
        <Column field="quantity" header="수량" style="min-width: 80px" />
        <Column
          field="delivery_addr"
          header="배송지"
          style="min-width: 100px"
        />
        <Column field="order_date" header="등록일자" style="min-width: 100px" />
        <Column field="del_date" header="납기일자" style="min-width: 100px" />
        <!-- <Column field="shipState" header="출하상태" style="min-width: 100px">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.shipState" :severity="getShipSeverity(slotProps.data.shipState)" :rounded="true" class="px-3 py-1 text-sm" />
                    </template>
                </Column> -->
        <Column field="curr_qty" header="재고" style="min-width: 100px" />
      </DataTable>
    </div>

    <Dialog
      v-model:visible="showSupplierDialog"
      modal
      header="거래처 목록"
      :style="{ width: '50vw' }"
      class="centered-dialog"
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
        <Column selectionMode="single" headerStyle="width: 3rem"></Column>
        <Column field="partnerId" header="거래처코드"></Column>
        <Column field="partnerName" header="거래처명"></Column>
        <Column field="address" header="주소"></Column>
        <Column field="manager" header="담당자"></Column>
        <Column field="mainTel" header="전화번호"></Column>
      </DataTable>
      <template #footer>
        <div class="w-full flex justify-center">
          <Button label="선택 완료" @click="selectSupplierAndClose" />
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showProductDialog"
      modal
      header="제품 목록"
      :style="{ width: '50vw' }"
      class="centered-dialog"
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
        <Column selectionMode="single" headerStyle="width: 3rem"></Column>
        <Column field="productType" header="제품유형"></Column>
        <Column field="productId" header="제품코드"></Column>
        <Column field="productName" header="제품명"></Column>
        <Column field="specification" header="규격"></Column>
        <Column field="unit" header="단위"></Column>
      </DataTable>
      <template #footer>
        <div class="w-full flex justify-center">
          <Button label="선택 완료" @click="selectProductAndClose" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.centered-dialog {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  margin: 0 !important;
  z-index: 1000;
}
</style>
