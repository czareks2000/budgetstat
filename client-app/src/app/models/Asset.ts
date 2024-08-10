import dayjs from "dayjs";

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

export interface AssetValue {
    id: number;
    value: number;
    date: Date;
    currencyId: number;
}

export interface AssetValueCreateValues {
    value: number | null;
    date: Date | dayjs.Dayjs;
    currencyId: number | string;
}

export interface AssetCreateUpdateValues {
    assetCategoryId: number | string;
    name: string;
    description?: string;
    assetValue: number | null;
    currencyId: number | string;
    date: Date | dayjs.Dayjs;
}