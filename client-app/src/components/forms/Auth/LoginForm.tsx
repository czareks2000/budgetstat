import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { ErrorMessage, Form, Formik } from "formik";
import { Paper, Stack, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import TextInput from "../../formInputs/TextInput";

export default observer(function LoginForm() {
    const {userStore} = useStore();
    
    return (
        <Formik
            initialValues={{email: '', password: '', error: null}}
            onSubmit={(values, {setErrors}) => 
                userStore.login(values).catch(() =>
                    setErrors({error: 'Invalid email or password'}))
            }   
        >
            {({handleSubmit, isSubmitting}) => (
                <Form 
                    onSubmit={handleSubmit} 
                    autoComplete="off"
                >     
                    <Stack spacing={2} width={400}>
                        <Paper>
                            <TextInput label="Email" name="email" fullWidth />
                        </Paper>
                        <Paper>
                            <TextInput label="Password" name="password" type="password" fullWidth/>
                        </Paper>
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
                            disabled={isSubmitting}
                            loading={isSubmitting}>
                            Sign in
                        </LoadingButton>
                    </Stack>              
                </Form>
            )}
        </Formik>
    )
})
