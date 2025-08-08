<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: '대시보드', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: '부서',
        items: [
            {
                label: '기준정보관리',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: '사원정보',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/information/employee'
                    },
                    {
                        label: '거래처정보',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/information/partner'
                    },
                    {
                        label: '자재정보',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/information/material'
                    },
                    {
                        label: '제품정보',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/information/product'
                    },
                    {
                        label: 'BOM정보',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/information/bom'
                    },
                    {
                        label: '공정정보',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/information/process'
                    },
                    {
                        label: '공정흐름도정보',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/information/flowchart'
                    },
                    {
                        label: '라인정보',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/information/line'
                    },
                    {
                        label: '창고정보',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/information/warehouse'
                    }
                ]
            },
            {
                label: '영업부',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: '주문조회',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/sales/orderSearch'
                    },
                    {
                        label: '주문등록',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/sales/orderRegist'
                    },
                    {
                        label: '주문관리',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '주문수정', icon: 'pi pi-fw pi-bookmark', to: '/sales/orderModify' },
                            { label: '주문수정이력', icon: 'pi pi-fw pi-bookmark', to: '/sales/orderRecord' },
                            { label: 'PDF/이메일', icon: 'pi pi-fw pi-bookmark', to: '/sales/pdfEmail' }
                        ]
                    },
                    {
                        label: '출하요청',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '출하요청조회', icon: 'pi pi-fw pi-bookmark', to: '/sales/shipReqSearch' },
                            { label: '출하요청등록', icon: 'pi pi-fw pi-bookmark', to: '/sales/shipReqRegist' }
                        ]
                    },
                    {
                        label: '반품관리',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '반품조회', icon: 'pi pi-fw pi-bookmark', to: '/sales/returnSearch' },
                            { label: '반품등록', icon: 'pi pi-fw pi-bookmark', to: '/sales/returnRegist' }
                        ]
                    }
                ]
            },
            {
                label: '재고관리부',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: '제품관리',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '제품입고', icon: 'pi pi-fw pi-bookmark', to: '/stock/productIn' },
                            { label: '제품출고', icon: 'pi pi-fw pi-bookmark', to: '/stock/productOut' }
                        ]
                    },
                    {
                        label: '자재관리',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '자재입고', icon: 'pi pi-fw pi-bookmark', to: '/stock/materialIn' },
                            { label: '자재출고', icon: 'pi pi-fw pi-bookmark', to: '/stock/materialOut' }
                        ]
                    },
                    {
                        label: '발주관리',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '발주조회', icon: 'pi pi-fw pi-bookmark', to: '/stock/purchaseSearch' },
                            { label: '발주등록', icon: 'pi pi-fw pi-bookmark', to: '/stock/purchaseRegist' }
                        ]
                    },
                    {
                        label: '폐기물관리',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '폐기물조회', icon: 'pi pi-fw pi-bookmark', to: '/stock/wasteSearch' },
                            { label: '폐기물출고', icon: 'pi pi-fw pi-bookmark', to: '/stock/wasteOut' }
                        ]
                    },
                    {
                        label: '반품관리',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/stock/return'
                    },
                    {
                        label: '재고조회',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/stock/stockSearch'
                    }
                ]
            },
            {
                label: '생산부',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: '공정조회',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/production/processSearch'
                    },
                    {
                        label: '생산계획관리',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/production/productionPlan'
                    },
                    {
                        label: '생산지시관리',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/production/productionOrder'
                    },
                    {
                        label: '제품재고조회',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/production/prodStockSearch'
                    },
                    {
                        label: '실적등록',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/production/productionResultRegist'
                    }
                ]
            },
            {
                label: '품질관리부',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: '품질정보관리',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/test/testInform'
                    },
                    {
                        label: '자재입고검사',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '검사조회/등록', icon: 'pi pi-fw pi-bookmark', to: '/test/matTestRegist' },
                            { label: '검사결과', icon: 'pi pi-fw pi-bookmark', to: '/test/matTestResult' }
                        ]
                    },
                    {
                        label: '제품품질검사',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '검사조회/등록', icon: 'pi pi-fw pi-bookmark', to: '/test/prdTestRegist' },
                            { label: '검사결과', icon: 'pi pi-fw pi-bookmark', to: '/test/prdTestResult' }
                        ]
                    }
                ]
            },
            {
                label: '설비부',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: '설비정보',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '설비정보조회', icon: 'pi pi-fw pi-bookmark', to: '/equipment/equipInfoSearch' },
                            { label: '안전검사기준/작동매뉴얼', icon: 'pi pi-fw pi-bookmark', to: '/equipment/equipInfoMenual' },
                            { label: '설비정보등록/수정', icon: 'pi pi-fw pi-bookmark', to: '/equipment/equipInfoRegistModify' }
                        ]
                    },
                    {
                        label: '설비점검',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '설비점검조회', icon: 'pi pi-fw pi-bookmark', to: '/equipment/equipInspectSearch' },
                            { label: '설비점검등록/수정', icon: 'pi pi-fw pi-bookmark', to: '/equipment/equipInspectRegistModify' },
                            { label: '이력', icon: 'pi pi-fw pi-bookmark', to: '/equipment/equipInspectRecord' }
                        ]
                    },
                    {
                        label: '설비수리',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: '설비수리조회', icon: 'pi pi-fw pi-bookmark', to: '/equipment/equipRepairSearch' },
                            { label: '설비수리등록/수정', icon: 'pi pi-fw pi-bookmark', to: '/equipment/equipRepairRegistModify' },
                            { label: '이력', icon: 'pi pi-fw pi-bookmark', to: '/equipment/equipRepairRecord' }
                        ]
                    },
                    {
                        label: '설비비가동관리',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/equipment/equipStatus'
                    }
                ]
            }
        ]
    },
    {
        label: '마이페이지',
        items: [
            {
                label: '로그아웃',
                icon: 'pi pi-fw pi-book',
                to: '/documentation'
            },
            {
                label: '계정관리',
                icon: 'pi pi-fw pi-github',
                url: 'https://github.com/primefaces/sakai-vue',
                target: '_blank'
            }
        ]
    },
    {
        label: '확인',
        items: [
            {
                label: 'ButtonDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/button'
            },
            {
                label: 'ChartDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/charts'
            },
            {
                label: 'FileDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/file'
            },
            {
                label: 'FormLayout.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/formlayout'
            },
            {
                label: 'InputDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/input'
            },
            {
                label: 'ListDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/list'
            },
            {
                label: 'MediaDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/media'
            },
            {
                label: 'MenuDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/menu'
            },
            {
                label: 'MessagesDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/message'
            },
            {
                label: 'MiscDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/misc'
            },
            {
                label: 'OverlayDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/overlay'
            },
            {
                label: 'PanelsDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/panel'
            },
            {
                label: 'TableDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/table'
            },
            {
                label: 'TimelineDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/timeline'
            },
            {
                label: 'TreeDoc.vue',
                icon: 'pi pi-fw pi-github',
                to: '/uikit/tree'
            },
            {
                label: 'Access.vue',
                icon: 'pi pi-fw pi-github',
                to: '/auth/access'
            },
            {
                label: 'Error.vue',
                icon: 'pi pi-fw pi-github',
                to: '/auth/error'
            },
            {
                label: 'Login.vue',
                icon: 'pi pi-fw pi-github',
                to: '/auth/login'
            },
            {
                label: 'Crud.vue',
                icon: 'pi pi-fw pi-github',
                to: '/pages/crud'
            },
            {
                label: 'Documentation.vue',
                icon: 'pi pi-fw pi-github',
                to: '/documentation'
            },
            {
                label: 'Empty.vue',
                icon: 'pi pi-fw pi-github',
                to: '/pages/empty'
            },
            {
                label: 'Landing.vue',
                icon: 'pi pi-fw pi-github',
                to: '/landing'
            },
            {
                label: 'NotFound.vue',
                icon: 'pi pi-fw pi-github',
                to: '/pages/notfound'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
