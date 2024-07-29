export interface User {
    userName: string;
    email: string;
    token: string;
    currencyId: number;
}

export interface UserFormValues {
    userName?: string;
    email: string;
    defaultCurrencyId?: string | number;
    password: string;
    confirmPassword?: string;
}

export interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}