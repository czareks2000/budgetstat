export interface NetWorthStats {
    loansValue: number;
    assetsValues: {
        assetCategoryId: number;
        value: number;
    }[]
}
