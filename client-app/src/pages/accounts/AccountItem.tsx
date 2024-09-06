import { Card, CardContent, Divider, Grid2, IconButton, Switch, Tooltip, Typography } from "@mui/material";
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
            <Grid2 container>
                <Grid2 size={"grow"}>
                    <Typography variant="h5">
                        {account.name} {isVisible() ? '' : '(hidden)'}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {account.description}
                    </Typography>
                </Grid2>
                <Grid2 size={'auto'}>
                    <Typography variant="h5" color={'primary'}>
                        {formatAmount(account.balance)} {account.currency.symbol}
                    </Typography>
                </Grid2>
            </Grid2>
        </CardContent>
        <Divider/>
        <Grid2 container p={1}>
            <Grid2 size={"grow"}>
                <Tooltip 
                        title={isVisible() ? "Hide" : "Make Visible"}
                        placement="right"
                        arrow
                        enterDelay={500}
                        leaveDelay={200}>
                    <Switch 
                        checked={isVisible()} 
                        onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSwitchButtonClick();
                        }}/>
                </Tooltip>
            </Grid2>
            <Grid2 size={"auto"}>
                <IconButton 
                    aria-label="edit"
                    onClick={(e: any) => {
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
                        onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteButtonClick();
                        }}>
                            <Delete />
                    </IconButton>
                    </span>
                </Tooltip>
            </Grid2>
        </Grid2>
    </Card>
    )
})
