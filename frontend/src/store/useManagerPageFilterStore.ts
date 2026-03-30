import { create } from 'zustand'
import {Today} from "../utils/functions";

interface IInitialState {
    startDate: string,
    endDate: string,
    orderNumber: string,
}

interface IActions {
    setStartDate: (date: string) => void,
    setEndDate: (date: string) => void,
    setOrderNumber: (orderNumber: string) => void,

    resetManagerPageFilters: () => void,
}

interface IManagerPageFilterStore extends IInitialState, IActions {}

export const useManagerPageFilterStore = create<IManagerPageFilterStore>((set, get) => ({
    startDate: Today,
    endDate: Today,
    orderNumber: '',

    setStartDate: (date) => set({startDate: date}),
    setEndDate: (date) => set({endDate: date}),
    setOrderNumber: (order) => set({orderNumber: order}),

    resetManagerPageFilters: () => set({
        startDate: Today,
        endDate: Today,
        orderNumber: ''}),
}))

export const useStartDate = () => useManagerPageFilterStore((state) => state.startDate)
export const useEndDate = () => useManagerPageFilterStore((state) => state.endDate)
export const useOrderNumber = () => useManagerPageFilterStore((state) => state.orderNumber)

export const useSetStartDate = () => useManagerPageFilterStore((state) => state.setStartDate)
export const useSetEndDate = () => useManagerPageFilterStore((state) => state.setEndDate)
export const useSetOrderNumber = () => useManagerPageFilterStore((state) => state.setOrderNumber)

export const useResetManagerPageFilter = () => useManagerPageFilterStore((state) => state.resetManagerPageFilters)