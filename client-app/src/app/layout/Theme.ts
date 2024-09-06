import { createTheme } from '@mui/material'

export const theme = createTheme({
    typography: {
        fontFamily: "Nunito"
    },
    palette: {
        primary: {
            main: '#0099FF'
        },
        backgroundColor: {
            dark: '#242939',
            light: '#F2F3F8'
        }
    },
    zIndex: {
        appBar: 1250
    }
});


