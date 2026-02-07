import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type CategoryType = 'income' | 'expense'

export interface Category {
    id: string
    name: string
    type: CategoryType
}

interface CategoriesState {
    items: Category[]
    loading: boolean
}

const initialState: CategoriesState = {
    items: [],
    loading: false,
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories(state, action: PayloadAction<Category[]>) {
            state.items = action.payload
            state.loading = false
        },

        addCategory(state, action: PayloadAction<Category>) {
            state.items.push(action.payload)
        },

        updateCategory(state, action: PayloadAction<Category>) {
            const index = state.items.findIndex(
                category => category.id === action.payload.id
            )
            if (index !== -1) {
                state.items[index] = action.payload
            }
        },

        deleteCategory(state, action: PayloadAction<string>) {
            state.items = state.items.filter(
                category => category.id !== action.payload
            )
        },

        setCategoriesLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
    },
})

export const {setCategories, addCategory, updateCategory, deleteCategory, setCategoriesLoading} = categoriesSlice.actions

export default categoriesSlice.reducer
