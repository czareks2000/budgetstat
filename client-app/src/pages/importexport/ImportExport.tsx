import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Alert, Box, Button, Divider, Menu, MenuItem, Paper, Snackbar, Stack, Tab, Tabs, Typography } from "@mui/material"
import CustomTabPanel, { a11yProps } from "../preferences/tabs/CustomTabPanel"
import { useState } from "react"
import agent from "../../app/api/agent"
import { LoadingButton } from "@mui/lab"
import dayjs from "dayjs"
import { KeyboardArrowDown } from "@mui/icons-material"

export default observer(function ImportExport() {
    const [selectedTab, setselectedTab] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setselectedTab(newValue);
    };

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

    // snack bar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const downloadData = async (fileType: "csv" | "json") => {
        setIsLoading(true);
        handleMenuClose();
        try {
            const response = fileType === "csv" 
            ? await agent.Files.getAppDataCsvZip() 
            : await agent.Files.getAppDataJsonZip();
            const blob = new Blob([response.data], { type: 'application/zip' })
            const downloadUrl = URL.createObjectURL(blob)
            const a = document.createElement("a"); 
            const date = dayjs().format("DD.MM.YYYY");
            a.href = downloadUrl;
            a.download = `budgetstat_${date}.zip`;
            document.body.appendChild(a);
            a.click();
        } catch (error) {
            setSnackbarMessage(`Error downloading ZIP file: ${error}`);
            setSnackbarOpen(true);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Import and Export Options</Divider>

                <Paper>
                    <Tabs value={selectedTab} onChange={handleChange} aria-label="import-export-tabs">
                        <Tab label={"Export"}  {...a11yProps(0)}/>
                        <Tab label={"Import"}  {...a11yProps(1)}/>
                    </Tabs>
                </Paper>

                <CustomTabPanel value={selectedTab} index={0}>
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
                                        <MenuItem onClick={() => downloadData("csv")}>Export as CSV</MenuItem>
                                        <MenuItem onClick={() => downloadData("json")}>Export as JSON</MenuItem>
                                    </Menu>
                            </Box>
                        </Stack>
                    </Paper>
                </CustomTabPanel>

                <CustomTabPanel value={selectedTab} index={1}>
                    <Paper>
                        <Box p={2}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography>Import data</Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => alert()}
                                    >
                                        Import transactions
                                    </Button>
                            </Box>
                        </Box>
                    </Paper>
                </CustomTabPanel>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>    
            
            </Stack>
        }/>
    )
})