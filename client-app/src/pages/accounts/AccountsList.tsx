import { Account } from "../../app/models/Account"
import AccountItem from "./AccountItem";

interface Props {
    accounts: Account[];
    openDeleteDialog: () => void;
}

const AccountsList = ({accounts, openDeleteDialog}: Props) => {
    
    const sortedAccounts = accounts.sort((a,b) => b.status - a.status);

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
