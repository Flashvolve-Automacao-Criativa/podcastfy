import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/player/:uid?',
        name: 'Player',
        component: () => import('../views/player/Player.vue'),
    },
    {
        path: '/uploader/:uid?',
        name: 'Uploader',
        component: () => import('../views/uploader/Uploader.vue'),
    },
    {
        path: '/:catchAll(.*)',
        component: () => import('../views/errors/not-found/NotFound.vue'),
        name: 'NotFound',
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;