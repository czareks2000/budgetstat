import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Fade, IconButton, List, Tooltip, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import CategoryIcon from "../../../components/common/CategoryIcon"
import { Add, Delete, Edit, ExpandMore } from "@mui/icons-material"
import { useState } from "react"
import { CategoryToDelete, MainCategory } from "../../../app/models/Category"
import SubCategoryListItem from "./SubCategoryListItem"
import DeleteCategoryDialog from "../dialogs/DeleteCategoryDialog"
import { useStore } from "../../../app/stores/store"

interface Props {
    mainCategories: MainCategory[];
}

export default observer(function CategoriesTab({mainCategories}: Props) {
    const {categoryStore: {categoryToDelete, setCategoryToDelete}} = useStore();

    const [expanded, setExpanded] = useState(new Array(mainCategories.length).fill(false));

    const handleToggle = (index: number) => {
        const newExpanded = [...expanded];
        newExpanded[index] = !newExpanded[index];
        setExpanded(newExpanded);
    };

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }

    const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, category: MainCategory) => {
        e.preventDefault();
        e.stopPropagation();
        setCategoryToDelete({
            id: category.id, 
            isMain: true, 
            name: category.name});
        handleOpenDeleteDialog();
    }

    const handleEditButtonClick = () => {

    }

    const handleAddButtonClick = () => {

    }

    return (
        <Box>
            <DeleteCategoryDialog 
                key={categoryToDelete?.id} 
                open={openDeleteDialog} setOpen={setOpenDeleteDialog} />
            {mainCategories
                .map((category, index) => 
                <Accordion 
                    key={category.id}
                    expanded={expanded[index]}
                    onChange={() => handleToggle(index)}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`category-${index}`}
                        id={`${category.id}-assets`}
                        >
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                            <Box display="flex" alignItems="center">
                                <CategoryIcon iconId={category.iconId} fontSize="small" sx={{mr: 1}}/>
                                <Typography>{category.name}</Typography>
                            </Box>
                            <Fade in={expanded[index]}>
                                <Box mr={2} display={'flex'}>
                                    <IconButton
                                        sx={{mr: "0px", my: -1}} 
                                        edge={"end"} aria-label="edit"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleEditButtonClick();
                                        }}>
                                        <Edit fontSize="small"/>
                                    </IconButton>
                                    <Tooltip 
                                        title={category.canBeDeleted ? '' : 
                                            'This category or its subcategories are assigned to budgets or transactions.'}
                                        placement="top"
                                        arrow>
                                        <span>
                                        <IconButton 
                                            disabled={!category.canBeDeleted}
                                            sx={{my: -1}} 
                                            edge={"end"} aria-label="delete"
                                            onClick={(e) => handleDeleteButtonClick(e, category)}>
                                            <Delete fontSize="small"/>
                                        </IconButton>
                                        </span>
                                    </Tooltip>
                                </Box>
                            </Fade>
                        </Box>
                    </AccordionSummary>
                    <Divider/>
                    <AccordionDetails sx={{p: 2}}>
                        {category.subCategories.length > 0 ?
                            <List disablePadding>
                            {category.subCategories.map((subcategory) => 
                                <SubCategoryListItem 
                                    key={subcategory.id}
                                    openDeleteDialog={handleOpenDeleteDialog} 
                                    subcategory={subcategory}/>              
                            )}
                            </List>
                        :
                            <Typography>This category has no subcategories</Typography>
                        } 
                    </AccordionDetails>
                    <Divider/>
                    <Box display={'flex'} justifyContent={'center'} py={1} gap={5}>
                        <IconButton 
                            aria-label="add" 
                            onClick={handleAddButtonClick}>
                            <Add/>
                        </IconButton>
                    </Box>  
                </Accordion>
            )}
        </Box>
    )
})


