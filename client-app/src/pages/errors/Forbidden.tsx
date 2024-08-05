import { Typography } from "@mui/material";
import CenteredContainer from "./CenteredContainer";

export default function Forbidden() {
    return (
        <CenteredContainer content={
            <>
                <Typography variant="h1" color={'gray'}>403</Typography>
                <Typography variant="h5" mt={3} >You do not have access to this resource</Typography>
            </>
        }/>
    )
}