import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

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

const BASE_URL = 'https://iliacontrolwork9-default-rtdb.europe-west1.firebasedatabase.app/categories/'

export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
    const res = await axios.get(`${BASE_URL}.json`);
    const data = res.data;
    if (!data) return [];
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
})

export const addCategoryFirebase = createAsyncThunk(
    'categories/add',
    async (category: Omit<Category, 'id'>) => {
        const res = await axios.post(`${BASE_URL}.json`, category);
        return { id: res.data.name, ...category }
    }
)

export const updateCategoryFirebase = createAsyncThunk(
    'categories/update',
    async (category: Category) => {
        await axios.put(`${BASE_URL}${category.id}.json`, { name: category.name, type: category.type });
        return category;
    }
)

export const deleteCategoryFirebase = createAsyncThunk(
    'categories/delete',
    async (id: string) => {
        await axios.delete(`${BASE_URL}${id}.json`);
        return id
    }
)

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCategories.pending, state => {
                state.loading = true
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.items = action.payload
                state.loading = false
            })
            .addCase(fetchCategories.rejected, state => {
                state.loading = false
            })
            .addCase(addCategoryFirebase.pending, state => {
                state.loading = true
            })
            .addCase(addCategoryFirebase.fulfilled, (state, action: PayloadAction<Category>) => {
                state.items.push(action.payload)
                state.loading = false
            })
            .addCase(addCategoryFirebase.rejected, state => {
                state.loading = false
            })
            .addCase(updateCategoryFirebase.pending, state => {
                state.loading = true
            })
            .addCase(updateCategoryFirebase.fulfilled, (state, action: PayloadAction<Category>) => {
                const index = state.items.findIndex(cat => cat.id === action.payload.id)
                if (index !== -1) state.items[index] = action.payload
                state.loading = false
            })
            .addCase(updateCategoryFirebase.rejected, state => {
                state.loading = false
            })
            .addCase(deleteCategoryFirebase.pending, state => {
                state.loading = true
            })
            .addCase(deleteCategoryFirebase.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(cat => cat.id !== action.payload)
                state.loading = false
            })
            .addCase(deleteCategoryFirebase.rejected, state => {
                state.loading = false
            })
    },
})

export default categoriesSlice.reducer
