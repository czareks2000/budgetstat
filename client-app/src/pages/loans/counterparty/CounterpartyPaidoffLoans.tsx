import { observer } from "mobx-react-lite"
import { Box, Divider, Fade, Paper, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useStore } from "../../../app/stores/store"
import { useParams } from "react-router-dom"
import { LoanType } from "../../../app/models/enums/LoanType"
import { LoanStatus } from "../../../app/models/enums/LoanStatus"
import { useEffect, useState } from "react"
import LoadingWithLabel from "../../../components/common/loadings/LoadingWithLabel"
import CustomTabPanel, { a11yProps } from "../../preferences/tabs/CustomTabPanel"
import LoanListWithPagination from "../common/LoanListWithPagination"

export default observer(function CounterpartyPaidoffLoans() {
    const {loanStore: {getCounterpartyLoans, loadLoans, loansPaidOffLoaded, counterpartyLoansLoaded, 
        counterpartiesLoaded, loadCounterparties, loansInProgressLoaded}} = useStore()

    useEffect(() => {
        if (!counterpartiesLoaded)
            loadCounterparties();
        if (!loansInProgressLoaded)
            loadLoans(LoanStatus.InProgress);
    }, [counterpartiesLoaded, loansInProgressLoaded])

    const [selectedTab, setselectedTab] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setselectedTab(newValue);
    };

    const {id} = useParams();

    useEffect(() => {
        if (!counterpartyLoansLoaded.includes(Number(id)))
            loadLoans(LoanStatus.PaidOff, Number(id));
    }, [loadLoans, counterpartyLoansLoaded])

    const credits = getCounterpartyLoans(Number(id), LoanType.Credit, LoanStatus.PaidOff)
        .sort((a,b) => b.loanDate.getTime() - a.loanDate.getTime());
    const debts = getCounterpartyLoans(Number(id), LoanType.Debt, LoanStatus.PaidOff)
        .sort((a,b) => b.loanDate.getTime() - a.loanDate.getTime());
    
    return (
        <>
            {!loansPaidOffLoaded && <LoadingWithLabel />}

            <Fade in={loansPaidOffLoaded && counterpartiesLoaded && loansInProgressLoaded} appear={false}>
                <Stack spacing={2}>
                    {(credits.length == 0 && debts.length == 0) 
                    ? 
                        <Divider>There is no history</Divider>
                    : 
                    <>
                        <Divider>History</Divider>
                        <Paper>
                            <Tabs value={selectedTab} onChange={handleChange} aria-label="categories-tabs">
                                <Tab label={"Credits"}  {...a11yProps(0)}/>
                                <Tab label={"Debts"}  {...a11yProps(1)}/>
                            </Tabs>
                        </Paper>

                        <CustomTabPanel value={selectedTab} index={0}>
                            {credits.length > 0 ?
                                <LoanListWithPagination key={credits.length} loans={credits} />
                                :
                                <Paper>
                                    <Box p={2}>
                                        <Typography>There is no credits history</Typography>
                                    </Box>
                                </Paper>
                            }
                        </CustomTabPanel>
                        
                        <CustomTabPanel value={selectedTab} index={1}>
                            {debts.length > 0 ?
                                <LoanListWithPagination key={debts.length} loans={debts} />
                            :
                                <Paper>
                                    <Box p={2}>
                                        <Typography>There is no debts history</Typography>
                                    </Box>
                                </Paper>
                            }
                        </CustomTabPanel>
                    </>
                    } 
                </Stack>
            </Fade>
        </>
    )
})