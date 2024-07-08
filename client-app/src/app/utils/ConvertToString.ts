import dayjs from "dayjs"

export const convertToString = (date: Date, format: string = "DD/MM/YYYY") => {
    return dayjs(date).format(format);
}