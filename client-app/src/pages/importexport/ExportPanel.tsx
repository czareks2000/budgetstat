import { observer } from "mobx-react-lite"
import { Box, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { LoadingButton } from "@mui/lab"
import { KeyboardArrowDown } from "@mui/icons-material"
import { useStore } from "../../app/stores/store"

interface Props {
    setSnackbarOpen: (state: boolean) => void;
    setSnackbarMessage: (message: string) => void;
}

export default observer(function ExportPanel({setSnackbarOpen, setSnackbarMessage}: Props) {
    const {fileStore: {downloadData}} = useStore();

    const [isLoading, setIsLoading] = useState(false);

    // export menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const exportData = async (fileType: "csv" | "json") => {
        setIsLoading(true);
        handleMenuClose();

        downloadData(fileType).catch((error) => {
            setSnackbarMessage(`Error downloading ZIP file: ${error}`);
            setSnackbarOpen(true);
            console.log(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <Paper>
            <Stack p={2} spacing={2}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Export data</Typography>
                        <LoadingButton
                            variant="contained"
                            loading={isLoading}
                            endIcon={<KeyboardArrowDown />}
                            onClick={handleMenuClick}
                        >
                            Export
                        </LoadingButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
                            <MenuItem onClick={() => exportData("json")}>Export as JSON</MenuItem>
                        </Menu>
                </Box>
            </Stack>
        </Paper>
    )
})