import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Grid2, Paper, Stack } from "@mui/material"
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
                    <Grid2 size={"grow"}>
                        <NetWorthCard />
                    </Grid2>
                    <Grid2 size={"grow"}>
                        <AssetsCard />
                    </Grid2>
                    <Grid2 size={"grow"}>
                        <LoansCard />
                    </Grid2>
                </Stack>
                <NetWorthOverTimeLineChart />
                <FadeInLoadingWithLabel loadingFlag={assetsLoaded} content={
                    <Stack spacing={2}>
                        <Divider>Assets</Divider>
                        <Grid2 container direction={{xs: 'column', sm: 'row'}} gap={2}>
                            <Grid2 size={"grow"}>
                                <AssetList />
                            </Grid2>
                            <Paper sx={{ display: { xs: 'none', sm: 'block' }, height: 240}}>         
                                <Grid2 size={'auto'} container justifyContent="center" p={0}>
                                    <Box width={240}>
                                        <AssetsValuesGroupedByCategoriesChart />      
                                    </Box> 
                                </Grid2>
                            </Paper>
                            <Paper sx={{ display: { xs: 'block', sm: 'none' }}}>         
                                <Grid2 size={'auto'} container justifyContent="center" p={2}>
                                    <Box width={310}>
                                        <AssetsValuesGroupedByCategoriesChart showLegend/>  
                                    </Box>      
                                </Grid2>
                            </Paper>
                        </Grid2>
                    </Stack>} />
                
            </Stack>
        }/>
    </>
    )
})