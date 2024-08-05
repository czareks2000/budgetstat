import { Stack, Typography } from "@mui/material";
import { marginBottom } from "../../app/layout/App";

export default function NotFound() {
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1, height: `calc(100vh - ${marginBottom}px)` }}
        >
            <Typography variant="h1" color={'gray'}>404</Typography>
            <Typography variant="h5" mt={3} >Resource could not be found</Typography>
        </Stack>
    )
}