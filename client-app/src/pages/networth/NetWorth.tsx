import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Divider, Grid, Stack } from "@mui/material"
import LoansCard from "./cards/LoansCard";
import AssetsCard from "./cards/AssetsCard";
import NetWorthCard from "./cards/NetWorthCard";
import NetWorthOverTimeLineChart from "./charts/NetWorthOverTimeLineChart";
import AssetList from "./list/AssetList";

export default observer(function NetWorth() {
    

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
                <Divider>Assets</Divider>
                <AssetList />
            </Stack>
        }/>
    </>
    )
})