import { createTheme } from '@mui/material';
import Archivo from '../fonts/archivo/Archivo-Regular.woff2';
import Archivo_SemiExpanded from '../fonts/archivo/Archivo_SemiExpanded-Medium.woff2';
const theme = createTheme({
    colorSchemes: {
        light: true,
        dark: true,
    },
    typography: {
        fontFamily: 'Archivo, sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @font-face {
                    font-family: 'Archivo';
                    font-style: normal;
                    font-weight: 400;
                    src: url(${Archivo}) format('woff2');
                }
                
                @font-face {
                    font-family: 'Archivo SemiExpanded';
                    font-style: normal;
                    font-weight: 500;
                    src: url(${Archivo_SemiExpanded}) format('woff2');
                }
            `,
        },
    },
});

export default theme;
