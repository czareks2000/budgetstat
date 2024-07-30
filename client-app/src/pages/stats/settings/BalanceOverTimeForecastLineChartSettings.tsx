import { observer } from "mobx-react-lite";
import { Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers, FormikState } from "formik";
import * as Yup from "yup";
import { useStore } from "../../../app/stores/store";
import { Option } from "../../../app/models/Option";

import MultipleSelectWithChceckBoxes from "../../../components/formInputs/MultipleSelectWithChceckBoxes";
import SelectInput from "../../../components/formInputs/SelectInput";
import { BalanceOverTimeForecastSettings } from "../../../app/models/ChartsSettings";
import { ForecastPeriod } from "../../../app/models/enums/periods/ForecastPeriod";


export default observer(function BalanceOverTimeForecastLineChartSettings() {
    const {
        accountStore: {accountsNamesAsOptions},
        statsStore: {
            balanceOverTimeForecastSettingsHasInitialValues, resetBalanceOverTimeForecastSettings, 
            balanceOverTimeForecastSettings, setBalanceOverTimeForecastSettings} } = useStore()
    
    const validationSchema = Yup.object({

    });

    const handleSubmit = (
        settings: BalanceOverTimeForecastSettings, 
        helpers: FormikHelpers<BalanceOverTimeForecastSettings>
    ) => {
        setBalanceOverTimeForecastSettings(settings).then(() => {
            helpers.resetForm({values: {...settings}});
        });
    }

    const handleReset = (
        resetForm: (nextState?: Partial<FormikState<BalanceOverTimeForecastSettings>>) => void) => {     
        
        if (!balanceOverTimeForecastSettingsHasInitialValues)
            resetBalanceOverTimeForecastSettings();

        resetForm();
    }

    const periodOptions: Option[] = [
        {
            value: ForecastPeriod.NextMonth,
            text: "Next month"
        },
        {
            value: ForecastPeriod.NextYear,
            text: "Next year"
        },
    ]

    return (
        <>
            <Formik
                key={Number(balanceOverTimeForecastSettingsHasInitialValues)}
                initialValues={balanceOverTimeForecastSettings}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
            {({ isValid, dirty, isSubmitting, resetForm }) => (
                <Form>
                    <Stack spacing={2}>
                    
                        {/* Period */}
                        <SelectInput 
                            label="Period" name={"period"} 
                            options={periodOptions} />     

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
                                    (balanceOverTimeForecastSettingsHasInitialValues
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