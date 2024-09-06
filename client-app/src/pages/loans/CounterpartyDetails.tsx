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
import { LoanStatus } from "../../app/models/enums/LoanStatus";
import FadeInLoadingWithLabel from "../../components/common/loadings/FadeInLoadingWithLabel";
import dayjs from "dayjs";

export default observer(function CounterpartyDetails() {
    const {
        loanStore: {
            denseLoanItems, toggleDensity,
            selectedSummaries: summaries, selectSummaries, selectedLoans, validateCurrencyIdParam,
            counterpartiesLoaded, loadCounterparties, loansInProgressLoaded, loadLoans}} = useStore();

    useEffect(() => {
        if (!counterpartiesLoaded)
            loadCounterparties();
        if (!loansInProgressLoaded)
            loadLoans(LoanStatus.InProgress);
    }, [counterpartiesLoaded, loansInProgressLoaded])

    const {id} = useParams();

    useEffect(() => {
        if(counterpartiesLoaded && loansInProgressLoaded)
            selectSummaries(Number(id));
    },[counterpartiesLoaded, loansInProgressLoaded])

    const [searchParams, setSearchParams] = useSearchParams();
    const [currencyId, setCurrencyId] = useState<string | null>(searchParams.get('currencyId'));

    useEffect(() => {
        if (summaries.length > 0) {
            const paramCurrencyId = searchParams.get('currencyId');
            const validCurrencyId = validateCurrencyIdParam(paramCurrencyId);

            if (paramCurrencyId !== validCurrencyId) {
                setCurrencyId(validCurrencyId);
                setSearchParams({ currencyId: validCurrencyId });
            } else {
                setCurrencyId(paramCurrencyId);
            }
        }
    }, [summaries]);

    const handleSetCurrencyIdParam = (id: number) => {
        setCurrencyId(id.toString());
        setSearchParams({ currencyId: id.toString() });
    }

    const credits = selectedLoans
        .filter(l => l.loanType === LoanType.Credit)
        .sort((a,b) => b.loanDate.getTime() - a.loanDate.getTime())
        .filter(c => c.currencyId === Number(currencyId));
    const debts = selectedLoans
        .filter(l => l.loanType === LoanType.Debt)
        .sort((a,b) => b.loanDate.getTime() - a.loanDate.getTime())
        .filter(c => c.currencyId === Number(currencyId));

    const showPayoffForm = selectedLoans.length > 0;

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
            <FadeInLoadingWithLabel loadingFlag={counterpartiesLoaded && loansInProgressLoaded && summaries.length > 0} content={
                <Stack spacing={2}>
                    <Divider>Counterparty summary</Divider>
                    <CounterpartySummaryWithPagination
                        key={Number(dayjs())} 
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
                                <CollectivePayoffForm loans={selectedLoans} counterpartyId={Number(id)} />      
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
        }/>
        </>
    )
})