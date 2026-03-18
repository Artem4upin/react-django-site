export interface IUser {
    id: number;
    username: string;
    email?: string;
    user_type?: TUserType;
    phone?: string;
    first_name?: string;
    last_name?: string;
}

export type TUserType = "User" | "Admin" | "Manager"