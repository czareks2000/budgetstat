import { Box, Button, Paper, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { router } from "../../../app/router/Routes"

export default observer(function CategoriesCard() {

    const handleButtonClick = () => {
        router.navigate('/preferences/categories')
    }

    return (
        <Paper>
            <Box p={2}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Categories management</Typography>
                    <Button
                        variant="contained"
                        onClick={handleButtonClick}
                    >
                        Manage
                    </Button>
                </Box>
            </Box>
        </Paper>
)
})