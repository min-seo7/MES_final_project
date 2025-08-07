<template>
    <div class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Advanced</div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="firstname2">Firstname</label>
                    <InputText id="firstname2" type="text" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="lastname2">Lastname</label>
                    <InputText id="lastname2" type="text" />
                </div>
            </div>

            <div class="flex flex-wrap">
                <label for="address">Address</label>
                <Textarea id="address" rows="4" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
    .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
