export interface User {
    userName: string;
    email: string;
    token: string;
}

export interface UserFormValues {
    userName?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}