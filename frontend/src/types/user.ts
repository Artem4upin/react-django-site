export interface IUser {
    id: number;
    username: string;
    email?: string;
    user_type?: "User" | "Admin" | "Manager";
}