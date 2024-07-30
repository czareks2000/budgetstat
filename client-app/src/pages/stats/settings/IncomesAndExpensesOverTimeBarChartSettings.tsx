import { observer } from "mobx-react-lite";
import { Button, Grid, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers, FormikState } from "formik";
import * as Yup from "yup";
import { useStore } from "../../../app/stores/store";
import { Option } from "../../../app/models/Option";

import dayjs from "dayjs";
import MultipleSelectWithChceckBoxes from "../../../components/formInputs/MultipleSelectWithChceckBoxes";
import MyDatePicker from "../../../components/formInputs/MyDatePicker";
import SelectInput from "../../../components/formInputs/SelectInput";
import { IncomesAndExpensesOverTimeSettings } from "../../../app/models/ChartsSettings";
import { ExtendedChartPeriod } from "../../../app/models/enums/periods/ExtenedChartPeriod";
import CategoryGroupedInput from "../../../components/formInputs/CategoryGroupedInput";
import { TransactionType } from "../../../app/models/enums/TransactionType";


export default observer(function IncomesAndExpensesOverTimeBarChartSettings() {
    const {
        accountStore: {accountsNamesAsOptions},
        categoryStore: {getCategoriesAsOptions},
        statsStore: {
            incomesAndExpensesOverTimeSettings, incomesAndExpensesOverTimeSettingsHasInitialValues,
            setIncomesAndExpensesOverTimeSettings, resetIncomesAndExpensesOverTimeSettings} } = useStore()
    
    const validationSchema = Yup.object({
        period: Yup.string().required(),
        customDate: Yup.date().when('period', {
                is: (val: ExtendedChartPeriod) => 
                    val == ExtendedChartPeriod.CustomMonth || 
                    val == ExtendedChartPeriod.CustomYear,
                then: schema => schema.required('Date is required')
            })
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'Date cannot be in the future')
            .typeError('Invalid date format')
    });

    const handleSubmit = (
        settings: IncomesAndExpensesOverTimeSettings, 
        helpers: FormikHelpers<IncomesAndExpensesOverTimeSettings>
    ) => {
        setIncomesAndExpensesOverTimeSettings(settings).then(() => {
            helpers.resetForm({values: {...settings}});
        });
    }

    const handleReset = (
        resetForm: (nextState?: Partial<FormikState<IncomesAndExpensesOverTimeSettings>>) => void) => {     
        
        if (!incomesAndExpensesOverTimeSettingsHasInitialValues)
            resetIncomesAndExpensesOverTimeSettings();

        resetForm();
    }

    const periodOptions: Option[] = [
        {
            value: ExtendedChartPeriod.Last7Days,
            text: "Last 7 days"
        },
        {
            value: ExtendedChartPeriod.Last30Days,
            text: "Last 30 days"
        },
        {
            value: ExtendedChartPeriod.LastYear,
            text: "Last year"
        },
        {
            value: ExtendedChartPeriod.Last5Years,
            text: "Last 5 years"
        },
        {
            value: ExtendedChartPeriod.CustomMonth,
            text: "Custom month"
        },
        {
            value: ExtendedChartPeriod.CustomYear,
            text: "Custom year"
        },
    ]

    return (
        <>
            <Formik
                key={Number(incomesAndExpensesOverTimeSettingsHasInitialValues)}
                initialValues={incomesAndExpensesOverTimeSettings}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
            {({ isValid, dirty, isSubmitting, values, resetForm }) => (
                <Form>
                    <Stack spacing={2}>
                
                        <Stack direction={'row'} spacing={2}>
                            <Grid item xs>
                                {/* Period */}
                                <SelectInput 
                                    label="Period" name={"period"}
                                    fullWidth
                                    options={periodOptions} />    
                            </Grid>
                            {values.period === ExtendedChartPeriod.CustomMonth &&
                            <Grid item xs>
                                {/* Custom */}
                                <MyDatePicker 
                                    defaultValue={dayjs()}
                                    label="Choose Month" 
                                    views={['month','year']}
                                    format="MM/YYYY"
                                    name={"customDate"}/>
                            </Grid>}
                            {values.period === ExtendedChartPeriod.CustomYear &&
                            <Grid item xs>
                                {/* Custom */}
                                <MyDatePicker 
                                    defaultValue={dayjs()}
                                    label="Choose Year"
                                    views={['year']}
                                    format="YYYY" 
                                    name={"customDate"}/>
                            </Grid>}
                        </Stack>

                        {/* Accounts */}
                        <MultipleSelectWithChceckBoxes 
                            label="Accounts" name={"accountIds"}
                            placeholder="All"
                            limitTags={5}
                            options={accountsNamesAsOptions}/>

                        {/* Expense Categories */}
                        <CategoryGroupedInput label="Expense Categories" name={"expenseCategoryIds"}
                            placeholder="All" shrinkLabel multiple
                            options={getCategoriesAsOptions(TransactionType.Expense, true)} />

                        {/* Income Categories */}
                        <CategoryGroupedInput label="Income Categories" name={"incomeCategoryIds"}
                            placeholder="All" shrinkLabel multiple
                            options={getCategoriesAsOptions(TransactionType.Income, true)} />

                        {/* Button */}
                        <Stack spacing={2} direction={'row'}>
                            <Button
                                color="info"
                                variant="contained"
                                disabled={
                                    (incomesAndExpensesOverTimeSettingsHasInitialValues
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