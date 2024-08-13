import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Fade, IconButton, List, Tooltip, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import CategoryIcon from "../../../components/common/CategoryIcon"
import { Add, Delete, Edit, ExpandMore } from "@mui/icons-material"
import { useState } from "react"
import { MainCategory } from "../../../app/models/Category"
import SubCategoryListItem from "./SubCategoryListItem"
import DeleteCategoryDialog from "../dialogs/DeleteCategoryDialog"
import { useStore } from "../../../app/stores/store"
import { router } from "../../../app/router/Routes"
import { CategoryType } from "../../../app/models/enums/CategoryType"
import { useSearchParams } from "react-router-dom"

interface Props {
    mainCategories: MainCategory[];
}

export default observer(function CategoriesTab({mainCategories}: Props) {
    const {categoryStore: {selectedCategory, setSelectedCategory}} = useStore();

    const [searchParams] = useSearchParams();

    const initialExpanded = new Array(mainCategories.length).fill(false);
    const initialId = parseInt(searchParams.get('id') || '-1');
    if (initialId) {
        const index = mainCategories.findIndex(cat => cat.id === initialId);
        if (index !== -1) {
            initialExpanded[index] = true;
        }
    }

    const [expanded, setExpanded] = useState(initialExpanded);

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
        setSelectedCategory({
            id: category.id, 
            isMain: true, 
            name: category.name});
        handleOpenDeleteDialog();
    }

    const handleEditButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, categoryId: number) => {
        e.preventDefault();
        e.stopPropagation();
        router.navigate(`/preferences/categories/${categoryId}/edit`);
    }

    const handleAddButtonClick = (category: MainCategory) => {
        const transactionType = category.type;
        const categoryType = CategoryType.Sub;
        const mainCategoryId = category.id;

        const params = `?transactionType=${transactionType}&categoryType=${categoryType}&mainCategoryId=${mainCategoryId}`

        router.navigate(`/preferences/categories/create${params}`)
    }

    return (
        <Box>
            <DeleteCategoryDialog 
                key={selectedCategory?.id} 
                open={openDeleteDialog} setOpen={setOpenDeleteDialog} />
            {mainCategories
                .map((category, index) => 
                <Accordion 
                    key={category.id}
                    expanded={expanded[index]}
                    slotProps={{ transition: { unmountOnExit: true } }}
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
                            <Fade in={expanded[index]} appear={false}>
                                <Box mr={2} display={'flex'}>
                                    <IconButton
                                        sx={{mr: "0px", my: -1}} 
                                        edge={"end"} aria-label="edit"
                                        onClick={(e) => handleEditButtonClick(e, category.id)}>
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
                            onClick={() => handleAddButtonClick(category)}>
                            <Add/>
                        </IconButton>
                    </Box>  
                </Accordion>
            )}
        </Box>
    )
})


