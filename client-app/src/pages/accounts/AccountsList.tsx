import { Account } from "../../app/models/Account"
import AccountItem from "./AccountItem";

interface Props {
    accounts: Account[];
}

const AccountsList = ({accounts}: Props) => {
    return (
        <>
        {accounts.map(account => 
            <AccountItem account={account}/>
        )}
        </>
    )
}

export default AccountsList
