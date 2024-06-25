import { Account } from "../../app/models/Account"
import AccountItem from "./AccountItem";

interface Props {
    accounts: Account[];
    toggleEditForm: (state: boolean) => void;
    openDeleteDialog: () => void;
}

const AccountsList = ({accounts, toggleEditForm, openDeleteDialog}: Props) => {
    return (
        <>
        {accounts.map(account => 
            <AccountItem 
                key={account.id} 
                account={account} 
                toggleEditForm={toggleEditForm}
                openDeleteDialog={openDeleteDialog}/>
        )}
        </>
    )
}

export default AccountsList
