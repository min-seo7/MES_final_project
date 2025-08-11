<script>
import Dialog from 'primevue/dialog';
//import Button from 'primevue/button';

export default {
    components: { Dialog },
    props: {
        modelValue: Boolean,
        header: String,
        width: {
            type: String,
            default: '60rem'
        }
    },
    emits: ['update:modelValue'],
    computed: {
        visible: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit('update:modelValue', val);
            }
        }
    }
};
</script>

<template>
    <Dialog v-model:visible="visible" :header="header" :style="{ width: '50rem' }">
        <!-- 모달 내용은 modal import하는 곳에서 정의 후 여기로 전달 -->
        <slot></slot>
        <!-- 버튼 영역도 슬롯으로 분리해서..  -->
        <slot name="footer"> <!--slot을 name="footer"로 정의하고, 부모 컴포넌트에서 <template #footer>에 내용작성하면 여기전달--> </slot>
    </Dialog>
</template>
