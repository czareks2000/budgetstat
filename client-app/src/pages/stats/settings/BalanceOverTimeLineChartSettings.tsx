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
import { ChartPeriod } from "../../../app/models/enums/periods/ChartPeriod";
import SelectInput from "../../../components/formInputs/SelectInput";
import { BalanceValueOverTimeSettings, initialBalanceValueOverTimeSettings } from "../../../app/models/ChartsSettings";


export default observer(function BalanceOverTimeLineChartSettings() {
    const {
        accountStore: {accountsNamesAsOptions},
        statsStore: {
            balanceValueOverTimeSettingsHasInitialValues, resetBalanceValueOverTimeSettings, 
            balanceValueOverTimeSettings, setBalanceValueOverTimeSettings} } = useStore()
    
    const validationSchema = Yup.object({
        startDate: Yup.date()
            .required('Start date is required')
            .test('start-before-end', 'Start date cannot be after end date', function(value) {
                const { endDate } = this.parent;
                return !endDate || value <= endDate;
            }),
        endDate: Yup.date()
            .required('End date is required')
            .test('start-before-end', 'End date cannot be before start date', function(value) {
                const { startDate } = this.parent;
                return !startDate || value >= startDate;
            })
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'End date cannot be in the future')
            .test('min-duration', 'The range must be at least 30 days', function(value) {
                const { startDate } = this.parent;
                return !startDate || !value || dayjs(value).diff(dayjs(startDate), 'day') >= 30;
            })
    });

    const handleSubmit = (
        settings: BalanceValueOverTimeSettings, 
        helpers: FormikHelpers<BalanceValueOverTimeSettings>
    ) => {
        setBalanceValueOverTimeSettings(settings).then(() => {
            helpers.resetForm({values: {...settings}});
        });
    }

    const handleReset = (
        resetForm: (nextState?: Partial<FormikState<BalanceValueOverTimeSettings>>) => void) => {     
        
        if (!balanceValueOverTimeSettingsHasInitialValues)
            resetBalanceValueOverTimeSettings();

        resetForm();
    }

    const periodOptions: Option[] = [
        {
            value: ChartPeriod.Last7Days,
            text: "Last 7 days"
        },
        {
            value: ChartPeriod.Last30Days,
            text: "Last 30 days"
        },
        {
            value: ChartPeriod.LastYear,
            text: "Last year"
        },
        {
            value: ChartPeriod.Last5Years,
            text: "Last 5 years"
        },
        {
            value: ChartPeriod.Custom,
            text: "Custom"
        },
    ]

    return (
        <>
            <Formik
                key={Number(balanceValueOverTimeSettingsHasInitialValues)}
                initialValues={balanceValueOverTimeSettings}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
            {({ isValid, dirty, isSubmitting, values, resetForm }) => (
                <Form>
                    <Stack spacing={2}>
                    
                        {/* Period */}
                        <SelectInput 
                            label="Period" name={"period"} 
                            options={periodOptions} />     

                        {values.period === ChartPeriod.Custom &&
                        <Stack direction={'row'} spacing={2} alignItems={'top'}>
                            <Grid item xs>
                                {/* Start Date */}
                                <MyDatePicker 
                                    defaultValue={dayjs().add(-30, 'days')}
                                    label="Start Date" 
                                    name={"startDate"}/>
                            </Grid>
                            <Grid item xs={'auto'} pt={2}>
                                -
                            </Grid>
                            <Grid item xs>
                                {/* End Date */}
                                <MyDatePicker 
                                    defaultValue={dayjs()}
                                    label="End Date" 
                                    name={"endDate"}/>
                            </Grid>
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
                                    (balanceValueOverTimeSettingsHasInitialValues
                                    && !dirty && !isSubmitting) || !isValid}
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