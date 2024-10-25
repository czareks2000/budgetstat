export interface Option {
    value: string | number;
    text: string;
    iconId?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enumToOptions(enumObject: any, plular: boolean = false): Option[] {
    return Object.keys(enumObject)
      .filter(key => !isNaN(Number(enumObject[key])))
      .map(key => ({
        value: parseInt(enumObject[key]),
        text: `${key}${plular ? 's' : ''}`,
      }));
  }