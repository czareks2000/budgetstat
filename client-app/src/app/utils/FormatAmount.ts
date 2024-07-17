export const formatAmount = (number: number) => {
  if (number % 1 !== 0) {
      return number.toLocaleString(undefined, { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          useGrouping: true 
      });
  } else {
      return number.toLocaleString(undefined, { 
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          useGrouping: true 
      });
  }
}