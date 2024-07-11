import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Card, CardContent, Divider, Grid, IconButton, Paper, Stack, Typography } from "@mui/material"
import { LineChart } from "@mui/x-charts"
import { theme } from "../../app/layout/Theme";
import { Add, Balance, Home, PendingActions, PlusOne, RequestQuote } from "@mui/icons-material";

export default observer(function NetWorth() {
    const data = [39000, 42100, 44000, 43000, 41200, 42000, 42137, 44000, 43700, 46500, 45000, 47000];
    const xLabels = [
    '08/2023',
    '09/2023',
    '10/2023',
    '11/2023',
    '12/2023',
    '01/2024',
    '02/2024',
    '03/2024',
    '04/2024',
    '05/2024',
    '06/2024',
    '07/2024',
    ];

    return (
        <>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Summary</Divider>
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                    <Grid item xs>
                        <Card>
                            <CardContent>
                                <Box display={'flex'}>
                                    <Balance sx={{mt: '3px', mr: 1}}/>
                                    <Typography variant="h6" gutterBottom>
                                        Net worth
                                    </Typography>
                                </Box>
                                <Typography variant="h5" color={'primary'}>297 000 zł</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs>
                        <Card>
                            <CardContent>
                                <Box display={'flex'} justifyContent="space-between">
                                    <Box display={'flex'}>
                                        <Home sx={{mt: '3px', mr: 1}}/>
                                        <Typography variant="h6" gutterBottom>
                                            Assets 
                                        </Typography>
                                    </Box>
                                    <Box sx={{mt: '-3px', mr: '-3px'}}>
                                        <IconButton 
                                            aria-label="add"
                                            size="small">
                                            <Add />
                                        </IconButton> 
                                    </Box>
                                </Box>
                                <Typography variant="h5">300 000 zł</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs>
                        <Card>
                            <CardContent>
                                <Box display={'flex'} justifyContent="space-between">
                                    <Box display={'flex'}>
                                        <PendingActions sx={{mt: '3px', mr: 1}}/> 
                                        <Typography variant="h6" gutterBottom>
                                            Loans 
                                        </Typography>
                                    </Box>
                                    <Box sx={{mt: '-3px', mr: '-3px'}}>
                                        <IconButton 
                                            aria-label="add"
                                            size="small">
                                            <Add />
                                        </IconButton> 
                                    </Box>
                                </Box>
                                
                                <Typography variant="h5" color={'error'}>-3 000 zł</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Stack>
                <Paper>
                    <Box pl={3} pb={2} height={400}>
                    <LineChart
                        series={[
                            { data: data, color: theme.palette.primary.main},
                        ]}
                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                    />
                    </Box>
                </Paper>
                <Divider>Assets</Divider>
                <Paper>
                    <Box p={2} height={400}>

                    </Box>
                </Paper>
            </Stack>
        }/>
        </>
    )
})