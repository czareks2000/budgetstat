import { observer } from "mobx-react-lite";
import { Button, ButtonGroup, Paper } from "@mui/material";
import { Add, Delete, Edit, ListAlt } from "@mui/icons-material";

interface Props {
    selectedPage: string;
    setSeletedPage: (page: string) => void;
    setOpenDeleteDialog: (state: boolean) => void;
}

export default observer(function ButtonGroupMenu({selectedPage, setSeletedPage, setOpenDeleteDialog}: Props) {

  return (
    <>
        <Paper>
            <ButtonGroup variant="outlined" color="info" fullWidth>
            <Button
                startIcon={<ListAlt />}
                variant={selectedPage === 'history' ? 'contained' : 'outlined'}
                onClick={() => setSeletedPage('history')}
            >
                History
            </Button>
            <Button
                startIcon={<Add />}
                variant={selectedPage === 'addValue' ? 'contained' : 'outlined'}
                onClick={() => setSeletedPage('addValue')}
            >
                Add Value
            </Button>
            <Button
                startIcon={<Edit />}
                variant={selectedPage === 'edit' ? 'contained' : 'outlined'}
                onClick={() => setSeletedPage('edit')}
            >
                Edit
            </Button>
            <Button
                startIcon={<Delete />}
                variant={selectedPage === 'delete' ? 'contained' : 'outlined'}
                onClick={() => setOpenDeleteDialog(true)}
            >
                Delete
            </Button>
        </ButtonGroup>
        </Paper>
    </>
  )
})


