import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { ErrorMessage, Form, Formik } from "formik";
import { Stack, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import TextInput from "../../formInputs/TextInput";
import * as Yup from 'yup';
import SelectInput from "../../formInputs/SelectInput";

export default observer(function RegisterForm() {
    const {
        userStore, 
        currencyStore: {currenciesAsOptions}
    } = useStore();
    
    return (
        <Formik
            initialValues={{userName: '', email: '', defaultCurrencyId: '',password: '', confirmPassword: '', error: null}}
            onSubmit={(values, {setErrors}) => 
                userStore.register(values).catch(error => 
                    setErrors({error}))        
            }
            validationSchema={Yup.object({
                userName: Yup.string().required('Username is required'),
                email: Yup.string().email('Invalid email format').required('Email is required'),
                defaultCurrencyId: Yup.string().required("Default currency is required"),
                password: 
                    Yup.string().required('New password is required')
                    .min(4, 'Password must be at least 4 characters')
                    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
                    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
                    .matches(/\d/, 'Password must contain at least one digit')
                    .matches(/[\W_]/, 'Password must contain at least one special character'),
                confirmPassword: Yup.string().required('Confirm password')
                    .oneOf([Yup.ref('password')], 'Your passwords do not match.')
            })}
        >
            {({handleSubmit, isValid, dirty, isSubmitting}) => (
                <Form 
                    onSubmit={handleSubmit} 
                    autoComplete="off"
                >     
                    <Stack spacing={2}>
                       
                        <TextInput label="Username" name="userName" fullWidth/>
                    
                        <TextInput label="Email" name="email" fullWidth />
                    
                        <SelectInput label="Default Currency" name="defaultCurrencyId" fullWidth
                            options={currenciesAsOptions}/>
                    
                        <TextInput label="Password" name="password" type="password" fullWidth/>
                    
                        <TextInput label="Confirm Password" name="confirmPassword" type="password" fullWidth/>
                        
                        <Typography color={'error'}>
                            <ErrorMessage 
                                name="error"
                                component="span"
                            />
                        </Typography>
                        <LoadingButton 
                            color="primary" 
                            variant="contained" 
                            fullWidth 
                            type="submit" 
                            disabled={!isValid || !dirty || isSubmitting}
                            loading={isSubmitting}>
                            Sign up
                        </LoadingButton>
                    </Stack>              
                </Form>
            )}
        </Formik>
    )
})
