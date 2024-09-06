import { observer } from "mobx-react-lite";
import { Button, Grid2, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers, FormikState } from "formik";
import * as Yup from "yup";
import { useStore } from "../../../app/stores/store";
import { Option } from "../../../app/models/Option";

import dayjs from "dayjs";
import MultipleSelectWithChceckBoxes from "../../../components/formInputs/MultipleSelectWithChceckBoxes";
import MyDatePicker from "../../../components/formInputs/MyDatePicker";
import SelectInput from "../../../components/formInputs/SelectInput";
import { AvgMonthlyTransactionsValuesSettings } from "../../../app/models/ChartsSettings";
import { AvgChartPeriod } from "../../../app/models/enums/periods/AvgChartPeriod";
import { CategoryType } from "../../../app/models/enums/CategoryType";


export default observer(function AvgMonthlyExpensesByCategoriesBarChartSettings() {
    const {
        accountStore: {accountsNamesAsOptions},
        categoryStore: {mainExpenseCategoriesAsOptions},
        statsStore: {
            avgMonthlyExpensesByCategoriesSettingsHasInitialValues, resetAvgMonthlyExpensesByCategoriesSettings, 
            avgMonthlyExpensesByCategoriesSettings, setAvgMonthlyExpensesByCategoriesSettings} } = useStore()
    
    const validationSchema = Yup.object({
        categoryType: Yup.string().required('Category type is required'),
        mainCategoryId: Yup.string().when('categoryType', {
            is: (val: CategoryType) => val == CategoryType.Sub,
            then: schema => schema.required('Main category required')
        }),
        startDate: Yup.date()
            .typeError('Invalid date format')
            .required('Start date is required')
            .test('start-before-end', 'Start date cannot be after end date', function(value) {
                const { endDate } = this.parent;
                return !endDate || value <= endDate;
            }),
        endDate: Yup.date()
            .typeError('Invalid date format')
            .required('End date is required')
            .test('start-before-end', 'End date cannot be before start date', function(value) {
                const { startDate } = this.parent;
                return !startDate || value >= startDate;
            })
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'End date cannot be in the future')
    });

    const handleSubmit = (
        settings: AvgMonthlyTransactionsValuesSettings, 
        helpers: FormikHelpers<AvgMonthlyTransactionsValuesSettings>
    ) => {
        setAvgMonthlyExpensesByCategoriesSettings(settings).then(() => {
            helpers.resetForm({values: {...settings}});
        });
    }

    const handleReset = (
        resetForm: (nextState?: Partial<FormikState<AvgMonthlyTransactionsValuesSettings>>) => void) => {     
        
        if (!avgMonthlyExpensesByCategoriesSettingsHasInitialValues)
            resetAvgMonthlyExpensesByCategoriesSettings();

        resetForm();
    }

    const periodOptions: Option[] = [
        {
            value: AvgChartPeriod.LastYear,
            text: "Last year"
        },
        {
            value: AvgChartPeriod.Custom,
            text: "Custom"
        },
    ]

    const categoryOptions: Option[] = [
        {
            value: CategoryType.Main,
            text: "Main categories"
        },
        {
            value: AvgChartPeriod.Custom,
            text: "Subcategories"
        },
    ]

    return (
        <>
            <Formik
                key={Number(avgMonthlyExpensesByCategoriesSettingsHasInitialValues)}
                initialValues={avgMonthlyExpensesByCategoriesSettings}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
            {({ isValid, dirty, isSubmitting, values, resetForm }) => (
                <Form>
                    <Stack spacing={2}>

                        {/* Category */}
                        <Stack direction={'row'} spacing={2} alignItems={'top'}>
                            <Grid2 size={"grow"}>
                                <SelectInput 
                                    label="Categories type" name={"categoryType"}
                                    fullWidth 
                                    options={categoryOptions} />   
                            </Grid2>
                            {values.categoryType === CategoryType.Sub && <>
                            <Grid2 size={'auto'} pt={2}>
                                of
                            </Grid2>
                            <Grid2 size={"grow"}>
                                <SelectInput 
                                    label="Main category" name={"mainCategoryId"} 
                                    fullWidth 
                                    options={mainExpenseCategoriesAsOptions} />
                            </Grid2></>}
                        </Stack>
                    
                        {/* Period */}
                        <SelectInput 
                            label="Period" name={"period"} 
                            options={periodOptions} />     

                        {values.period === AvgChartPeriod.Custom &&
                        <Stack direction={'row'} spacing={2} alignItems={'top'}>
                            <Grid2 size={"grow"}>
                                {/* Start Date */}
                                <MyDatePicker 
                                    defaultValue={dayjs().add(-30, 'days')}
                                    format="MM/YYYY"
                                    views={['month','year']}
                                    label="Start Date" 
                                    name={"startDate"}/>
                            </Grid2>
                            <Grid2 size={'auto'} pt={2}>
                                -
                            </Grid2>
                            <Grid2 size={"grow"}>
                                {/* End Date */}
                                <MyDatePicker 
                                    defaultValue={dayjs()}
                                    format="MM/YYYY"
                                    views={['month','year']}
                                    label="End Date" 
                                    name={"endDate"}/>
                            </Grid2>
                        </Stack>}

                        {/* Accounts */}
                        <MultipleSelectWithChceckBoxes 
                            label="Accounts" name={"accountIds"}
                            placeholder="All"
                            limitTags={5}
                            options={accountsNamesAsOptions}/>

                        {/* Button */}
                        <Stack spacing={2} direction={'row'}>
                            <Button
                                color="info"
                                variant="contained"
                                disabled={
                                    (avgMonthlyExpensesByCategoriesSettingsHasInitialValues
                                    && !dirty && !isSubmitting)}
                                fullWidth
                                onClick={() => handleReset(resetForm)}>
                                Reset
                            </Button>
                            <LoadingButton
                                color="primary"
                                variant="contained"
                                type="submit"
                                fullWidth
                                disabled={!(dirty && isValid) || isSubmitting}
                                loading={isSubmitting}>
                                Apply
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </Form>
            )}
            </Formik>
        </>
    )
})