import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Grid, Paper, Stack } from "@mui/material"
import LoansCard from "./cards/LoansCard";
import AssetsCard from "./cards/AssetsCard";
import NetWorthCard from "./cards/NetWorthCard";
import NetWorthOverTimeLineChart from "./charts/NetWorthOverTimeLineChart";
import AssetList from "./list/AssetList";
import AssetsValuesGroupedByCategoriesChart from "./charts/AssetsValuesGroupedByCategoriesChart";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
import FadeInLoadingWithLabel from "../../components/common/loadings/FadeInLoadingWithLabel";

export default observer(function NetWorth() {
    const {
        statsStore: {
            loadNetWorthValueOverTime, 
            loadedNetWorthValueOverTime},
        assetStore: {
            assetsLoaded,
            loadAssets
        }} = useStore();

    useEffect(() => {
        if (!loadedNetWorthValueOverTime)
            loadNetWorthValueOverTime();
        if (!assetsLoaded)
            loadAssets();
    }, [loadedNetWorthValueOverTime, assetsLoaded])

    return (
    <>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Summary</Divider>
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                    <Grid item xs>
                        <NetWorthCard />
                    </Grid>
                    <Grid item xs>
                        <AssetsCard />
                    </Grid>
                    <Grid item xs>
                        <LoansCard />
                    </Grid>
                </Stack>
                <NetWorthOverTimeLineChart />
                <FadeInLoadingWithLabel loadingFlag={assetsLoaded} content={
                <Stack spacing={2}>
                    <Divider>Assets</Divider>
                    <Grid container direction={{xs: 'column', sm: 'row'}} gap={2}>
                        <Grid item xs>
                            <AssetList />
                        </Grid>
                        <Paper sx={{ display: { xs: 'none', sm: 'block' }, height: 240}}>         
                            <Grid item xs={'auto'} container justifyContent="center">
                                <Box>
                                    <AssetsValuesGroupedByCategoriesChart />
                                </Box>                      
                            </Grid>
                        </Paper>
                        <Paper sx={{ display: { xs: 'block', sm: 'none' }}}>         
                            <Grid item xs={'auto'} container justifyContent="center">
                                <Box >
                                    <AssetsValuesGroupedByCategoriesChart showLegend/>
                                </Box>                       
                            </Grid>
                        </Paper>
                    </Grid>
                </Stack>} />
                
            </Stack>
        }/>
    </>
    )
})