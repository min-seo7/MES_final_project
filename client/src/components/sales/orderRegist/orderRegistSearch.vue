<script setup>
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import IconField from "primevue/iconfield";
import Dialog from "primevue/dialog";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
// import Paginator from 'primevue/paginator';
import { useUserStore } from "@/store/index";

// 거래처 모달창 관련
const showModal = ref(false);
// const modalType = ref('');
const selectedSupplierFromDialog = ref(null); // 모달에서 선택된 거래처

// 거래처 검색 폼
const supplierSearch = ref({
  partnerId: "",
  partnerName: "",
});

// DB 거래처 데이터
const items = ref([]);

//주문제품관련 모달창
const products = ref([]);
const showProductModal = ref(false);
const selectedOrderItemSeq = ref(null);
const selectedProductFromDialog = ref(null);

// 제품 검색 폼
const productSearch = ref({
  prodCode: "",
  prodName: "",
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
    items.value = response.data.list.map((item) => ({
      partnerId: item.partner_id,
      partnerName: item.partner_name,
      ceo: item.ceo,
      address: item.address,
      manager: item.manager,
      mainTel: item.main_tel,
    }));
  } catch (error) {
    console.error("거래처 데이터 로드 실패:", error);
  }
};

// 제품 데이터 로드 및 필터링
const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/sales/ordModalPrdList", {
      params: {
        prodCode: productSearch.value.prodCode,
        prodName: productSearch.value.prodName,
      },
    });
    products.value = response.data.list.map((item) => ({
      productId: item.product_id,
      productType: item.product_type,
      productName: item.product_name,
      specification: item.specification,
      unit: item.unit,
      price: item.price,
    }));
  } catch (error) {
    console.error("제품 데이터 로드 실패:", error);
  }
};

const openProductModal = (itemSeq) => {
  selectedOrderItemSeq.value = itemSeq;
  showProductModal.value = true;
  fetchProducts();
};

// const selectProduct = (product) => {
//     const orderToUpdate = orders.value.find((o) => o.itemSeq === selectedOrderItemSeq.value);
//     if (orderToUpdate) {
//         orderToUpdate.productName = product.productName;
//         orderToUpdate.specification = product.specification;
//         orderToUpdate.productPrice = product.price;
//         orderToUpdate.productId = product.productId;
//     }
//     showProductModal.value = false;
// };

// 주문 폼
const form = ref({
  orderId: "",
  partnerId: "",
  partnerName: "",
  orderDate: "",
  orderManager: "",
  deliveryAddr: "",
  supplyPrice: "",
  manager: "",
  totalQty: 0,
});

// 주문내역 리스트
const orders = ref([
  {
    itemSeq: 1,
    quantity: 0,
    delDate: "",
    ordStatus: 1,
    specification: "",
    productName: "",
    productId: "",
    productPrice: 0,
    supplyPrice: 0,
  },
]);
const selectedOrder = ref(null);

const selectOrder = (order) => {
  selectedOrder.value = order;
};

const addOrder = () => {
  const nextIndex =
    orders.value.length > 0
      ? Math.max(...orders.value.map((o) => o.itemSeq)) + 1
      : 1;
  orders.value.push({
    itemSeq: nextIndex,
    productName: "",
    quantity: 0,
    delDate: "",
    ordStatus: 1,
    specification: "",
    productId: "",
    productPrice: 0,
    supplyPrice: 0,
  });
};

const deleteOrder = () => {
  if (selectedOrder.value) {
    orders.value = orders.value.filter(
      (order) => order.itemSeq !== selectedOrder.value.itemSeq
    );
    selectedOrder.value = null;
    if (orders.value.length === 0) {
      resetOrders();
    }
  } else {
    alert("삭제할 주문내역을 먼저 선택해주세요.");
  }
};

const resetOrders = () => {
  orders.value = [
    {
      itemSeq: 1,
      productName: "",
      quantity: 0,
      delDate: "",
      specification: "",
      productId: "",
      productPrice: 0,
      supplyPrice: 0,
    },
  ];
  selectedOrder.value = null;

  form.value = {
    orderId: "",
    partnerId: "",
    partnerName: "",
    orderDate: "",
    orderManager: "",
    deliveryAddr: "",
    supplyPrice: "",
    totalQty: 0,
    manager: "",
  };
  supplierSearch.value = { partnerId: "", partnerName: "" };
  productSearch.value = { prodCode: "", prodName: "" };
};

