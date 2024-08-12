import { Account } from "../../app/models/Account"
import { AccountStatus } from "../../app/models/enums/AccountStatus";
import AccountItem from "./AccountItem";

interface Props {
    accounts: Account[];
    openDeleteDialog: () => void;
}

const AccountsList = ({accounts, openDeleteDialog}: Props) => {
    
    const visibleAccounts = accounts
        .filter(a => a.status === AccountStatus.Visible)
        .sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());

    const hiddenAccounts = accounts
        .filter(a => a.status === AccountStatus.Hidden)
        .sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());

    const sortedAccounts = [...visibleAccounts, ...hiddenAccounts];

    return (
        <>
        {sortedAccounts.map(account => 
            <AccountItem 
                key={account.id} 
                account={account} 
                openDeleteDialog={openDeleteDialog}/>
        )}
        </>
    )
}

export default AccountsList
