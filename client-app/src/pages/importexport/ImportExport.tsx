import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Alert, Divider, Paper, Snackbar, Stack, Tab, Tabs } from "@mui/material"
import CustomTabPanel, { a11yProps } from "../preferences/tabs/CustomTabPanel"
import { useState } from "react"
import ExportPanel from "./ExportPanel"
import ImportPanel from "./ImportPanel"

export default observer(function ImportExport() {
    const [selectedTab, setselectedTab] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setselectedTab(newValue);
    };

    // snack bar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

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
                    <ExportPanel setSnackbarMessage={setSnackbarMessage} setSnackbarOpen={setSnackbarOpen}/>
                </CustomTabPanel>

                <CustomTabPanel value={selectedTab} index={1}>
                    <ImportPanel setSnackbarMessage={setSnackbarMessage} setSnackbarOpen={setSnackbarOpen}/>
                </CustomTabPanel>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={10000}
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