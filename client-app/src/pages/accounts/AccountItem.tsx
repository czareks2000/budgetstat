import { Box, Card, CardActions, CardContent, Divider, Grid, IconButton, Switch, Tooltip, Typography } from "@mui/material";
import { Account } from "../../app/models/Account";
import { Delete, Edit } from "@mui/icons-material";
import { AccountStatus } from "../../app/models/enums/AccountStatus";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";

import { router } from "../../app/router/Routes";
import { formatAmount } from "../../app/utils/FormatAmount";

interface Props {
    account: Account;
    openDeleteDialog: () => void;
}

export default observer(function AccountItem({account, openDeleteDialog}: Props) {
    const {accountStore: {changeStatus, selectAccount}} = useStore();

    const isVisible = () => {
        return account.status === AccountStatus.Visible;
    }

    const handleDeleteButtonClick = () => {
        selectAccount(account.id);
        openDeleteDialog();
    }

    const handleEditButtonClick = () => {
        selectAccount(account.id);
        router.navigate(`/accounts/${account.id}/edit`)
    }

    const handleSwitchButtonClick = () => {
        changeStatus(account.id, account.status);
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
                    <Typography variant="h5" color={'primary'}>
                        {formatAmount(account.balance)} {account.currency.symbol}
                    </Typography>
                </Grid>
            </Grid>
        </CardContent>
        <Divider/>
        <CardActions >
            <Grid container justifyContent="space-between">
                <Tooltip 
                        title={isVisible() ? "Hide" : "Make Visible"}
                        placement="right"
                        arrow
                        enterDelay={500}
                        leaveDelay={200}>
                    <Switch 
                        checked={isVisible()} 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSwitchButtonClick();
                        }}/>
                </Tooltip>
                <Box>
                    <IconButton 
                        aria-label="edit"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditButtonClick();
                        }}>
                        <Edit />
                    </IconButton>
                    <Tooltip 
                        title={account.canBeDeleted ? '' : 
                            'The account has loans in progress.'}
                        placement="top"
                        arrow>
                        <span>
                        <IconButton 
                            disabled={!account.canBeDeleted}
                            aria-label="delete"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteButtonClick();
                            }}>
                                <Delete />
                        </IconButton>
                        </span>
                    </Tooltip>
                    
                </Box>
            </Grid>
        </CardActions>
    </Card>
    )
})
