import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Divider, Fade, Paper, Stack, Tab, Tabs } from "@mui/material"
import FloatingGoBackButton from "../../components/common/fabs/FloatingGoBackButton"
import { router } from "../../app/router/Routes"
import FloatingAddButton from "../../components/common/fabs/FloatingAddButton"
import { useEffect, useState } from "react"
import { useStore } from "../../app/stores/store"
import CustomTabPanel, { a11yProps } from "./tabs/CustomTabPanel"
import CategoriesTab from "./tabs/CategoriesTab"
import LoadingCenter from "../../components/common/loadings/LoadingCenter"
import { useSearchParams } from "react-router-dom"
import { TransactionType } from "../../app/models/enums/TransactionType"

export default observer(function ManageCategories() {
    const {categoryStore: {
        mainExpenseCategories, mainIncomeCategories, 
        loadCategories, categoriesLoaded}} = useStore();

    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedTab, setselectedTab] = useState(searchParams.get('type') === 'income' ? 1 : 0);

    useEffect(() => {
        if (!categoriesLoaded)
            loadCategories();
    }, [])

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setselectedTab(newValue);
        setSearchParams({type: newValue === 1 ? 'income' : 'expense'})
    };

    const handleGoBack = () => {
        router.navigate('/preferences')
    }

    const handleAddButtonClick = () => {
        const transactionType = selectedTab === 0 ? TransactionType.Expense : TransactionType.Income;

        router.navigate(`/preferences/categories/create?transactionType=${transactionType}`)
    }

    return (
    <>
        <FloatingGoBackButton onClick={handleGoBack} position={1}/>
        <FloatingAddButton onClick={handleAddButtonClick} />
        <ResponsiveContainer content={
            <Stack spacing={2}>

                <Divider>Manage Categories</Divider>

                <Paper>
                    <Tabs value={selectedTab} onChange={handleChange} aria-label="categories-tabs">
                        <Tab label={"Expense"}  {...a11yProps(0)}/>
                        <Tab label={"Income"}  {...a11yProps(1)}/>
                    </Tabs>
                </Paper>

                {!categoriesLoaded && <LoadingCenter />}

                <Fade in={categoriesLoaded} appear={false}>
                    <span>
                        <CustomTabPanel value={selectedTab} index={0}>
                            <CategoriesTab 
                                mainCategories={mainExpenseCategories}/>
                        </CustomTabPanel>

                        <CustomTabPanel value={selectedTab} index={1}>
                            <CategoriesTab
                                mainCategories={mainIncomeCategories}/>
                        </CustomTabPanel>
                    </span>
                </Fade>
                
            </Stack>
        } 
        />
    </>
    )
})