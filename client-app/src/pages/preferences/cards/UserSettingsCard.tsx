import { Box, Card, CardContent, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"

export default observer(function UserSettingsCard() {
  return (
    <Card>
        <CardContent>
            <Box>
                <Typography variant="body1">Tu będzie formularz zmiany hasła</Typography>
            </Box>
        </CardContent>
    </Card>
)
})