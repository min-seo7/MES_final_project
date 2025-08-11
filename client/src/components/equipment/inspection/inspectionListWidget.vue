<script setup>
const props = defineProps({
    /** 목록 데이터 */
    items: { type: Array, default: () => [] },
    /** 내부에서 '목록' 타이틀을 보일지 여부 (기본:false) */
    showTitle: { type: Boolean, default: false }
});

const emit = defineEmits(['row-click']);
</script>

<template>
    <div class="border rounded-md bg-white overflow-hidden">
        <!-- 내부 제목은 기본 비표시 -->
        <div v-if="showTitle" class="px-4 pt-3 pb-2 text-sm font-semibold">목록</div>

        <table class="w-full table-fixed border-t border-gray-200">
            <colgroup>
                <col style="width: 14rem" />
                <col style="width: 10rem" />
                <col style="width: 10rem" />
                <col style="width: 10rem" />
                <col style="width: 10rem" />
                <col style="width: 10rem" />
                <col style="width: 12rem" />
                <col style="width: 10rem" />
                <col />
                <!-- 비고 -->
            </colgroup>

            <thead class="bg-gray-50 text-[14px]">
                <tr>
                    <th class="h-11 text-left pl-4 border-b">점검코드</th>
                    <th class="text-left border-b">설비코드</th>
                    <th class="text-left border-b">점검유형</th>
                    <th class="text-left border-b">점검일</th>
                    <th class="text-left border-b">점검예정일</th>
                    <th class="text-left border-b">점검주기</th>
                    <th class="text-left border-b">최근점검결과</th>
                    <th class="text-left border-b">점검책임자</th>
                    <th class="text-left pr-4 border-b">비고</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, i) in props.items" :key="i" class="hover:bg-gray-50 cursor-pointer" @click="emit('row-click', row)">
                    <td class="h-11 pl-4 border-b">{{ row.insp_code }}</td>
                    <td class="border-b">{{ row.eq_id }}</td>
                    <td class="border-b">{{ row.insp_type }}</td>
                    <td class="border-b">{{ row.insp_date }}</td>
                    <td class="border-b">{{ row.next_date }}</td>
                    <td class="border-b">{{ row.cycle }}</td>
                    <td class="border-b">{{ row.last_result }}</td>
                    <td class="border-b">{{ row.manager }}</td>
                    <td class="border-b pr-4 truncate" :title="row.note">{{ row.note }}</td>
                </tr>

                <tr v-if="!items.length">
                    <td class="h-16 text-center text-gray-500" colspan="9">데이터가 없습니다.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
