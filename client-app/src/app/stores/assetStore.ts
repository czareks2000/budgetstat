import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Asset, AssetCategory, AssetCreateUpdateValues, AssetValue, AssetValueCreateValues } from "../models/Asset";
import agent from "../api/agent";
import { Option } from "../models/Option";
import { store } from "./store";
import { router } from "../router/Routes";
import dayjs from "dayjs";
import { ValueOverTime } from "../models/Stats";
import { NetWorthChartPeriod } from "../models/enums/periods/NetWorthChartPeriod";

export default class AssetStore {
    assetRegistry = new Map<number, Asset>();
    assetsLoaded = false;

    selectedAsset: Asset | undefined = undefined; 
    selectedAssetValues: AssetValue[] = [];
    assetValuesLoaded = false;

    assetValueOverTime: ValueOverTime | undefined = undefined;
    chartPeriod: NetWorthChartPeriod = NetWorthChartPeriod.Year;
    assetValueOverTimeLoaded = false;

    assetCategories: AssetCategory[] = [];
    categoriesLoaded = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.chartPeriod, 
            () => {
                this.loadAssetValueOverTime(this.selectedAsset?.id);
            }
        )
    }

    clearStore = () => {
        this.assetRegistry.clear();
        this.assetsLoaded = false;
        this.selectedAsset = undefined;
        this.selectedAssetValues = [];
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

    validateAssetCategoryId = (categoryId: string | null) => {
        if (categoryId)
            return this.assetCategories.find(c => c.id === Number(categoryId))?.id || null;

        return null;
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
                this.assetCategories = categories.sort((a,b) => a.id - b.id);
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
                this.updateDataInOtherStores();
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
                this.loadAssetValues(assetId);
                this.loadAssetValueOverTime(assetId);
                this.updateDataInOtherStores();
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
                this.updateDataInOtherStores();
            })
        } catch (error) {
            console.log(error);
        }
    }

    loadAssetValueOverTime = async (assetId: number | undefined) => {
        if(!assetId)
            return;

        this.assetValueOverTimeLoaded = false;
        this.assetValueOverTime = undefined;
        try {
            const response = await agent.Stats.assetValueOverTime(assetId, this.chartPeriod);
            runInAction(() => {
                response.startDate = dayjs(response.startDate).toDate(); 
                response.endDate = dayjs(response.endDate).toDate(); 
                if (!this.assetValueOverTimeLoaded)
                    this.assetValueOverTime = response;
                this.assetValueOverTimeLoaded = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    setChartPeriod = (period: NetWorthChartPeriod) => {
        this.chartPeriod = period;
    }

    deselectAsset = () => {
        this.selectedAsset = undefined;
    }

    loadAssetValues = async (assetId: number) => {
        this.assetValuesLoaded = false;
        try {
            let values = await agent.Assets.getAssetValues(assetId);
            runInAction(() => {
                this.selectedAssetValues = values;
                this.assetValuesLoaded = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    createAssetValue = async (assetId: number, newAssetValue: AssetValueCreateValues) => {
        try {
            newAssetValue.date = dayjs(newAssetValue.date).startOf('day').add(12, 'hours');

            let asset = await agent.Assets.createAssetValue(assetId, newAssetValue);
            runInAction(() => {
                this.setAsset(asset);
                this.loadAssetValues(assetId);
                this.loadAssetValueOverTime(assetId);
                this.updateDataInOtherStores();
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteAssetValue = async (assetValueId: number) => {
        try {
            this.selectedAssetValues = this.selectedAssetValues
                .filter(av => av.id !== assetValueId);

            let asset = await agent.Assets.deleteAssetValue(assetValueId);
            runInAction(() => {
                this.setAsset(asset);
                this.loadAssetValueOverTime(asset.id);
                this.updateDataInOtherStores();
            })
        } catch (error) {
            console.log(error);
        }
    }

    private updateDataInOtherStores = () => {
        store.statsStore.updateNetWorthStats(false, true);
        store.statsStore.loadNetWorthValueOverTime();
    }

}