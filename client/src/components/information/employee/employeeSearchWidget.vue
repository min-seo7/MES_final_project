<script setup></script>

<template>
    <div class="flex justify-end mb-4">
        <div class="flex justify-end mb-4 space-x-2">
            <Button label=" 조회 " rounded />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl mb-4">검색조건</div>
            <Toolbar>
                <template #center>
                    <IconField iconPosition="left">
                        사원번호
                        <InputText type="text" placeholder="Search" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                    <IconField iconPosition="left">
                        부서
                        <InputText type="text" placeholder="Search" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex items-center">
                            <RadioButton id="option1" name="option" value="일반사원" v-model="radioValue" />
                            <label for="option1" class="leading-none ml-2">Chicago</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="option2" name="option" value="관리자" v-model="radioValue" />
                            <label for="option2" class="leading-none ml-2">Los Angeles</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="option3" name="option" value="상태" v-model="radioValue" />
                            <label for="option3" class="leading-none ml-2">New York</label>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex items-center">
                            <RadioButton id="option1" name="option" value="Chicago" v-model="radioValue" />
                            <label for="option1" class="leading-none ml-2">Chicago</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="option2" name="option" value="Los Angeles" v-model="radioValue" />
                            <label for="option2" class="leading-none ml-2">Los Angeles</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="option3" name="option" value="New York" v-model="radioValue" />
                            <label for="option3" class="leading-none ml-2">New York</label>
                        </div>
                    </div>
                    <IconField iconPosition="left">
                        <InputText type="text" placeholder="Search" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </template>
            </Toolbar>
        </div>
    </div>
</template>
