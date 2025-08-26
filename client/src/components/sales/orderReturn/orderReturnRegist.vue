<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Calendar from "primevue/calendar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Paginator from "primevue/paginator";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import RadioButton from "primevue/radiobutton";
import Toolbar from "primevue/toolbar";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

// 상태코드(int) → 상태명 매핑
const orderStateMap = {
  1: "주문서등록",
  2: "생산대기",
  3: "생산중",
  4: "품질검수완료",
  5: "제품입고",
};

// 상태명(string) → 상태코드 매핑 (필터링에 필요)
const orderStateMapReverse = computed(() => {
  return Object.fromEntries(
    Object.entries(orderStateMap).map(([key, value]) => [value, key])
  );
});

// 상태 텍스트 가져오기
const getStatusText = (code) => orderStateMap[code] ?? "알수없음";

// 검색 폼 상태
const search = ref({
  orderId: "",
  orderStatus: "",
  partCode: "",
  prodCode: "",
  manager: "",
  productName: "",
  addr: "",
  partName: "",
  spec: "",
  deliveryDate: null,
});

// 검색내역에서 선택된 행
const selectedOrder = ref(null);

// 거래처 모달 관련
const showSupplierDialog = ref(false);
const allSuppliers = ref([]); // 원본 데이터
const filteredSuppliers = ref([]); // 필터링된 데이터
const selectedSupplierFromDialog = ref(null); // 모달에서 선택된 거래처

// 거래처 모달 검색 폼
const supplierSearch = ref({
  partnerId: "",
  partnerName: "",
});

// 거래처 데이터 로드 및 필터링
const fetchSuppliers = async () => {
  try {
    const response = await axios.get("/api/sales/ordPaModalList", {
      params: {
        partnerId: supplierSearch.value.partnerId,
        partnerName: supplierSearch.value.partnerName,
      },
    });
    allSuppliers.value = response.data.list.map((item) => ({
      partnerId: item.partner_id,
      partnerName: item.partner_name,
      ceo: item.manager,
      address: item.address,
      manager: item.manager,
      mainTel: item.main_tel,
    }));
    filteredSuppliers.value = allSuppliers.value;
  } catch (error) {
    console.error("거래처 데이터 로드 실패:", error);
    allSuppliers.value = [];
    filteredSuppliers.value = [];
  }
};

// 거래처 모달 열기
const openSupplierModal = async () => {
  supplierSearch.value = { partnerId: "", partnerName: "" };
  selectedSupplierFromDialog.value = null;
  await fetchSuppliers();
  showSupplierDialog.value = true;
};

// // 거래처 검색 필터링 로직
// const searchSuppliers = async () => {
//     await fetchSuppliers();
// };

// "선택 완료" 버튼 클릭 시
const selectSupplierAndClose = () => {
  if (selectedSupplierFromDialog.value) {
    search.value.partCode = selectedSupplierFromDialog.value.partnerId;
    search.value.partName = selectedSupplierFromDialog.value.partnerName;
    search.value.manager = selectedSupplierFromDialog.value.manager;
    search.value.addr = selectedSupplierFromDialog.value.address;
  }
  showSupplierDialog.value = false;
};

// 제품 모달 관련
const showProductDialog = ref(false);
const allProducts = ref([]);
const filteredProducts = ref([]);
const selectedProductFromDialog = ref(null);

// 제품 모달 검색 폼
const productSearch = ref({
  prodCode: "",
  prodName: "",
  productType: "전체",
});

const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/sales/ordModalPrdList", {
      params: {
        prodCode: productSearch.value.prodCode,
        prodName: productSearch.value.prodName,
      },
    });
    allProducts.value = response.data.list.map((item) => ({
      productId: item.product_id,
      productType: item.product_type,
      productName: item.product_name,
      specification: item.specification,
      productPrice: item.product_price,
      unit: item.unit,
      price: item.price,
    }));
    filteredProducts.value = allProducts.value;
  } catch (error) {
    console.error("제품 데이터 로드 실패:", error);
    allProducts.value = [];
    filteredProducts.value = [];
  }
};

// 제품 모달 열기
const openProductModal = async () => {
  await fetchProducts();
  selectedProductFromDialog.value = null;
  showProductDialog.value = true;
};

