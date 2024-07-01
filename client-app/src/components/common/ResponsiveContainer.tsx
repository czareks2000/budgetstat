import { Grid } from "@mui/material"

interface Props {
    content: React.ReactNode;
}

const ResponsiveContainer = ({content}: Props) => {
  return (
    <Grid container>
        <Grid item xs lg xl/>
        <Grid item xs={12} lg={8} xl={6}>
            {content}
        </Grid>
        <Grid item xs lg xl/>
    </Grid>
  )
}

export default ResponsiveContainer
