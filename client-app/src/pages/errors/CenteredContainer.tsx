import { Stack } from "@mui/material";
import { marginBottom } from "../../app/layout/App";
import { ReactNode } from "react";

interface Props {
    content: ReactNode;
}

export default function CenteredContainer(props: Props) {
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1, height: `calc(100vh - ${marginBottom}px)` }}
        >
            {props.content}
        </Stack>
    )
}