import { Typography } from '@mui/material'
import CenteredContainer from './CenteredContainer'

export default function Unauthorised() {
  return (
    <CenteredContainer content={
        <>
            <Typography variant="h1" color={'gray'}>401</Typography>
            <Typography variant="h5" mt={3} >You are not authorized to view this page</Typography>
        </>
    }/>
  )
}
