import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Transaction {
    id: string
    categoryId: string
    amount: number
    createdAt: string
}

interface TransactionsState {
    items: Transaction[]
    loading: boolean
}

const initialState: TransactionsState = {
    items: [],
    loading: false,
}

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setTransactions(state, action: PayloadAction<Transaction[]>) {
            state.items = action.payload
            state.loading = false
        },

        addTransaction(state, action: PayloadAction<Transaction>) {
            state.items.push(action.payload)
        },

        updateTransaction(state, action: PayloadAction<Transaction>) {
            const index = state.items.findIndex(
                t => t.id === action.payload.id
            )
            if (index !== -1) {
                state.items[index] = action.payload
            }
        },

        deleteTransaction(state, action: PayloadAction<string>) {
            state.items = state.items.filter(
                t => t.id !== action.payload
            )
        },

        deleteByCategoryId(state, action: PayloadAction<string>) {
            state.items = state.items.filter(
                t => t.categoryId !== action.payload
            )
        },

        setTransactionsLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
    },
})

export const {setTransactions, addTransaction, updateTransaction, deleteTransaction, deleteByCategoryId, setTransactionsLoading} = transactionsSlice.actions

export default transactionsSlice.reducer
