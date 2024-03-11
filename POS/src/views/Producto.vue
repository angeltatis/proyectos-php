<template>
  <div class="mt-10 space-y-10 m-3 ">
    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div class="sm:col-span-3">
        <label for="codpro" class="block text-sm font-medium leading-6 text-gray-900">Codigo:</label>
        <div class="mt-2">
          <input type="text" name="codpro" id="codpro" autocomplete="given-codpro" required
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>
      </div>

      <div class="sm:col-span-3">
        <label for="despro" class="block text-sm font-medium leading-6 text-gray-900">Descripción</label>
        <div class="mt-2">
          <input type="text" name="despro" id="despro" autocomplete="family-despro" required
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>
      </div>


      <div class="sm:col-span-3">
        <label for="country" class="block text-sm font-medium leading-6 text-gray-900">Tipo:</label>
        <div class="mt-2">
          <select id="country" name="country" autocomplete="country-name"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
            <option>General</option>
            <option>Lacteos</option>
            <option>Servicio</option>
          </select>
        </div>
      </div>

      <div class="sm:col-span-3   w-35 h-40 aspect-w-2 aspect-h-2 sm:aspect-w-4 sm:aspect-h-4">
        <img src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg" alt="Product Image"
          class="rounded-lg shadow-md border border-gray-300 w-35 h-40 max-w-full object-cover object-center">
      </div>

      <div>
        <TabBar :tabs="tabs" />
        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <!-- Otros elementos del formulario -->

          <div class="sm:col-span-3 w-35 h-40 aspect-w-2 aspect-h-2 sm:aspect-w-4 sm:aspect-h-4">
            <img :src="selectedTabImage" alt="Product Image"
              class="rounded-lg shadow-md border border-gray-300 w-35 h-40 max-w-full object-cover object-center">
          </div>

          <div class="w-2/3">
            <TabContent :tabs="tabs" />
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import TabBar from '../components/TabBar.vue';
import TabContent from '../components/TabContent.vue';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', content: 'This is the dashboard tab.' },
  { id: 'profile', label: 'Profile', content: 'This is the profile tab.' },
  { id: 'settings', label: 'Settings', content: 'This is the settings tab.' },
];

const selectedTabImage = 'https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg';
</script>

