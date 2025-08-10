<script>
import stockCommButton from '@/components/stock/stockCommBtn.vue';
import stockCommRowBtn from '@/components/stock/stockCommRowBtn.vue';
import CommModal from '@/components/stock/stockCommModal.vue';
import stockCommTable from '@/components/stock/stockCommTable.vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import 'primeicons/primeicons.css'

export default {
  components: { stockCommButton, CommModal, stockCommRowBtn, Tabs, TabList, Tab, TabPanels, TabPanel, stockCommTable },
  data(){
    return{

    }
  },
  methods: {},
  mounted() {
    console.log('자재출고');
  }
}
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">자재출고페이지</div>
        
        <stockCommButton  @search="onSearch()" @reset="onReset()" />

         <div class="card w-full">
            <!--검색1열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 등록일 -->
                <div class="flex items-center gap-2">
                    <label for="dueDate" class="whitespace-nowrap">입고예정일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="dueDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 발주번호 -->
                <div class="flex items-center gap-2">
                    <label for="orderNumber" class="whitespace-nowrap">발주번호</label>
                    <InputText id="orderNumber" type="text" class="w-60" v-model="orderNumber"/>
                </div>

                <!-- 자재코드 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">자재코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="materialCode" type="text" class="w-60" v-model="materialCode" @click="materialModal = true"/>
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 자재명 -->
                <div class="flex items-center gap-2">
                    <label for="materialName" class="whitespace-nowrap">자재명</label>
                    <InputText id="materialName" type="text" class="w-60" v-model="materialName"/>
                </div>
            </div>
            <!--end 검색1열-->

            <!--검색2열-->
            <div class="flex flex-wrap justify-center gap-6 my-6">
                <!-- 등록일 -->
                <div class="flex items-center gap-2">
                    <label for="MatInDate" class="whitespace-nowrap">입 고 일</label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="MatInDate" dateFormat="yy-mm-dd"></DatePicker>
                </div>

                <!-- 발주번호 -->
                <div class="flex items-center gap-2">
                    <label for="MatLotNo" class="whitespace-nowrap">LOT번호</label>
                    <InputText id="MatLotNo" type="text" class="w-60" v-model="MatLotNo"/>
                </div>

                <!-- 간격맞춤 -->
                <div class="flex items-center gap-2 invisible">
                    <label for="materialCode" class="whitespace-nowrap">====</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="materialCode" type="text" class="w-60" v-model="materialCode"/>
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
                <!-- 간격맞춤 -->
                <div class="flex items-center gap-2 invisible">
                    <label for="materialName" class="whitespace-nowrap">====</label>
                    <InputText id="materialName" type="text" class="w-60" v-model="materialName"/>
                </div>
            </div>
        </div>
        <!--검색박스end-->
        <!--중간버튼-->
        <stockCommRowBtn :buttons="[
            { label: '출고등록', icon: 'pi pi-check', onClick: editHandler },
            { label: '신규', icon: 'pi pi-plus', onClick: deleteHandler },
            { label: '수정', icon: 'pi pi-pencil', onClick: deleteHandler },
            { label: '입고취소', icon: 'pi pi-trash', onClick: deleteHandler },
        ]"/> 

          <!--텝 테이블-->
       <div class="card w-full">
         <Tabs value="0">
            <TabList>
                <Tab value="0">자재입고대기</Tab>
                <Tab value="1">자재입고확정</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                   <!--0번탭 컨텐츠영역-->
                   <stockCommTable v-model="MatReceiptPanding" :columns="pandingCol"/>
                </TabPanel>
                <TabPanel value="1">
                    <!--1번탭 컨텐츠영역-->
                    <stockCommTable v-model="MatReceipt" :columns="ReceiptCol"/>
                </TabPanel>
            </TabPanels>
        </Tabs>
      </div>
  </div>
   
</template>
