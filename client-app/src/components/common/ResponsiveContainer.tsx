import { Grid2 } from "@mui/material"

interface Props {
    content: React.ReactNode;
}

const ResponsiveContainer = ({content}: Props) => {
  return (
    <Grid2 container>
        <Grid2 size="grow"/>
        <Grid2 size={{xs: 12, lg: 8, xl: 6}}>
            {content}
        </Grid2>
        <Grid2 size="grow"/>
    </Grid2>
  )
}

export default ResponsiveContainer
