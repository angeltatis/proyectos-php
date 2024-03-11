import { createRouter, createWebHistory } from 'vue-router';
import Home from  '../views/Home.vue';
import Producto from  '../views/Producto.vue';
import Consulta from '../views/Consulta.vue'; // Import the Consulta component
import Configuracion from '../views/Configuracion.vue'; // Import the Configuracion component


const routes = [
    { path: '/', component: Home },
    { path: '/producto', component: Producto },
    { path: '/consulta', component: Consulta },
    { path: '/config', component: Configuracion },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
