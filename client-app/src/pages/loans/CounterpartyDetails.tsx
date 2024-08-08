import { observer } from "mobx-react-lite"
import FloatingAddButton from "../../components/common/fabs/FloatingAddButton"
import { router } from "../../app/router/Routes";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Paper, Stack, Switch, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import FloatingGoBackButton from "../../components/common/fabs/FloatingGoBackButton";
import { useStore } from "../../app/stores/store";
import { useParams, useSearchParams } from "react-router-dom";
import { LoanType } from "../../app/models/enums/LoanType";
import LoanItem from "./common/LoanItem";
import { Fragment, useEffect, useState } from "react";
import { ExpandMore } from "@mui/icons-material";
import CounterpartySummaryWithPagination from "./counterparty/CounterpartySummaryWithPagination";
import CounterpartyPaidoffLoans from "./counterparty/CounterpartyPaidoffLoans";
import CollectivePayoffForm from "../../components/forms/Loan/CollectivePayoffForm";
import CustomTabPanel, { a11yProps } from "../preferences/tabs/CustomTabPanel";
import LoanItemCompact from "./common/LoanItemCompact";

export default observer(function CounterpartyDetails() {
    const {
        loanStore: {
            denseLoanItems, toggleDensity,
            getCounterpartyLoans, selectedSummaries: summaries, selectSummaries}} = useStore();

    const {id} = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    const [currencyId, setCurrencyId] = useState<string | null>(searchParams.get('currencyId'));

    useEffect(() => {
        if(id)
            selectSummaries(Number(id));
        else
            router.navigate('/not-found');
    },[id])

    useEffect(() => {
        if (summaries.filter(s => s.currencyId === Number(currencyId)).length === 0 && summaries.length > 0) {
            handleSetCurrencyIdParam(summaries[0].currencyId);
        }
    }, [summaries, currencyId]);

    const handleSetCurrencyIdParam = (id: number) => {
        setCurrencyId(id.toString());
        setSearchParams({ currencyId: id.toString() });
    }

    const credits = getCounterpartyLoans(Number(id), LoanType.Credit)
        .sort((a,b) => a.repaymentDate.getTime() - b.repaymentDate.getTime())
        .filter(c => c.currencyId === Number(currencyId));
    const debts = getCounterpartyLoans(Number(id), LoanType.Debt)
        .sort((a,b) => a.repaymentDate.getTime() - b.repaymentDate.getTime())
        .filter(c => c.currencyId === Number(currencyId));

    const loans = [...credits, ...debts];

    const loansCount = credits.length + debts.length;
    const showPayoffForm = loansCount > 0;

    const [isAcordionOpen, setIsAcordionOpen] = useState(false);

    const handleAcordionToggle = () => {
        setIsAcordionOpen(!isAcordionOpen);
    };

    const [showHistory, setShowHistory] = useState<boolean>(searchParams.get('showHistory') === 'true');

    const handleShowHistoryToggle = () => {
        const newShowHistory = !showHistory;
        setShowHistory(newShowHistory);

        const params = Object.fromEntries(searchParams.entries());
        params.showHistory = String(newShowHistory);
        setSearchParams(new URLSearchParams(params));
    };

    const handleAddButtonClick = () => {
        router.navigate(`/loans/create?counterpartyId=${id}`);
    }

    const handleGoBack = () => {
        router.navigate('/loans');
    }
    
    const [selectedTab, setselectedTab] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setselectedTab(newValue);
    };

    return (
        <>
        <FloatingGoBackButton onClick={handleGoBack} position={1}/>
        <FloatingAddButton onClick={handleAddButtonClick} position={0}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Counterparty summary</Divider>
                <CounterpartySummaryWithPagination 
                    summaries={summaries}
                    currencyId={currencyId}
                    setSearchParams={handleSetCurrencyIdParam} 
                    onClick={handleShowHistoryToggle}
                    buttonText={showHistory ? "Current loans" : "Show history"}/>

                {showPayoffForm &&
                <>
                    <Accordion expanded={isAcordionOpen} onChange={handleAcordionToggle}>
                        <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="collective-payoff-form"
                        id="collective-payoff-form"
                        >
                            {!isAcordionOpen ? 'Collective repayment' : 'Click to hide'}
                        </AccordionSummary>
                        <Divider sx={{mb: 1}}/>
                        <AccordionDetails>
                            <CollectivePayoffForm loans={loans} counterpartyId={Number(id)} />      
                        </AccordionDetails>
                    </Accordion>
                </>}

                {showHistory && 
                    <CounterpartyPaidoffLoans />
                }
                
                {!showHistory && (credits.length > 0 || debts.length > 0) && <>
                    <Divider>Current loans</Divider>
                    <Paper>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={"center"}>
                            <Tabs value={selectedTab} onChange={handleChange} aria-label="categories-tabs">
                                <Tab label={"Credits"}  {...a11yProps(0)}/>
                                <Tab label={"Debts"}  {...a11yProps(1)}/>
                            </Tabs>
                            <Tooltip title={"Toggle item density"} 
                                    arrow placement="top">
                                <Box>
                                    <Switch
                                        checked={denseLoanItems} 
                                        onClick={toggleDensity}
                                    />                                   
                                </Box>
                            </Tooltip>
                        </Box>
                    </Paper>

                    <CustomTabPanel value={selectedTab} index={0}>
                        {credits.length > 0 ?
                            <Stack spacing={2}>
                                {credits.map((loan) => 
                                    <Fragment key={loan.id}>
                                        {denseLoanItems 
                                        ? <LoanItemCompact loan={loan} detailsAction/>
                                        : <LoanItem  loan={loan} detailsAction/>}
                                    </Fragment>
                                )}
                            </Stack>
                            :
                            <Paper>
                                <Box p={2}>
                                    <Typography>There is no current credits</Typography>
                                </Box>
                            </Paper>
                        }
                    </CustomTabPanel>

                    <CustomTabPanel value={selectedTab} index={1}>
                        {debts.length > 0 ?
                            <Stack spacing={2}>
                            {debts.map((loan) => 
                                <Fragment key={loan.id}>
                                    {denseLoanItems 
                                    ? <LoanItemCompact loan={loan} detailsAction/>
                                    : <LoanItem  loan={loan} detailsAction/>}
                                </Fragment>
                            )}
                            </Stack>
                        :
                            <Paper>
                                <Box p={2}>
                                    <Typography>There is no current debts</Typography>
                                </Box>
                            </Paper>
                        }
                    </CustomTabPanel>                    
                </>}
            </Stack>
        }/>
        </>
    )
})