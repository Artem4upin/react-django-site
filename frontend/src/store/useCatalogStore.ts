import { create } from 'zustand'
import {IBrand, ICategory, IFilters, IParameter, IProduct, ISubcategory} from "../types/product";
import {api} from "../api";
import {getErrorMsg} from "../utils/errorMassages";
import axios from "axios";

const defaultFilters: IFilters = {
    category: null,
    subcategory: null,
    minPrice: null,
    maxPrice: null,
    brandId: null,
    paramId: null,
    paramValue: null,
    inStock: true,
};

interface IInitialState {
    selectedCategoryName: string;
    selectedSubcategoryName: string;
    categories: ICategory[];
    isMobileFilterSidebarOpen: boolean;
    filterData: {brands: IBrand[], params: IParameter[]}
    currentFilters: IFilters;
    appliedFilters: IFilters;
    loading: boolean;
    loadingError: string;
    products: IProduct[];
    nextPage: string;
    loadingMore: boolean;
}

interface IActions {
    setSelectedCategoryName: (name: string) => void;
    setSelectedSubcategoryName: (name: string) => void;
    setCategories: (categories: ICategory[]) => void;
    setIsMobileFilterSidebarOpen: (isMobileFilterOpen: boolean) => void;
    setFilterData: (filterData: {brands: IBrand[], params: IParameter[]}) => void;
    setCurrentFilters: (currentFilters: IFilters) => void;
    setAppliedFilters: (appliedFilters: IFilters) => void;
    setLoading: (loading: boolean) => void;

    loadFilterData: () => Promise<void>;
    handleLocalFilterReset: () => void;
    handleCategoryFilterChange: (category: ICategory | null, subcategory: ISubcategory | null) => void;
    handleFilterChange: (type: string, value: string | number | boolean) => void;
    applyFilters: () => void;
    resetAllFilters: () => void;
    loadProducts: (page: number, filters: IFilters) => void;
    setLoadingError: (loadingError: string) => void;
    setProducts: (products: IProduct[]) => void;
    setNextPage: (page: string) => void;
    setLoadingMore: (loadingMore: boolean) => void;
    loadMoreProducts: () => void;
}

interface ICatalogStore extends IInitialState, IActions {}

