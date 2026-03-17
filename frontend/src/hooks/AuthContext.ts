import { createContext } from "react";
import {IUser} from "../types/user";

interface IAuthContext {
    isAuthenticated: boolean;
    user: IUser | null;
}

export const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    user: null
})
