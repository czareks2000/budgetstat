import { useState } from 'react';
import { Pagination, Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Loan } from '../../../app/models/Loan';
import LoanItemCompact from './LoanItemCompact';

interface Props {
    loans: Loan[];
}

export default observer(function LoanListWithPagination({loans}: Props) {    
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = loans.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
    <>
        <Stack spacing={2}>
            {currentItems.map((loan) => 
                <LoanItemCompact key={loan.id} loan={loan} detailsAction/>
            )}
            <Pagination
                count={Math.ceil(loans.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}/>
        </Stack>
    </>
  )
})