// 공급가액 자동 계산
watch(
  orders,
  (newOrders) => {
    newOrders.forEach((order) => {
      order.supplyPrice = order.quantity * order.productPrice;
    });
  },
  { deep: true }
);

// 총합 계산
const totalQuantity = computed(() => {
  return orders.value.reduce((sum, order) => sum + order.quantity, 0);
});

const totalSupplyAmount = computed(() => {
  return orders.value.reduce((sum, order) => sum + order.supplyPrice, 0);
});

// 거래처 선택 모달 열기
const openModal = () => {
  showModal.value = true;
  selectedSupplierFromDialog.value = null;
  fetchSuppliers();
};

const selectSupplierAndClose = () => {
  if (selectedSupplierFromDialog.value) {
    form.value.partnerId = selectedSupplierFromDialog.value.partnerId;
    form.value.partnerName = selectedSupplierFromDialog.value.partnerName;
    form.value.manager = selectedSupplierFromDialog.value.manager;
  }
  showModal.value = false;
};

// 제품 모달에서 선택 완료 시
const selectProductAndClose = () => {
  if (selectedProductFromDialog.value) {
    const orderToUpdate = orders.value.find(
      (o) => o.itemSeq === selectedOrderItemSeq.value
    );
    if (orderToUpdate) {
      orderToUpdate.productName = selectedProductFromDialog.value.productName;
      orderToUpdate.specification =
        selectedProductFromDialog.value.specification;
      orderToUpdate.productPrice = selectedProductFromDialog.value.price;
      orderToUpdate.productId = selectedProductFromDialog.value.productId;
    }
  }
  showProductModal.value = false;
};

// 오늘 날짜 기본 설정
const today = new Date().toISOString().slice(0, 10);
form.value.orderDate = today;

