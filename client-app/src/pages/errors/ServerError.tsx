import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";

export default observer(function ServerError() {
    const {commonStore} = useStore();
    return (
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Server Error</Divider>
                {commonStore.serverError?.message && 
                    <Paper>
                        <Box p={2}>
                            <Typography variant='h6' color="error">{commonStore.serverError.message}</Typography>
                        </Box>
                    </Paper>
                }
               
                {commonStore.serverError?.details &&
                    <Paper>
                        <Box p={2}>
                            <Typography variant='body1'>Stack trace: </Typography>
                            <Box
                                component="pre"
                                sx={{
                                    whiteSpace: 'pre-wrap', 
                                    overflowWrap: 'break-word', 
                                    maxWidth: '100%',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <code>{commonStore.serverError.details}</code>
                            </Box>
                        </Box>
                    </Paper>
                }
            </Stack>
        }/>
    )
})