export const useCatalogStore = create<ICatalogStore> ((set, get) => ({
    selectedCategoryName: '',
    selectedSubcategoryName: '',
    categories: [],
    isMobileFilterSidebarOpen: false,
    filterData: {brands: [], params: []},
    currentFilters: defaultFilters,
    appliedFilters: defaultFilters,
    loading: false,
    loadingError: '',
    products: [],
    nextPage: '',
    loadingMore: false,

    setSelectedCategoryName: (name) => set({selectedCategoryName: name}),
    setSelectedSubcategoryName: (name) => set({selectedSubcategoryName: name}),
    setCategories: (categories) => set({categories}),
    setIsMobileFilterSidebarOpen: (isMobileFilterSidebarOpen) => set({isMobileFilterSidebarOpen: isMobileFilterSidebarOpen}),
    setFilterData: (filterData) => set({filterData}),
    setCurrentFilters: (currentFilters) => set({currentFilters}),
    setAppliedFilters: (appliedFilters) => set({appliedFilters}),
    setLoading: (loading) => set({loading}),
    setLoadingError: (loadingError) => set({loadingError}),
    setProducts: (products) => set({products}),
    setNextPage: (nextPage) => set({nextPage}),
    setLoadingMore: (loadingMore) => set({loadingMore}),

    loadFilterData: async () => {
        try {
            const [categoriesRes, brandsRes, paramsRes] = await Promise.all([
                api.get<ICategory[]>('/categories/'),
                api.get<IBrand[]>('/brands/'),
                api.get<IParameter[]>('/parameters/')
            ])
            set({
                categories: categoriesRes.data,
                filterData: {
                    brands: brandsRes.data,
                    params: paramsRes.data
                }
            })
        } catch (error) {
            console.error('Ошибка загрузки данных для фильтра:', error)
        }
    },
    handleLocalFilterReset: () => {
        set((state) => ({
            currentFilters: {
                ...state.currentFilters,
                minPrice: null,
                maxPrice: null,
                brandId: null,
                paramId: null,
                paramValue: null,
                inStock: true,
            },
        }))
    },
    handleCategoryFilterChange: (category: ICategory | null, subcategory: ISubcategory | null) => {
        set((state) => ({
            currentFilters: {
                ...state.currentFilters,
                category: category,
                subcategory: subcategory,
                paramId: null,
                paramValue: null,
            },
        }))

        if (category && !subcategory) {
            set ({
                selectedCategoryName: category.name,
                selectedSubcategoryName: '',
            })
        } else if (category && subcategory) {
            set ({
                selectedCategoryName: category.name,
                selectedSubcategoryName: subcategory.name,
            })
        } else {
            set ({
                selectedCategoryName: '',
                selectedSubcategoryName: ''
            })
        }
    },
    handleFilterChange: (type: string, value: string | number | boolean) => {
        set((state) => ({
            currentFilters: {
                ...state.currentFilters,
                [type]: value === '' ? null : value,
            }
        }))
    },
    applyFilters: () => {
        const {currentFilters, loadProducts} = get()
        set((state) => ({
            appliedFilters: state.currentFilters,
            isMobileFilterSidebarOpen: false,
        }))
        loadProducts(1, currentFilters)
    },
    resetAllFilters: () => {
        const {loadProducts} = get()
        set({
            currentFilters: {...defaultFilters},
            appliedFilters: {...defaultFilters},
            selectedCategoryName: '',
            selectedSubcategoryName: '',
            isMobileFilterSidebarOpen: false
        })
         loadProducts(1, defaultFilters)
    },
    loadProducts: async (page: number = 1, filters: IFilters = get().currentFilters) => {
        set({
            loading: true,
            loadingError: ''
        })
        const timeout = setTimeout(() => {
            set({
                loading: false,
                loadingError: 'Превышено время ожидания. Попробуйте перезагрузить страницу'
            })
        }, 5000)

        try {
            const params: any = { page }
            if (filters.category?.id) params.category_id = filters.category.id
            if (filters.subcategory?.id) params.subcategory_id = filters.subcategory.id
            if (filters.minPrice !== null) params.min_price = filters.minPrice
            if (filters.maxPrice !== null) params.max_price = filters.maxPrice
            if (filters.brandId !== null) params.brand_id = filters.brandId
            if (filters.paramId !== null && filters.paramValue !== null) {
                params.param_id = filters.paramId
                params.param_value = filters.paramValue
            }
            if (!filters.inStock) params.in_stock = false

            const response = await api.get('/products/', { params })
            set({
                products: response.data.results,
                nextPage: response.data.next
            })
            clearTimeout(timeout)
        } catch (error: any) {
            clearTimeout(timeout)
            set({
                loadingError: getErrorMsg(error),
                products: []
            })
        } finally {
            set({ loading: false })
        }
    },
    loadMoreProducts: async () => {
        const {loadingMore, nextPage} = get()
        if (loadingMore || !nextPage) return
        set({
            loadingMore: true,
            loadingError: ''
        })

        const timeout = setTimeout(() => {
            set({
                loadingMore: false,
                loadingError: 'Превышено время ожидания. Попробуйте перезагрузить страницу'
            })
        }, 5000)

        try {
            const response = await axios.get(nextPage)
            clearTimeout(timeout)
            set((state) => ({
                products: [...state.products, ...response.data.results],
                nextPage: response.data.next
            }))
        } catch (error: any) {
            clearTimeout(timeout)
            set({loadingError: getErrorMsg(error)})
            console.error('Ошибка загрузки товаров', error)
        } finally {
            set({ loadingMore: false })
        }
    },

}))

export const useSelectedCategoryName = () => useCatalogStore((state) => state.selectedCategoryName);
export const useSelectedSubcategoryName = () => useCatalogStore((state) => state.selectedSubcategoryName);
export const useCategories = () => useCatalogStore((state) => state.categories);
export const useIsMobileFilterSidebarOpen = () => useCatalogStore((state) => state.isMobileFilterSidebarOpen);
export const useFilterData = () => useCatalogStore((state) => state.filterData);
export const useCurrentFilters = () => useCatalogStore((state) => state.currentFilters);
export const useLoading = () => useCatalogStore((state) => state.loading);
export const useLoadingError = () => useCatalogStore((state) => state.loadingError);
export const useProducts = () => useCatalogStore((state) => state.products);
export const useNextPage = () => useCatalogStore((state) => state.nextPage);
export const useLoadingMore = () => useCatalogStore((state) => state.loadingMore);

export const useHandleCategoryFilterChange = () => useCatalogStore((state) => state.handleCategoryFilterChange);
export const useHandleFilterChange = () => useCatalogStore((state) => state.handleFilterChange);
export const useApplyFilters = () => useCatalogStore((state) => state.applyFilters);
export const useResetAllFilters =  () => useCatalogStore((state) => state.resetAllFilters);
export const useHandleLocalFilterReset = () => useCatalogStore((state) => state.handleLocalFilterReset);
export const useSetIsMobileFilterSidebarOpen = () => useCatalogStore((state) => state.setIsMobileFilterSidebarOpen);
export const useLoadFilterData = () => useCatalogStore((state) => state.loadFilterData);
export const useLoadProducts = () => useCatalogStore((state) => state.loadProducts);
export const useLoadMoreProducts = () => useCatalogStore((state) => state.loadMoreProducts);

export const useHasAnyFilters = () => useCatalogStore((state) => {
    const currentFilters = state.currentFilters;
    return (
        currentFilters.minPrice !== null ||
        currentFilters.maxPrice !== null ||
        currentFilters.brandId !== null ||
        currentFilters.paramId !== null ||
        currentFilters.paramValue !== null ||
        currentFilters.inStock === false
    );
});