import { Box, Divider, Typography } from "@mui/material"

interface Props {
    text: string;
}

const PageHeader = ({text}: Props) => {
  return (
    <Box>
        <Typography variant="h4" gutterBottom>
            {text}
        </Typography>
        <Box mb={4}>
            <Divider />
        </Box>
    </Box>
  )
}

export default PageHeader
