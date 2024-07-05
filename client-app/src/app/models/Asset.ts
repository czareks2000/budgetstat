export interface Asset {
    id: number;
    assetCategoryId: number;
    name: string;
    description?: string;
    assetValue: number;
    currencyId: number;
}

export interface AssetCategory {
    id: number;
    name: string;
    iconId: number;
}

export interface AssetCreateUpdateValues {
    assetCategoryId: number;
    name: string;
    description?: string;
    assetValue: number;
    currencyId: number;
}