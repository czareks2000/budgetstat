import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Button, Divider, Paper, Stack, Tab, Tabs, Typography } from "@mui/material"
import CustomTabPanel, { a11yProps } from "../preferences/tabs/CustomTabPanel"
import { useState } from "react"
import agent from "../../app/api/agent"
import { LoadingButton } from "@mui/lab"

export default observer(function ImportExport() {
    const [selectedTab, setselectedTab] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setselectedTab(newValue);
    };

    const [isLoading, setIsLoading] = useState(false);

    const downloadData = async () => {
        setIsLoading(true);
        try {
            const response = await agent.Files.getAppDataCsvZip();
            const blob = new Blob([response.data], { type: 'application/zip' })
            const downloadUrl = URL.createObjectURL(blob)
            const a = document.createElement("a"); 
            a.href = downloadUrl;
            a.download = "goalsprogress.zip";
            document.body.appendChild(a);
            a.click();
        } catch (error) {
            //store.commonStore.setError(`Error downloading ZIP file: ${error}`)
            // tu zrobić snack bar
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
                                        onClick={() => downloadData()}
                                    >
                                        Export
                                    </LoadingButton>
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
                                        Import
                                    </Button>
                            </Box>
                        </Box>
                    </Paper>
                </CustomTabPanel>    
            
            </Stack>
        }/>
    )
})