<template>
    <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li v-for="tab in tabs" :key="tab.id" :class="{ 'me-2': tabs.indexOf(tab) !== tabs.length - 1 }"
                role="presentation">
                <button @click="selectTab(tab)" class="inline-block p-4 border-b-2 rounded-t-lg"
                    :class="{ 'border-indigo-600': selectedTab === tab.id, 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': selectedTab !== tab.id }"
                    :id="`${tab.id}-tab`" :data-tab-target="tab.id" :aria-controls="tab.id"
                    :aria-selected="selectedTab === tab.id">
                    {{ tab.label }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        tabs: Array,
    },
    data() {
        return {
            selectedTab: null,
        };
    },
    methods: {
        selectTab(tab) {
            this.selectedTab = tab.id;
        },
    },
};
</script>