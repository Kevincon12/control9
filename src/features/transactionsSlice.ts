import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Transaction {
    id: string;
    categoryId: string;
    type: 'income' | 'expense';
    amount: number;
    createdAt: string;
}

interface TransactionsState {
    items: Transaction[];
    loading: boolean;
}

const initialState: TransactionsState = {
    items: [],
    loading: false,
};

const BASE_URL = 'https://iliacontrolwork9-default-rtdb.europe-west1.firebasedatabase.app/transactions.json';

export const fetchTransactions = createAsyncThunk('transactions/fetch', async () => {
    const res = await axios.get(BASE_URL);
    const data = res.data;
    if (!data) return [];
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
});

export const addTransactionFirebase = createAsyncThunk(
    'transactions/add',
    async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
        const newTransaction = { ...transaction, createdAt: new Date().toISOString() };
        const res = await axios.post(BASE_URL, newTransaction);
        return { id: res.data.name, ...newTransaction };
    }
);

export const deleteTransactionFirebase = createAsyncThunk(
    'transactions/delete',
    async (id: string) => {
        await axios.delete(`https://iliacontrolwork9-default-rtdb.europe-west1.firebasedatabase.app/transactions/${id}.json`);
        return id;
    }
);

export const updateTransactionFirebase = createAsyncThunk(
    'transactions/update',
    async (transaction: Transaction) => {
        const { id, ...rest } = transaction;
        await axios.put(`https://iliacontrolwork9-default-rtdb.europe-west1.firebasedatabase.app/transactions/${id}.json`, rest);
        return transaction;
    }
);

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTransactions.pending, state => { state.loading = true; })
            .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) =>
                { state.items = action.payload; state.loading = false; })
            .addCase(fetchTransactions.rejected, state => { state.loading = false; })
            .addCase(addTransactionFirebase.pending, state => { state.loading = true; })
            .addCase(addTransactionFirebase.fulfilled, (state, action: PayloadAction<Transaction>) =>
                { state.items.push(action.payload); state.loading = false; })
            .addCase(addTransactionFirebase.rejected, state => { state.loading = false; })
            .addCase(deleteTransactionFirebase.pending, state => { state.loading = true; })
            .addCase(deleteTransactionFirebase.fulfilled, (state, action: PayloadAction<string>) =>
                { state.items = state.items.filter(t => t.id !== action.payload); state.loading = false; })
            .addCase(deleteTransactionFirebase.rejected, state => { state.loading = false; })
            .addCase(updateTransactionFirebase.pending, state => { state.loading = true; })
            .addCase(updateTransactionFirebase.fulfilled, (state, action: PayloadAction<Transaction>) =>
            {
                const index = state.items.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
                state.loading = false;
            })
            .addCase(updateTransactionFirebase.rejected, state => { state.loading = false; });
    },
});

export default transactionsSlice.reducer;
