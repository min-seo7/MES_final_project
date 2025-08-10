<script>
import Button from 'primevue/button';

  export default {
    components: { Button },
    emits: ['search', 'reset'],
  }
</script>
<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="조 회" rounded @click="$emit('search')"/>
        <Button label=" 초기화 " severity="info" rounded @click="$emit('reset')"/>
    </div>
</template>
