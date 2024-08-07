import { Box, Button, Paper, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { router } from "../../../app/router/Routes"

export default observer(function UserSettingsCard() {
    const handleButtonClick = () => {
        router.navigate('/preferences/change-password');
    }

  return (
    <Paper>
            <Box p={2}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Change password</Typography>
                    <Button
                        variant="contained"
                        onClick={handleButtonClick}
                    >
                        Change
                    </Button>
                </Box>
            </Box>
        </Paper>
)
})