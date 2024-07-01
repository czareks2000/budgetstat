import { Account } from "../../app/models/Account"
import AccountItem from "./AccountItem";

interface Props {
    accounts: Account[];
    openDeleteDialog: () => void;
}

const AccountsList = ({accounts, openDeleteDialog}: Props) => {
    return (
        <>
        {accounts.map(account => 
            <AccountItem 
                key={account.id} 
                account={account} 
                openDeleteDialog={openDeleteDialog}/>
        )}
        </>
    )
}

export default AccountsList
