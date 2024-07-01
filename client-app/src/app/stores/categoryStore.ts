import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { CategoryOption, MainCategory } from "../models/Category";

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
            .filter(category => category.type === 2)
            .forEach(mainCategory => {
                mainCategory.subCategories
                    .filter(subCategory => subCategory.type === 2)
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