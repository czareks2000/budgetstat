import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Category, CategoryOption, MainCategory } from "../models/Category";
import { TransactionType } from "../models/enums/TransactionType";

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

    get expenseSubCategories() {
        const expenseSubCategories: CategoryOption[] = [];
        
        // Iterate over main categories
        this.mainCategories
            .filter(category => category.type === TransactionType.Expense)
            .forEach(mainCategory => {
                mainCategory.subCategories
                    .filter(subCategory => subCategory.type === TransactionType.Expense)
                    .forEach(subCategory => {
                        expenseSubCategories.push({
                            id: subCategory.id,
                            name: subCategory.name,
                            icon: subCategory.icon,
                            type: subCategory.type,
                            mainCategoryName: mainCategory.name,
                            mainCategoryId: mainCategory.id
                        });
                });
        });

        return expenseSubCategories;
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
                    icon: mainCategory.icon,
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
                            icon: subCategory.icon,
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