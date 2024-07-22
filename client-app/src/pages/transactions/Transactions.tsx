import { Divider, Grid, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import FloatingAddButton from "../../components/common/FloatingAddButton"
import { router } from "../../app/router/Routes"
import TransactionsDataGrid from "./list/TransactionsDataGrid"
import TransactionsFilters from "./list/TransactionsFilters"

export default observer(function Transactions() {   
    const handleAddButtonClick = () => {
        router.navigate(`/transactions/create`);
    }
      
    return ( 
    <>
        <FloatingAddButton onClick={handleAddButtonClick}/>
        <Grid container>
            <Grid item xs lg xl/>
            <Grid item xs={12} xl={8} container spacing={2}>
                <Grid item xs={12} sm={'auto'} md={12} lg={'auto'}>
                    <Stack spacing={2} minWidth={300} maxWidth={{xs: 1000, sm: 300, md: 1000, lg: 300}}>
                        <Divider>Filters</Divider>
                        {/* tutaj 2 wersje komponentu dla 12 i dla auto */}
                        <TransactionsFilters />
                    </Stack>
                </Grid>
                <Grid item xs md xl>
                    <Stack spacing={2}>
                        <Divider>Transactions</Divider>
                        <TransactionsDataGrid />
                    </Stack>
                </Grid>
            </Grid>
            <Grid item xs lg xl/>
        </Grid>
    </>
    )
})