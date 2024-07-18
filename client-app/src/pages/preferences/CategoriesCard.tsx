import { Box, Card, CardContent, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"

export default observer(function CategoriesCard() {
  return (
    <Card>
        <CardContent>
            <Box>
                <Typography variant="body1">Tu będzie zarządzanie kategoriami</Typography>
            </Box>
        </CardContent>
    </Card>
)
})