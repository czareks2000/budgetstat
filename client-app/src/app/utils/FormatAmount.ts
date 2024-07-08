export const formatAmount = (number: number) => {
    return number.toLocaleString(undefined, { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true 
      });
}