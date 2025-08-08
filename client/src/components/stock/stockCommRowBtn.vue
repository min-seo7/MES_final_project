<template>
    <div class="flex justify-end mb-4 space-x-2">
        <ButtonGroup>
            <Button v-for="btn in buttons" :key="btn.label" />
            <Button label="Save" icon="pi pi-check" />
            <Button label="Delete" icon="pi pi-trash" />
            <Button label="Cancel" icon="pi pi-times" />
            <Button label="Cancel" icon="pi pi-times" />
        </ButtonGroup>
    </div>
</template>
