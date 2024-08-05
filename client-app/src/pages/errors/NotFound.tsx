import { Typography } from "@mui/material";
import CenteredContainer from "./CenteredContainer";

export default function NotFound() {
    return (
        <CenteredContainer content={
            <>
                <Typography variant="h1" color={'gray'}>404</Typography>
                <Typography variant="h5" mt={3} >Resource could not be found</Typography>
            </>
        }/>
    )
}