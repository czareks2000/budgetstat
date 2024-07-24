import { useState } from 'react';
import { List, Pagination, Paper } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { PlannedTransaction } from '../../../app/models/Transaction';
import PlannedTransactionListItem from './PlannedTransactionListItem';

interface Props {
    transactions: PlannedTransaction[];
}

export default observer(function PlannedTransactionListWithPagination({transactions}: Props) {    
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
    <>
        <Paper>
            <List disablePadding>
                {currentTransactions.map(transaction => 
                    <PlannedTransactionListItem 
                        key={transaction.id}
                        transaction={transaction}
                    />  
                )}
            </List>
        </Paper>
        <Pagination
            count={Math.ceil(transactions.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}/>
    
    </>
  )
})