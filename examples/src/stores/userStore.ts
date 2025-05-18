import {UserState} from "../types";
import { persist } from "zustand/middleware";
import { create } from "zustand";

type UserActions = {
    reset: () => void;
}

type UserStore = UserState & UserActions;

const initialState: UserState = {
    id: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    image: '',
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            ...initialState, 
            reset: () => set(initialState)
        }),
        {name: 'userStore'}
    )
);