// 제품 검색 필터링 로직
const searchProducts = async () => {
  await fetchProducts();
};

// 제품유형 라디오 버튼 변경 감시
watch(
  () => productSearch.value.productType,
  () => {
    searchProducts();
  }
);

// "선택 완료" 버튼 클릭 시
const selectProductAndClose = () => {
  if (selectedProductFromDialog.value) {
    search.value.prodCode = selectedProductFromDialog.value.productId;
    search.value.productName = selectedProductFromDialog.value.productName;
    search.value.spec = selectedProductFromDialog.value.specification;
  }
  showProductDialog.value = false;
};

// 동적 품목 및 규격 데이터
// const productList = ['분말형', '과립형', '액상형'];
// const productSpecs = {
//     분말형: ['20KG', '40KG'],
//     과립형: ['20KG', '40KG'],
//     액상형: ['5L', '10L', '20L']
// };

// // 품명에 따라 동적으로 변하는 규격 옵션
// const specOptions = computed(() => {
//     return productSpecs[search.value.productName] || [];
// });

// 주문 데이터
const orders = ref([]);

// --- 추가된 Paginator 상태 ---
const first = ref(0);
const rows = ref(5);
const totalRecords = computed(() => orders.value.length);
// --- 추가된 Paginator 상태 끝 ---

// 페이징된 데이터 계산
const paginatedOrders = computed(() => {
  return orders.value.slice(first.value, first.value + rows.value);
});

// 페이징 이벤트 핸들러
const onPage = (event) => {
  first.value = event.first;
  rows.value = event.rows;
};

