import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
    interface Palette {
        backgroundColor?: PaletteColor
    }
    interface PaletteOptions {
        backgroundColor?: PaletteColorOptions
    }

    interface PaletteColor {
        dark: string,
        light: string
    }
    
    interface PaletteColorOptions {
        main?: string,
        dark?: string,
        light?: string
    }
}

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


