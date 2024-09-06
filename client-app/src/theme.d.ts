import { PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface PaletteColorOptions{
        main?: string,
        dark?: string,
        light?: string
    }

    interface PaletteColor {
        dark: string,
        light: string
    }

    interface Palette {
        backgroundColor?: PaletteColor
    }
    
    interface PaletteOptions {
        backgroundColor?: PaletteColorOptions
    }
}