import AppLayout from '@/layout/AppLayout.vue';
//import Login from '@/components/common/login.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth/login',
            component: AppLayout,
            children: [
                {
                    path: '/information/employee',
                    name: 'employee',
                    component: () => import('@/views/information/employee.vue')
                },
                {
                    path: '/information/material',
                    name: 'material',
                    component: () => import('@/views/information/material.vue')
                },
                {
                    path: '/information/partner',
                    name: 'partner',
                    component: () => import('@/views/information/partner.vue')
                },
                {
                    path: '/information/product',
                    name: 'product',
                    component: () => import('@/views/information/product.vue')
                },
                {
                    path: '/information/bom',
                    name: 'bom',
                    component: () => import('@/views/information/bom.vue')
                },
                {
                    path: '/information/process',
                    name: 'process',
                    component: () => import('@/views/information/process.vue')
                },
                {
                    path: '/information/flowchart',
                    name: 'flowchart',
                    component: () => import('@/views/information/flowchart.vue')
                },
                {
                    path: '/information/line',
                    name: 'line',
                    component: () => import('@/views/information/line.vue')
                },
                {
                    path: '/information/warehouse',
                    name: 'warehouse',
                    component: () => import('@/views/information/warehouse.vue')
                },
                {
                    path: '/sales/orderSearch',
                    name: 'orderSearch',
                    component: () => import('@/views/sales/orderSearch.vue')
                },
                {
                    path: '/sales/orderRegist',
                    name: 'orderRegist',
                    component: () => import('@/views/sales/orderRegist.vue')
                },
                {
                    path: '/sales/orderModify',
                    name: 'orderModify',
                    component: () => import('@/views/sales/orderModify.vue')
                },
                {
                    path: '/sales/orderRecord',
                    name: 'orderRecord',
                    component: () => import('@/views/sales/orderRecord.vue')
                },
                {
                    path: '/sales/pdfEmail',
                    name: 'pdfEmail',
                    component: () => import('@/views/sales/pdfEmail.vue')
                },
                {
                    path: '/sales/shipReqRegist',
                    name: 'shipReqRegist',
                    component: () => import('@/views/sales/shipReqRegist.vue')
                },
                {
                    path: '/sales/shipReqSearch',
                    name: 'shipReqSearch',
                    component: () => import('@/views/sales/shipReqSearch.vue')
                },
                {
                    path: '/sales/returnSearch',
                    name: 'returnSearch',
                    component: () => import('@/views/sales/returnSearch.vue')
                },
                {
                    path: '/sales/returnRegist',
                    name: 'returnRegist',
                    component: () => import('@/views/sales/returnRegist.vue')
                },
                {
                    path: '/stock/materialIn',
                    name: 'materialIn',
                    component: () => import('@/views/stock/materialIn.vue')
                },
                {
                    path: '/stock/materialOut',
                    name: 'materialOut',
                    component: () => import('@/views/stock/materialOut.vue')
                },
                {
                    path: '/stock/productIn',
                    name: 'productIn',
                    component: () => import('@/views/stock/productIn.vue')
                },
                {
                    path: '/stock/productOut',
                    name: 'productOut',
                    component: () => import('@/views/stock/productOut.vue')
                },
                {
                    path: '/stock/purchaseRegist',
                    name: 'purchaseRegist',
                    component: () => import('@/views/stock/purchaseRegist.vue')
                },
                {
                    path: '/stock/purchaseSearch',
                    name: 'purchaseSearch',
                    component: () => import('@/views/stock/purchaseSearch.vue')
                },
                {
                    path: '/stock/return',
                    name: 'return',
                    component: () => import('@/views/stock/return.vue')
                },
                {
                    path: '/stock/stockSearch',
                    name: 'stockSearch',
                    component: () => import('@/views/stock/stockSearch.vue')
                },
                {
                    path: '/stock/wasteOut',
                    name: 'wasteOut',
                    component: () => import('@/views/stock/wasteOut.vue')
                },
                {
                    path: '/stock/wasteSearch',
                    name: 'wasteSearch',
                    component: () => import('@/views/stock/wasteSearch.vue')
                },
                {
                    path: '/test/matTestRegist',
                    name: 'matTestRegist',
                    component: () => import('@/views/test/matTestRegist.vue')
                },
                {
                    path: '/test/matTestResult',
                    name: 'matTestResult',
                    component: () => import('@/views/test/matTestResult.vue')
                },
                {
                    path: '/test/prdTestRegist',
                    name: 'prdTestRegist',
                    component: () => import('@/views/test/prdTestRegist.vue')
                },
                {
                    path: '/test/prdTestResult',
                    name: 'prdTestResult',
                    component: () => import('@/views/test/prdTestResult.vue')
                },
                {
                    path: '/test/testInform',
                    name: 'testInform',
                    component: () => import('@/views/test/testInform.vue')
                },
                {
                    path: '/equipment/equipInfoMenual',
                    name: 'equipInfoMenual',
                    component: () => import('@/views//equipment/equipInfoMenual.vue')
                },
                {
                    path: '/equipment/equipInfoRegistModify',
                    name: 'equipInfoRegistModify',
                    component: () => import('@/views//equipment/equipInfoRegistModify.vue')
                },
                {
                    path: '/equipment/equipInfoSearch',
                    name: 'equipInfoSearch',
                    component: () => import('@/views//equipment/equipInfoSearch.vue')
                },
                {
                    path: '/equipment/equipInspectRecord',
                    name: 'equipInspectRecord',
                    component: () => import('@/views//equipment/equipInspectRecord.vue')
                },
                {
                    path: '/equipment/equipInspectRegistModify',
                    name: 'equipInspectRegistModify',
                    component: () => import('@/views//equipment/equipInspectRegistModify.vue')
                },
                {
                    path: '/equipment/equipInspectSearch',
                    name: 'equipInspectSearch',
                    component: () => import('@/views//equipment/equipInspectSearch.vue')
                },
                {
                    path: '/equipment/equipRepairRegistModify',
                    name: 'equipRepairRegistModify',
                    component: () => import('@/views//equipment/equipRepairRegistModify.vue')
                },
                {
                    path: '/equipment/equipRepairSearch',
                    name: 'equipRepairSearch',
                    component: () => import('@/views//equipment/equipRepairSearch.vue')
                },
                {
                    path: '/equipment/equipStatus',
                    name: 'equipStatus',
                    component: () => import('@/views//equipment/equipStatus.vue')
                },
                {
                    path: '/production/productOrderSearch',
                    name: 'productOrderSearch',
                    component: () => import('@/views//production/productOrderSearch.vue')
                },
                {
                    path: '/production/processSearch',
                    name: 'processSearch',
                    component: () => import('@/views//production/processSearch.vue')
                },
                {
                    path: '/production/prodStockSearch',
                    name: 'prodStockSearch',
                    component: () => import('@/views//production/prodStockSearch.vue')
                },
                {
                    path: '/production/productionOrder',
                    name: 'productionOrder',
                    component: () => import('@/views//production/productionOrder.vue')
                },
                {
                    path: '/production/productionPlan',
                    name: 'productionPlan',
                    component: () => import('@/views//production/productionPlan.vue')
                },
                {
                    path: '/production/productionResultRegist',
                    name: 'productionResultRegist',
                    component: () => import('@/views//production/productionResultRegist.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/auth/Login.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
