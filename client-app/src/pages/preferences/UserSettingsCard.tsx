import { Box, Card, CardContent } from "@mui/material"
import { observer } from "mobx-react-lite"

export default observer(function UserSettingsCard() {
  return (
    <Card>
        <CardContent>
            <Box p={2}></Box>
        </CardContent>
    </Card>
)
})