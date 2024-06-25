import { Account } from "../../app/models/Account"
import AccountItem from "./AccountItem";

interface Props {
    accounts: Account[];
    toggleEditForm: (state: boolean) => void;
}

const AccountsList = ({accounts, toggleEditForm}: Props) => {
    return (
        <>
        {accounts.map(account => 
            <AccountItem key={account.id} account={account} toggleEditForm={toggleEditForm}/>
        )}
        </>
    )
}

export default AccountsList
