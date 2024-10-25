import { observer } from "mobx-react-lite";
import * as Yup from 'yup';
import { Form, Formik } from "formik";
import { useStore } from "../../../app/stores/store";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Snackbar, Stack, Typography } from "@mui/material";
import { router } from "../../../app/router/Routes";
import { useState } from "react";


export default observer(function ChangePasswordForm() {
    const {userStore} = useStore();

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway')
          return;
    
        setOpen(false);
    };

    const handleCancel = () => {
        router.navigate('/preferences');
    }

    return (
    <>
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}>
            <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
        <Formik
            initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                error: null
            }}
            onSubmit={(values, {setErrors, resetForm, setSubmitting}) => {
                userStore.changePassword(values).then(() => {
                    resetForm();
                    setMessage('Password changed');
                    setOpen(true);
                }).catch(error =>{
                    setErrors({currentPassword: error as string});
                    setSubmitting(false);
                });
            } 
            }
            validationSchema={Yup.object({
                currentPassword: Yup.string().required('Current password is required'),
                newPassword: 
                    Yup.string().required('New password is required')
                    .min(4, 'Password must be at least 4 characters')
                    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
                    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
                    .matches(/\d/, 'Password must contain at least one digit')
                    .matches(/[\W_]/, 'Password must contain at least one special character'),
                confirmNewPassword: Yup.string().required('Confirm password')
                    .oneOf([Yup.ref('newPassword')], 'Your passwords do not match.')
            })}
        >
        {({handleSubmit, isSubmitting, isValid, dirty, errors}) => ( 
            <Form
                onSubmit={handleSubmit} 
                autoComplete="off"
            >   
                <Stack spacing={2}>
                    
                    <TextInput 
                        label="Current password"
                        name="currentPassword" type="password" />
                    <TextInput 
                        label="New password"
                        name="newPassword" type="password" />
                    <TextInput 
                        label="Confirm password"
                        name="confirmNewPassword" type="password"/>

                    {errors.error &&
                    <Typography color={'error'}>
                        {errors.error}
                    </Typography>}
                     
                    <Stack direction={'row'} spacing={2}>
                        <Button 
                            color="error"
                            variant="contained"
                            fullWidth
                            onClick={handleCancel}>
                            Cancel
                        </Button>
                        <LoadingButton 
                            color="primary" 
                            variant="contained" 
                            fullWidth 
                            type="submit" 
                            disabled={!isValid || !dirty || isSubmitting}
                            loading={isSubmitting}>
                            Submit
                        </LoadingButton>
                    </Stack>          
                </Stack> 
            </Form>
        )}    
        </Formik>
    </>
    )
})