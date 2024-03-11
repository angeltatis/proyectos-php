<template>
    <div>
        <div v-for="tab in tabs" :key="tab.id" class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" :id="tab.id"
            role="tabpanel" :aria-labelledby="`${tab.id}-tab`">
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ tab.content }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        tabs: Array,
    },
};
</script>
