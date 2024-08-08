import { Divider, Fade, Grid, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import FloatingAddButton from "../../components/common/fabs/FloatingAddButton"
import { router } from "../../app/router/Routes"
import TransactionsDataGrid from "./list/TransactionsDataGrid"
import TransactionsFilters from "./list/TransactionsFilters"
import FloatingShowPlannedTransactionButton from "../../components/common/fabs/FloatingShowPlannedTransactionButton"

export default observer(function Transactions() {   
    const handleAddButtonClick = () => {
        router.navigate(`/transactions/create`);
    }

    const handleShowPlannedTransactions = () => {
        router.navigate('/transactions/planned');
    }
      
    return ( 
    <>
        <FloatingShowPlannedTransactionButton 
            onClick={handleShowPlannedTransactions} position={1}/>
        <FloatingAddButton 
            onClick={handleAddButtonClick} position={0}/>
        <Grid container>
            <Grid item xs lg xl/>
            <Grid item xs={12} xl={8} container spacing={2}>
                <Grid item xs={12} sm={'auto'} md={12} lg={'auto'}>
                    <Stack spacing={2} minWidth={300} maxWidth={{xs: 1000, sm: 300, md: 1000, lg: 300}}>
                        <Divider>Filters</Divider>
                        {/* tutaj 2 wersje komponentu dla 12 i dla auto */}
                        <Fade in={true} timeout={300}>
                            <span>
                            <TransactionsFilters />
                            </span>
                        </Fade>
                    </Stack>
                </Grid>
                <Grid item xs md xl>
                    <Stack spacing={2}>
                        <Divider>Transactions</Divider>
                        <Fade in={true} timeout={300}>
                            <span>
                            <TransactionsDataGrid />
                            </span>
                        </Fade>
                    </Stack>
                </Grid>
            </Grid>
            <Grid item xs lg xl/>
        </Grid>
    </>
    )
})