// 주문 데이터 조회
const fetchOrders = async () => {
  try {
    const delDateValue = search.value.deliveryDate;
    let formattedDelDate = null;
    if (delDateValue) {
      const year = delDateValue.getFullYear();
      const month = String(delDateValue.getMonth() + 1).padStart(2, "0");
      const day = String(delDateValue.getDate()).padStart(2, "0");
      formattedDelDate = `${year}-${month}-${day}`;
    }

    const queryParams = {
      orderId: search.value.orderId || null,
      orderStatus: search.value.orderStatus
        ? orderStateMapReverse.value[search.value.orderStatus]
        : null,
      productId: search.value.prodCode || null,
      partnerId: search.value.partCode || null,
      delDate: formattedDelDate,
      spec: search.value.spec || null,
    };

    const response = await axios.get("/api/sales/returnRegist", {
      params: queryParams,
    });

    if (response.data?.list && Array.isArray(response.data.list)) {
      orders.value = response.data.list.map((item) => ({
        shipmentId: item.shipment_id,
        partnerId: item.partner_id,
        partnerName: item.partner_name,
        productId: item.product_id,
        prdId: item.prd_id,
        productName: item.product_name,
        manager: item.manager,
        quantity: item.quantity,
        deliveryAddr: item.delivery_addr,
        orderDate: item.order_date,
        delDate: item.del_date,
        ordState: getStatusText(item.ord_status),
        orderManager: item.order_manager,
        spec: item.spec,
        orderDetailId: item.order_detail_id,
        prdOutNo: item.prd_out_no,
      }));
      // 검색 후 첫 페이지로 이동
      first.value = 0;
    } else {
      orders.value = [];
      console.warn(
        "서버 응답에 유효한 리스트 데이터가 없습니다.",
        response.data
      );
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
};

// 주문 상태에 따른 Tag 색상
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

// 반품 등록 폼 상태로 변경
const returnRegistForm = ref({
  returnDate: null,
  returnReason: "",
  manager: "",
});

// 조회 실행 (now calls fetchOrders)
const searchOrders = () => {
  fetchOrders();
};

// 초기화
const resetFilters = () => {
  search.value = {
    orderId: "",
    orderStatus: "",
    partCode: "",
    prodCode: "",
    manager: "",
    productName: "",
    addr: "",
    partName: "",
    spec: "",
    deliveryDate: null,
  };
  fetchOrders();
};

const saveReturn = async () => {
  // 1. 필수 입력값 확인
  if (!selectedOrder.value) {
    alert("반품할 주문내역을 먼저 선택해주세요.");
    return;
  }
  if (!returnRegistForm.value.returnReason) {
    alert("반품 사유를 입력해주세요.");
    return;
  }

  try {
    // 2. 반품 데이터 객체 생성
    const returnData = {
      orderDetailId: selectedOrder.value.orderDetailId,
      productId: selectedOrder.value.productId,
      quantity: selectedOrder.value.quantity,
      returnDate: returnRegistForm.value.returnDate?.toISOString().slice(0, 10),
      returnReason: returnRegistForm.value.returnReason,
      reStatus: 1, // 반품 상태 (예: 1=등록)
      manager: returnRegistForm.value.manager,
      prdId: selectedOrder.value.prdId,
      orderManager: selectedOrder.value.orderManager,
      shipmentId: selectedOrder.value.shipment_id,
    };

    // 3. 백엔드로 POST 요청 (성공 시 try, 실패 시 catch 블록으로 이동)
    const response = await axios.post("/api/sales/returnRegist", {
      returnItems: [returnData],
    });

    // 4. 요청 성공 시 (HTTP 200번대 응답)
    // 백엔드에서 보낸 '반품 등록 성공' 메시지를 alert로 표시
    alert(response.data.message);

    // 5. 테이블 목록 새로고침 및 폼 초기화
    fetchOrders();
    selectedOrder.value = null;
    returnRegistForm.value = {
      returnDate: null,
      returnReason: "",
      manager: "",
    };
  } catch (error) {
    // 6. 요청 실패 시 (HTTP 400, 500번대 응답)
    console.error("반품 등록 실패:", error);

    // 7. 서버에서 보낸 구체적인 오류 메시지 사용
    // (예: "이미 반품 등록된 내역이 있습니다.")
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "반품 등록에 실패했습니다. 서버 오류를 확인해주세요.";
    alert(errorMessage);
  }
};

// 행 선택 시 반품 등록 폼에 정보 채움
const onOrderSelect = (event) => {
  const order = event.data;
  selectedOrder.value = { ...order };
  returnRegistForm.value.manager = order.orderManager;
};

// 모달이 열리고 닫힐 때 body 스크롤을 제어하는 watch
watch(showSupplierDialog, (isShowing) => {
  document.body.style.overflow = isShowing ? "hidden" : "";
});

watch(showProductDialog, (isShowing) => {
  document.body.style.overflow = isShowing ? "hidden" : "";
});

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div class="font-semibold text-xl mb-4 mt-6">반품등록</div>
      <div class="flex space-x-2">
        <Button label="조회" rounded @click="searchOrders" />
        <Button label="초기화" severity="info" rounded @click="resetFilters" />
      </div>
    </div>
    <Toolbar class="mb-4">
      <template #center>
        <div class="flex flex-wrap gap-6 p-4">
          <div class="flex flex-col">
            <label for="partCode" class="font-semibold text-sm mb-1"
              >거래처코드</label
            >
            <InputGroup>
              <IconField iconPosition="left">
                <InputText
                  id="partCode"
                  type="text"
                  class="w-60"
                  placeholder="거래처코드"
                  v-model="search.partCode"
                  readonly
                />
                <InputIcon class="pi pi-search" @click="openSupplierModal" />
              </IconField>
            </InputGroup>
          </div>
          <div class="flex flex-col">
            <label for="prodCode" class="font-semibold text-sm mb-1"
              >제품코드</label
            >
            <InputGroup>
              <IconField iconPosition="left">
                <InputText
                  id="prodCode"
                  type="text"
                  class="w-60"
                  placeholder="제품코드"
                  v-model="search.prodCode"
                  readonly
                />
                <InputIcon class="pi pi-search" @click="openProductModal" />
              </IconField>
            </InputGroup>
          </div>
          <div class="flex flex-col space-y-1">
            <label class="font-semibold text-sm">납기일</label>
            <Calendar
              v-model="search.deliveryDate"
              dateFormat="yy-mm-dd"
              showIcon
              class="w-full"
            />
          </div>
          <div class="flex flex-col space-y-1">
            <label class="font-semibold text-sm">주문상태</label>
            <div class="flex flex-wrap gap-3">
              <div
                class="flex items-center gap-2"
                v-for="state in Object.values(orderStateMap)"
                :key="state"
              >
                <RadioButton
                  v-model="search.orderStatus"
                  :inputId="`orderState-${state}`"
                  name="orderStatus"
                  :value="state"
                />
                <label :for="`orderState-${state}`">{{ state }}</label>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Toolbar>
    <div class="flex space-x-6">
      <div class="w-2/3">
        <br />
        <div class="font-semibold text-xl mb-3 mt-8">반품내역</div>
        <DataTable
          :value="paginatedOrders"
          selectionMode="single"
          dataKey="orderDetailId"
          v-model:selection="selectedOrder"
          @rowSelect="onOrderSelect"
          :rowHover="true"
          class="mb-4"
        >
          <Column
            field="shipmentId"
            header="출하번호"
            style="min-width: 100px"
          />
          <Column
            field="prdOutNo"
            header="출하완료번호"
            style="min-width: 100px"
          />
          <Column
            field="partnerId"
            header="거래처코드"
            style="min-width: 100px"
          />
          <Column
            field="partnerName"
            header="거래처명"
            style="min-width: 100px"
          />
          <Column
            field="productId"
            header="제품코드"
            style="min-width: 100px"
          />
          <Column
            field="productName"
            header="제품명"
            style="min-width: 100px"
          />
          <Column
            field="manager"
            header="거래담당자"
            style="min-width: 100px"
          />
          <Column field="quantity" header="수량" style="min-width: 80px" />
          <Column
            field="deliveryAddr"
            header="배송지"
            style="min-width: 100px"
          />
          <Column
            field="orderDate"
            header="등록일자"
            style="min-width: 100px"
          />
          <Column field="delDate" header="납기일자" style="min-width: 100px" />
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
            header="담당자"
            style="min-width: 100px"
          />
        </DataTable>
        <Paginator
          v-model:first="first"
          :rows="rows"
          :totalRecords="totalRecords"
          @page="onPage"
          :rowsPerPageOptions="[5, 10, 20, 30]"
        ></Paginator>
      </div>
      <div class="w-1/3">
        <div class="flex justify-end space-x-2 mb-4">
          <Button label="저장" rounded @click="saveReturn" />
          <Button
            label="초기화"
            severity="info"
            rounded
            @click="
              () => {
                returnRegistForm.value = {
                  returnDate: null,
                  returnReason: '',
                  manager: '',
                };
                selectedOrder = null;
              }
            "
          />
        </div>
        <div class="font-semibold text-xl mb-4 mt-6">반품등록</div>
        <div
          class="bg-gray-100 p-4 rounded-lg border border-gray-300"
          style="background-color: white"
        >
          <div class="grid grid-cols-1 gap-5">
            <div class="flex flex-col space-y-1">
              <label class="font-semibold text-sm">반품일</label>
              <Calendar
                v-model="returnRegistForm.returnDate"
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>
            <div class="flex flex-col space-y-1">
              <label class="font-semibold text-sm">반품사유</label>
              <InputText
                v-model="returnRegistForm.returnReason"
                placeholder="재고 문제, 고객 변심 등"
              />
            </div>
            <div class="flex flex-col space-y-1">
              <label class="font-semibold text-sm">담당자</label>
              <InputText v-model="returnRegistForm.manager" readonly />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Dialog
      v-model:visible="showSupplierDialog"
      modal
      header="거래처 검색"
      :style="{ width: '50vw' }"
      class="centered-dialog"
    >
      <div class="p-4">
        <DataTable
          :value="filteredSuppliers"
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
          <Column field="ceo" header="대표자"></Column>
          <Column field="address" header="주소"></Column>
          <Column field="manager" header="담당자"></Column>
          <Column field="mainTel" header="전화번호"></Column>
        </DataTable>
      </div>
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
      <div class="p-4">
        <DataTable
          :value="filteredProducts"
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
      </div>
      <template #footer>
        <div class="w-full flex justify-center">
          <Button label="선택 완료" @click="selectProductAndClose" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* PrimeVue 모달창 가운데 정렬 스타일 */
:deep(.centered-dialog .p-dialog) {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  margin: 0 !important;
  z-index: 1000;
}

/* 모달이 열릴 때 배경 스크롤 방지 */
:deep(.p-dialog-mask) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 어두운 배경 */
  z-index: 999; /* 모달보다 낮은 z-index */
  overflow: hidden; /* 스크롤 방지 */
}

/* PrimeVue DataTable 선택된 행 포커스 스타일 */
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
