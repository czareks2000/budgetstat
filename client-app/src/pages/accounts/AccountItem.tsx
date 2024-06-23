import { Box, Card, CardActions, CardContent, Divider, Grid, IconButton, Switch, Typography } from "@mui/material";
import { Account } from "../../app/models/Account";
import { Delete, Edit } from "@mui/icons-material";
import { AccountStatus } from "../../app/models/enums/AccountStatus";

interface Props {
    account: Account;
}

const AccountItem = ({account}: Props) => {

    const isVisible = () => {
        return account.status === AccountStatus.Visible;
    }

    return (
        <Card key={account.id} >
            <CardContent>
                <Grid container justifyContent="flex-end">
                    <Grid item xs>
                        <Typography variant="h5">
                            {account.name} {isVisible() ? '' : '(hidden)'}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {account.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={'auto'} >
                        <Typography variant="h4" color={'primary'}>
                            {account.balance} zł
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider/>
            <CardActions >
                <Grid container justifyContent="space-between">
                    <Switch checked={isVisible()} />
                    <Box>
                        <IconButton aria-label="edit">
                            <Edit />
                        </IconButton>
                        <IconButton aria-label="delete">
                            <Delete />
                        </IconButton>
                    </Box>
                </Grid>
            </CardActions>
        </Card>
    )
}

export default AccountItem
