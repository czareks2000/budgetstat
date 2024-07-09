import { useState } from 'react';
import { GroupedLoan } from '../../../app/models/Loan'
import CounterpartySummaryItem from './CounterpartySummaryItem';
import { Button, Grid, Pagination } from '@mui/material';

interface Props {
    summaries: GroupedLoan[];
    onClick: () => void;
    buttonText: string;
}

const CounterpartySummaryWithPagination = ({summaries, onClick, buttonText}: Props) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Function to handle page change
    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    // Calculate the index of the current summary to display
    const indexOfCurrentSummary = currentPage - 1; // Adjust for zero-based index

    return (
    <>
        <CounterpartySummaryItem
            key={`${summaries[indexOfCurrentSummary].counterpartyId}-${summaries[indexOfCurrentSummary].currencyId}`}
            archiveLink
            summary={summaries[indexOfCurrentSummary]}
        />
        <Grid container justifyContent="flex-end">
            <Grid item xs>
                <Pagination
                    count={summaries.length}
                    page={currentPage}
                    onChange={handlePageChange}/>
            </Grid>
            <Grid item xs={'auto'}>
                <Button variant='contained' size='small' color='info'
                    onClick={onClick}>
                    {buttonText}
                </Button>
            </Grid>
        </Grid>
        
    </>
  )
}

export default CounterpartySummaryWithPagination
