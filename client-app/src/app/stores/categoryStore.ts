import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Category, CategoryOption, MainCategory } from "../models/Category";
import { TransactionType } from "../models/enums/TransactionType";
import { Option } from "../models/Option";

export default class CategoryStore {
    mainCategories: MainCategory[] = [];
    categoriesLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }
    
    clearStore = () => {
        this.mainCategories = [];
        this.categoriesLoaded = false;
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
                value: category.id
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
                value: category.id
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
}