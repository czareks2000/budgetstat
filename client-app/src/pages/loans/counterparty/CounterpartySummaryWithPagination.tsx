import { useState } from 'react';
import { GroupedLoan } from '../../../app/models/Loan'
import CounterpartySummaryItem from './CounterpartySummaryItem';
import { Button, Grid2, Pagination } from '@mui/material';
import { observer } from 'mobx-react-lite';

interface Props {
    summaries: GroupedLoan[];
    onClick: () => void;
    buttonText: string;
    currencyId: string | null;
    setSearchParams: (id: number) => void;
}

export default observer(function CounterpartySummaryWithPagination({summaries, onClick, buttonText, currencyId, setSearchParams}: Props) {
    const calculatePageNumber = () => {
        const index = summaries.findIndex(summary => summary.currencyId === Number(currencyId));
        return index === -1 ? 1 : index + 1;
    }
    
    const [currentPage, setCurrentPage] = useState(calculatePageNumber());

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        const summary = summaries[page - 1];
        setSearchParams(summary.currencyId);
    };

    const indexOfCurrentSummary = currentPage - 1; 

    return (
    <>
        <CounterpartySummaryItem
            summary={summaries[indexOfCurrentSummary < summaries.length ? indexOfCurrentSummary : summaries.length - 1]}
        />
        <Grid2 container justifyContent="flex-end">
            <Grid2 size={"grow"}>
                <Pagination
                    count={summaries.length}
                    page={currentPage}
                    onChange={handlePageChange}/>
            </Grid2>
            <Grid2 size={'auto'}>
                <Button variant='contained' size='small' color='info'
                    onClick={onClick}>
                    {buttonText}
                </Button>
            </Grid2>
        </Grid2>
        
    </>
  )
})