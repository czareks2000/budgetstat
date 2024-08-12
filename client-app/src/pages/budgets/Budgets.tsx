import { Box, Divider, Paper, Stack, Tab, Tabs, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store"
import BudgetsList from "./BudgetsList"
import DeleteBudgetDialog from "./DeleteBudgetDialog"
import { useState } from "react"
import { router } from "../../app/router/Routes"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import FloatingAddButton from "../../components/common/fabs/FloatingAddButton"
import { useSearchParams } from "react-router-dom"
import CustomTabPanel, { a11yProps } from "../preferences/tabs/CustomTabPanel"
import { BudgetPeriod } from "../../app/models/enums/BudgetPeriod"

export default observer(function Budgets() {
    const {budgetStore: {weeklyBudgets, monthlyBudgets, annualBudgets, selectedBudget}} = useStore()

    const [searchParams, setSearchParams] = useSearchParams();

    const getTabIndex = () => {
        const period = parseInt(searchParams.get('period') || "2");
        
        switch (period) {
            case BudgetPeriod.Week:
                return 0;
            case BudgetPeriod.Month:
                return 1;
            case BudgetPeriod.Year:
                return 2;
            default:
                return 1; 
        }
    };

    const [selectedTab, setselectedTab] = useState(getTabIndex());

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setselectedTab(newValue);
        setSearchParams({ period: (newValue + 1).toString() });
    };

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }

    const handleAddButtonClick = () => {
        router.navigate(`/budgets/create?period=${selectedTab + 1}`);
    }

    return (
    <>  
        <DeleteBudgetDialog key={selectedBudget?.id} open={openDeleteDialog} setOpen={setOpenDeleteDialog} />
        <FloatingAddButton onClick={handleAddButtonClick}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Budgets</Divider>

                <Paper>
                    <Tabs value={selectedTab} onChange={handleChange} aria-label="budgets-tabs">
                        <Tab label={"Weekly"}  {...a11yProps(0)}/>
                        <Tab label={"Monthly"}  {...a11yProps(1)}/>
                        <Tab label={"Annual"}  {...a11yProps(2)}/>
                    </Tabs>
                </Paper>

                <CustomTabPanel value={selectedTab} index={0}>
                    {weeklyBudgets.length > 0 ? <>
                        <BudgetsList 
                            budgets={weeklyBudgets}
                            openDeleteDialog={handleOpenDeleteDialog}/>
                    </>
                    :<>
                        <Paper>
                            <Box p={2}>
                                <Typography>There is no weekly budgets</Typography>
                            </Box>
                        </Paper>
                    </>
                    }
                </CustomTabPanel>

                <CustomTabPanel value={selectedTab} index={1}>
                    {monthlyBudgets.length > 0 ? <>
                        <BudgetsList 
                            budgets={monthlyBudgets} 
                            openDeleteDialog={handleOpenDeleteDialog}/>
                    </>
                    :<>
                        <Paper>
                            <Box p={2}>
                                <Typography>There is no monthly budgets</Typography>
                            </Box>
                        </Paper>
                    </>
                    }
                </CustomTabPanel>

                <CustomTabPanel value={selectedTab} index={2}>
                    {annualBudgets.length > 0 ? <>
                        <BudgetsList 
                            budgets={annualBudgets} 
                            openDeleteDialog={handleOpenDeleteDialog}/>
                    </>
                    :<>
                        <Paper>
                            <Box p={2}>
                                <Typography>There is no annual budgets</Typography>
                            </Box>
                        </Paper>
                    </>
                    }
                </CustomTabPanel>

            </Stack>
        }/>
    </>
    )
})