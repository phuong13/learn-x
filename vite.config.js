import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3001,
    },
    resolve: {
        alias: {
            '@/': '/src/',
            '@components': '/src/components',
            '@layout': '/src/layout/AppLayout',
            '@ui': '/src/ui',
            '@pages': '/src/pages',
            '@assets': '/src/assets',
            '@styles': '/src/styles',
            '@db': '/src/db',
            '@hooks': '/src/hooks',
            '@fonts': '/src/fonts',
            '@utils': '/src/utils',
            '@widgets': '/src/widgets',
            '@contexts': '/src/contexts',
            '@constants': '/src/constants',
            '@modules': '/src/modules',
        },
    },
});