// 주문 등록
const registEmployee = async () => {
  if (!form.value.partnerId) {
    alert("거래처를 선택해주세요.");
    return;
  }
  if (!form.value.deliveryAddr) {
    alert("배송지를 입력해주세요.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  form.value.orderDate = today;

  const ordersForServer = orders.value.map((o) => {
    if (!o.productId || o.quantity <= 0 || !o.delDate) {
      alert(
        "주문 내역의 모든 필수 항목(* 제품명, 수량, 납기일)을 입력해주세요."
      );
      throw new Error("Validation Failed");
    }
    return {
      ...o,
      delDate: o.delDate
        ? new Date(o.delDate).toISOString().slice(0, 10)
        : null,
    };
  });

  try {
    const payload = {
      ...form.value,
      orders: ordersForServer,
      supplyPrice: totalSupplyAmount.value,
      totalQty: totalQuantity.value,
    };

    const res = await axios.post("/api/sales/orderRegist", payload);
    alert(res.data.message || "주문등록 성공");
    resetOrders();
  } catch (err) {
    console.error("주문등록 실패:", err);
    alert(err.response?.data?.message || "주문등록 실패");
  }
};

const userInfo = useUserStore();
onMounted(() => {
  fetchSuppliers();
  fetchProducts();
  if (userInfo.user) {
    form.value.orderManager = userInfo.user.name;
  }
});
</script>

<template>
  <div>
    <div class="flex justify-end mb-4 space-x-2">
      <Button label="저장" @click="registEmployee()" rounded />
      <Button label="초기화" severity="info" rounded @click="resetOrders" />
    </div>

    <div class="font-semibold text-xl mb-4">주문등록</div>
    <Toolbar>
      <template #center>
        <div class="flex flex-wrap gap-5">
          <div class="flex flex-col">
            <label for="partnerId" class="font-semibold text-sm mb-1"
              >거래처코드</label
            >
            <IconField iconPosition="left">
              <InputText
                id="partnerId"
                type="text"
                class="w-48"
                v-model="form.partnerId"
                readonly
              />
              <InputIcon class="pi pi-search" @click="openModal()" />
            </IconField>
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">거래처명</label>
            <InputText
              type="text"
              class="w-48"
              v-model="form.partnerName"
              disabled
              style="background-color: lightgrey"
            />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">* 배송지</label>
            <InputText type="text" class="w-48" v-model="form.deliveryAddr" />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">총수량</label>
            <InputText
              :value="totalQuantity.toLocaleString()"
              disabled
              style="background-color: lightgrey"
            />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">총공급가액</label>
            <InputText
              type="text"
              :value="totalSupplyAmount.toLocaleString()"
              disabled
              style="background-color: lightgrey"
            />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">거래처 담당자</label>
            <InputText
              type="text"
              v-model="form.manager"
              disabled
              style="background-color: lightgrey"
            />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">주문 담당자</label>
            <InputText
              type="text"
              v-model="form.orderManager"
              placeholder="담당자 이름"
              readonly
            />
          </div>
        </div>
      </template>
    </Toolbar>

    <br />

    <div class="flex gap-3 mt-4 justify-end">
      <Button label="추가" @click="addOrder" rounded />
      <Button
        label="삭제"
        severity="danger"
        @click="deleteOrder"
        :disabled="!selectedOrder || orders.length === 1"
        rounded
      />
    </div>
    <div class="font-semibold text-xl mb-4"></div>
    <div
      class="p-4 border rounded-md shadow-md mt-6"
      style="background-color: white"
    >
      <div class="scrollable-orders">
        <div
          v-for="order in orders"
          :key="order.itemSeq"
          class="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 items-start cursor-pointer p-2 rounded-md transition-colors"
          :class="{
            'bg-blue-100':
              selectedOrder && selectedOrder.itemSeq === order.itemSeq,
          }"
          @click="selectOrder(order)"
        >
          <div class="flex flex-col min-h-[80px]">
            <label class="font-semibold text-sm mb-1">주문내역번호</label>
            <div class="text-sm font-medium text-center">
              {{ order.itemSeq }}
            </div>
          </div>
          <div class="flex flex-col">
            <label for="productName" class="font-semibold text-sm mb-1"
              >제품명</label
            >
            <IconField iconPosition="left" class="w-full">
              <InputText
                id="productName"
                type="text"
                class="w-60"
                v-model="order.productName"
                readonly
              />
              <InputIcon
                class="pi pi-search"
                @click.stop="openProductModal(order.itemSeq)"
              />
            </IconField>
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">* 수량</label>
            <InputNumber
              v-model="order.quantity"
              :min="1"
              showButtons
              class="w-full"
            />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">* 납기일</label>
            <Calendar
              v-model="order.delDate"
              dateFormat="yy-mm-dd"
              showIcon
              class="w-full"
            />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">규격</label>
            <InputText
              v-model="order.specification"
              class="w-full"
              disabled
              style="background-color: lightgrey"
            />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">제품단가</label>
            <InputText
              v-model="order.productPrice"
              :min="0"
              class="w-full"
              disabled
              style="background-color: lightgrey"
            />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold text-sm mb-1">공급가액</label>
            <InputText
              :value="order.supplyPrice.toLocaleString()"
              disabled
              class="w-full"
              placeholder="자동 계산"
              style="background-color: lightgrey"
            />
          </div>
        </div>
      </div>
    </div>
    <Dialog
      v-model:visible="showModal"
      modal
      header="거래처 검색"
      :style="{ width: '50vw' }"
      class="centered-dialog"
    >
      <div class="p-4">
        <DataTable
          :value="items"
          selectionMode="single"
          dataKey="partnerId"
          v-model:selection="selectedSupplierFromDialog"
          :rowHover="true"
          :paginator="true"
          :rows="5"
        >
          <Column selectionMode="single" headerStyle="width: 3rem"></Column>
          <Column
            field="partnerId"
            header="거래처코드"
            class="font-bold"
          ></Column>
          <Column field="partnerName" header="거래처명"></Column>
          <Column field="address" header="주소"></Column>
          <Column field="ceo" header="대표자"></Column>
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
      v-model:visible="showProductModal"
      modal
      header="제품 검색"
      :style="{ width: '50vw' }"
      class="centered-dialog"
    >
      <div class="p-4">
        <DataTable
          :value="products"
          selectionMode="single"
          dataKey="productId"
          v-model:selection="selectedProductFromDialog"
          :rowHover="true"
          :paginator="true"
          :rows="5"
        >
          <Column selectionMode="single" headerStyle="width: 3rem"></Column>
          <Column
            field="productId"
            header="제품코드"
            class="font-bold"
          ></Column>
          <Column field="productType" header="제품유형"></Column>
          <Column field="productName" header="제품명"></Column>
          <Column field="specification" header="규격"></Column>
          <Column field="unit" header="단위"></Column>
          <Column field="price" header="단가"></Column>
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

/* 주문등록 스크롤 영역 스타일 */
.scrollable-orders {
  max-height: 400px;
  overflow-y: auto;
}
</style>
