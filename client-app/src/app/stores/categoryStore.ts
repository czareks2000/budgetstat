import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Category, CategoryCreateFormValues, CategoryOption, CategoryToDelete, MainCategory } from "../models/Category";
import { TransactionType } from "../models/enums/TransactionType";
import { Option } from "../models/Option";
import { CategoryType } from "../models/enums/CategoryType";

export default class CategoryStore {
    mainCategories: MainCategory[] = [];
    categoriesLoaded = false;

    categoryToDelete: CategoryToDelete | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
    }
    
    clearStore = () => {
        this.mainCategories = [];
        this.categoriesLoaded = false;

        this.categoryToDelete = undefined;
    }

    setCategoryToDelete = (categoryToDelete: CategoryToDelete) => {
        this.categoryToDelete = categoryToDelete;
    }

    unsetCategoryToDelete = () => {
        this.categoryToDelete = undefined;
    }

    get mainExpenseCategories() {
       return this.mainCategories.filter(c => c.type === TransactionType.Expense);
    }

    get mainIncomeCategories() {
        return this.mainCategories.filter(c => c.type === TransactionType.Income);
     }

    get mainExpenseCategoriesAsOptions() {
        let options: Option[] = []
        this.mainCategories
        .filter(c => c.type === TransactionType.Expense)
        .forEach(category => {
            options.push({
                text: category.name,
                value: category.id,
                iconId: category.iconId
            })
        })
        return options;
    }

    get mainIncomeCategoriesAsOptions() {
        let options: Option[] = []
        this.mainCategories
        .filter(c => c.type === TransactionType.Income)
        .forEach(category => {
            options.push({
                text: category.name,
                value: category.id,
                iconId: category.iconId
            })
        })
        return options;
    }

    getCategoriesAsOptions = (type: TransactionType, includeMainCategories: boolean = false) => {
        const expenseSubCategories: CategoryOption[] = [];
        
        // Iterate over main categories
        this.mainCategories
            .filter(category => category.type === type)
            .forEach(mainCategory => {
                
                if (includeMainCategories)
                {
                    expenseSubCategories.push({
                        id: mainCategory.id,
                        name: mainCategory.name,
                        iconId: mainCategory.iconId,
                        type: mainCategory.type,
                        mainCategoryName: mainCategory.name,
                        mainCategoryId: mainCategory.id
                    });
                }
                
                mainCategory.subCategories
                    .forEach(subCategory => {
                        expenseSubCategories.push({
                            id: subCategory.id,
                            name: subCategory.name,
                            iconId: subCategory.iconId,
                            type: subCategory.type,
                            mainCategoryName: mainCategory.name,
                            mainCategoryId: mainCategory.id
                        });
                });
        });



        return expenseSubCategories;
    }

    getCategoriesByIds = (categoryIds: number[]): Category[] => {
        let matchedCategories: Category[] = [];
        
        this.mainCategories.forEach(mainCategory => {
            if (categoryIds.includes(mainCategory.id)) {
                matchedCategories.push(mainCategory);
            }

            mainCategory.subCategories.forEach(subCategory => {
                if (categoryIds.includes(subCategory.id)) {
                    matchedCategories.push(subCategory);
                }
            });
        });
        
        return matchedCategories;
    }

    convertToCategoryOptions = (categories: Category[]): CategoryOption[] => {
        const categoryOptions: CategoryOption[] = [];
    
        categories.forEach(category => {
            // Check if the category is a main category
            const mainCategory = this.mainCategories.find(mainCat => mainCat.id === category.id);
    
            if (mainCategory) {
                // If it's a main category, use its own data
                categoryOptions.push({
                    id: mainCategory.id,
                    name: mainCategory.name,
                    iconId: mainCategory.iconId,
                    type: mainCategory.type,
                    mainCategoryName: mainCategory.name,
                    mainCategoryId: mainCategory.id
                });
            } else {
                // Otherwise, check if it's a subcategory
                this.mainCategories.forEach(mainCategory => {
                    const subCategory = mainCategory.subCategories.find(subCat => subCat.id === category.id);
                    if (subCategory) {
                        categoryOptions.push({
                            id: subCategory.id,
                            name: subCategory.name,
                            iconId: subCategory.iconId,
                            type: subCategory.type,
                            mainCategoryName: mainCategory.name,
                            mainCategoryId: mainCategory.id
                        });
                    }
                });
            }
        });
    
        return categoryOptions;
    }

    loadCategories = async () => {
        try {
            const categories = await agent.Categories.all();
            runInAction(() => {
                this.mainCategories = categories;
                this.categoriesLoaded = true;
            })      
        } catch (error) {
            console.log(error);
        } 
    }

    deleteCategory = async (categoryId: number, isMain: boolean) => {
        try {
            if (isMain)
                this.mainCategories = this.mainCategories.filter(c => c.id !== categoryId);
            else {
                this.mainCategories = this.mainCategories.map(mainCategory => {
                    if (mainCategory.subCategories.some(subCategory => subCategory.id === categoryId)) {
                        return {
                            ...mainCategory,
                            subCategories: mainCategory.subCategories.filter(subCategory => subCategory.id !== categoryId)
                        };
                    }
                    return mainCategory;
                });
            }

            await agent.Categories.delete(categoryId);
        } catch (error) {
            console.log(error);
        }
    }

    createCategory = async (category: CategoryCreateFormValues) => {
        try {
            const mainCategory = await agent.Categories.create({
                name: category.name,
                iconId: Number(category.iconId),
                type: category.transactionType,
                isMain: category.categoryType === CategoryType.Main,
                mainCategoryId: category.transactionType === TransactionType.Income 
                    ? Number(category.mainIncomeCategoryId)
                    : Number(category.mainExpenseCategoryId)
            })

            runInAction(() => {
                if (category.categoryType === CategoryType.Main)
                    this.mainCategories.push(mainCategory);
                else
                {
                    this.mainCategories = this.mainCategories.map(current => {
                        if (current.id === mainCategory.id)
                            return mainCategory;
    
                        return current;
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}