import { makeAutoObservable, runInAction } from "mobx";
import { Asset, AssetCategory, AssetCreateUpdateValues } from "../models/Asset";
import agent from "../api/agent";
import { Option } from "../models/Option";
import { store } from "./store";
import { router } from "../router/Routes";

export default class AssetStore {
    assetRegistry = new Map<number, Asset>();
    selectedAsset: Asset | undefined = undefined; 
    assetsLoaded = false;

    assetCategories: AssetCategory[] = [];
    categoriesLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    clearStore = () => {
        this.assetRegistry.clear();
        this.assetsLoaded = false;
        this.selectedAsset = undefined;
        this.assetCategories = [];
    }

    private setAsset = (asset: Asset) => {
        this.assetRegistry.set(asset.id, asset);
    }

    get assets() {
        return Array.from(this.assetRegistry.values());
    }

    get assetCategoriesAsOptions(): Option[] {
        return this.assetCategories.map(category =>({
            value: category.id,
            text: `${category.name}`,
            iconId: category.iconId
        }));
    }

    getAssetCategoryIconId = (assetCategoryId: number) => {
        return this.assetCategories.find(ac => ac.id === assetCategoryId)?.iconId as number;
    }

    selectAsset = (assetId: number) => {
        this.selectedAsset = this.assetRegistry.get(assetId);
        if (!this.selectedAsset)
            router.navigate('/not-found');
    }
    
    deselectAccount = () => {
        this.selectedAsset = undefined;
    }

    loadAssetCategories = async () => {
        try {
            const categories = await agent.Assets.getAssetCategories();
            runInAction(() => {
                this.assetCategories = categories;
                this.categoriesLoaded = true;
            })   
        } catch (error) {
            console.log(error);
        }
    }

    loadAssets = async () => {
        try {
            const assets = await agent.Assets.list();
            runInAction(() => {
                assets.forEach((asset) => this.setAsset(asset));
                this.assetsLoaded = true;
            })   
        } catch (error) {
            console.log(error);
        }
    }

    createAsset = async (asset: AssetCreateUpdateValues) => {
        try {
            const newAsset = await agent.Assets.create(asset);
            runInAction(() => {
                this.setAsset(newAsset);
                store.statsStore.updateNetWorthStats(false, true);
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateAsset = async (assetId: number, asset: AssetCreateUpdateValues) => {
        try {
            const updatedAsset = await agent.Assets.update(assetId, asset);
            runInAction(() => {
                this.setAsset(updatedAsset);
                store.statsStore.updateNetWorthStats(false, true);
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteAsset = async (assetId: number) => {
        try {
            await agent.Assets.delete(assetId);
            runInAction(() => {
                this.assetRegistry.delete(assetId);
                store.statsStore.updateNetWorthStats(false, true);
            })
        } catch (error) {
            console.log(error);
        }
    }

}