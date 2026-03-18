import { createContext } from "react";
import {IUser} from "../types/user";

interface IAuthContext {
    isAuthenticated: boolean;
    user: IUser | null;
    setUser: (user: IUser | null) => void;
}

export const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    user: null,
    setUser: () => {},
})
