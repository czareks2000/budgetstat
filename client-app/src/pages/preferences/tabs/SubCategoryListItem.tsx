import { observer } from "mobx-react-lite"
import { Category } from "../../../app/models/Category";
import { Box, IconButton, ListItem, ListItemText, Tooltip } from "@mui/material";
import CategoryIcon from "../../../components/common/CategoryIcon";
import { Delete, Edit } from "@mui/icons-material";

interface Props {
    subcategory: Category;
}

export default observer(function SubCategoryListItem({subcategory}: Props) {

    const handleDeleteButtonClick = () => {
    }

    const handleEditButtonClick = () => {

    }

    return (
    <ListItem 
        secondaryAction={
            <Box>
                <IconButton
                    sx={{mr: "0px" }} 
                    edge={"end"} aria-label="edit"
                    onClick={handleEditButtonClick}>
                    <Edit fontSize="small"/>
                </IconButton>
                <Tooltip 
                    title={subcategory.canBeDeleted ? '' : 
                        'Category is assigned to budgets or transactions.'}
                    placement="top"
                    arrow>
                    <span>
                    <IconButton 
                        disabled={!subcategory.canBeDeleted}
                        edge={"end"} aria-label="delete"
                        onClick={handleDeleteButtonClick}>
                        <Delete fontSize="small"/>
                    </IconButton>
                    </span>
                </Tooltip>
            </Box>
        }>
        <ListItemText 
            primary={
                <Box component={"span"} display={'flex'}>
                    <CategoryIcon
                        iconId={subcategory.iconId} 
                        fontSize="small" 
                        sx={{mt: '1px', mr: 1}}/>
                    <Box component={"span"} mr={1}>
                        {subcategory.name}
                    </Box>
                </Box>
            }
        />
    </ListItem>  
    )
})