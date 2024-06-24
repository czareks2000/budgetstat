import { Box, Card, CardActions, CardContent, Divider, Grid, IconButton, Switch, Typography } from "@mui/material";
import { Account } from "../../app/models/Account";
import { Delete, Edit } from "@mui/icons-material";
import { AccountStatus } from "../../app/models/enums/AccountStatus";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { formatNumber } from "../../app/utils/FormatNumber";

interface Props {
    account: Account;
}

export default observer(function AccountItem({account}: Props) {
    const {accountStore: {changeStatus}} = useStore();

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
                            {formatNumber(account.balance)} {account.currency.symbol}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider/>
            <CardActions >
                <Grid container justifyContent="space-between">
                    <Switch 
                        checked={isVisible()} 
                        onClick={() => changeStatus(account.id, account.status)}/>
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
})
