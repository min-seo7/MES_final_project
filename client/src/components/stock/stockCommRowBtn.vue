<script>
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import 'primeicons/primeicons.css'

export default {
    components: { Button, ButtonGroup },
    props: {
        buttons: { //배열타입의 데이터가 필수로 전달되어야 함.
            type: Array,
            required: true, //유효성검사. 
        }
    }
}
</script>
<template>
    <div class="flex justify-end mb-4 space-x-2">
        <ButtonGroup>
            <Button v-for="btn in buttons" :label="btn.label" :key="btn.label" :icon="btn.icon" @click="btn.onClick"/>
        </ButtonGroup>
    </div>
</template>
