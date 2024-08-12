import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Button, Divider, Paper, Stack, Tab, Tabs, Typography } from "@mui/material"
import CustomTabPanel, { a11yProps } from "../preferences/tabs/CustomTabPanel"
import { useState } from "react"

export default observer(function ImportExport() {
    const [selectedTab, setselectedTab] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setselectedTab(newValue);
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
                    <Paper>
                        <Stack p={2} spacing={2}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography>Export data</Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => alert()}
                                    >
                                        Export
                                    </Button>
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