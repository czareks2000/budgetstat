import { Button, Typography } from '@mui/material'
import CenteredContainer from './CenteredContainer'
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function Unauthorised() {
  const {userStore} = useStore();
  
  return (
    <CenteredContainer content={
        <>
            <Typography variant="h1" color={'gray'}>401</Typography>
            <Typography variant="h5" my={3} >You are not authorized to view this page</Typography>
            <Button variant="contained" onClick={() => userStore.logout()}>Sign in</Button>
        </>
    }/>
  )
})
