import { CssBaseline, ThemeProvider } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ScrollRestoration } from "react-router-dom";
import { theme } from "./Theme";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Props {
    content: React.ReactNode;
}

const Wrapper = ({content}: Props) => {
  return (
    <>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <ScrollRestoration/>
        {content}
      </LocalizationProvider>
    </ThemeProvider>
    </>
  )
}

export default Wrapper