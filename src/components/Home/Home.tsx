import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store.ts";
import { useEffect, useState } from "react";
import { fetchTransactions, addTransactionFirebase, updateTransactionFirebase, deleteTransactionFirebase } from "../../features/transactionsSlice.ts";
import { fetchCategories } from "../../features/categoriesSlice.ts";
import dayjs from "dayjs";

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const transactions = useSelector((state: RootState) => state.transactions.items);
    const categories = useSelector((state: RootState) => state.categories.items);
    const loading = useSelector((state: RootState) => state.transactions.loading);

    const [showModal, setShowModal] = useState(false);
    const [editTransactionId, setEditTransactionId] = useState<string | null>(null);
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [amount, setAmount] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<string>('');

    const filteredCategories = categories.filter(c => c.type === type);

    useEffect(() => {
        dispatch(fetchTransactions());
        dispatch(fetchCategories());
    }, [dispatch]);

    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const total = totalIncome - totalExpense;

    const handleDelete = (id: string) => {
        dispatch(deleteTransactionFirebase(id));
    };

    const openModal = (transaction?: typeof transactions[0]) => {
        if (transaction) {
            setEditTransactionId(transaction.id);
            setType(transaction.type);
            setAmount(transaction.amount);
            setCategoryId(transaction.categoryId);
        } else {
            setEditTransactionId(null);
            setType('income');
            setAmount(0);
            setCategoryId('');
        }
        setShowModal(true);
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!categoryId) return;
        if (editTransactionId) {
            dispatch(updateTransactionFirebase({
                id: editTransactionId,
                type,
                amount,
                categoryId,
                createdAt: transactions.find(t => t.id === editTransactionId)?.createdAt || new Date().toISOString()
            }));
        } else {
            dispatch(addTransactionFirebase({ type, amount, categoryId }));
        }
        setEditTransactionId(null);
        setType('income');
        setAmount(0);
        setCategoryId('');
        setShowModal(false);
    };

    if (transactions.length === 0 && !loading) {
        return <p className="text-center mt-4">No transactions yet</p>;
    }

    return (
        <div className='container p-2'>
            {loading && (
                <div className="d-flex justify-content-center my-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            <div className="mt-3 p-3 border rounded text-center fw-bold" style={{ fontSize: '1.2rem' }}>
                Total: <span style={{ color: total >= 0 ? 'green' : 'red' }}>
                    {total >= 0 ? '+' : '-'}{Math.abs(total)}
                </span>
            </div>

            <div className="d-flex flex-wrap gap-3 p-2 mt-2">
                {transactions.map(t => {
                    const category = categories.find(c => c.id === t.categoryId);
                    const isIncome = t.type === "income";
                    return (
                        <div key={t.id} className="card p-2" style={{ width: '220px' }}>
                            <div className="card-body">
                                <h6 className="card-subtitle mb-2 text-muted">{t.type.toUpperCase()}</h6>
                                <p className="card-text mb-1">
                                    <strong>Category:</strong> {category?.name || "Unknown"}
                                </p>
                                <p className="card-text mb-1" style={{ color: isIncome ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {isIncome ? '+' : '-'} {t.amount}
                                </p>
                                <p className="card-text">
                                    <small className="text-muted">{dayjs(t.createdAt).format('DD.MM.YYYY HH:mm')}</small>
                                </p>
                                <div className="d-flex gap-2 mt-2">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => openModal(t)}>Edit</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div className="modal d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{editTransactionId ? 'Edit Transaction' : 'Add Transaction'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Type</label>
                                        <select
                                            className="form-select"
                                            value={type}
                                            onChange={e => {
                                                setType(e.target.value as 'income' | 'expense');
                                                setCategoryId('');
                                            }}
                                        >
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-select"
                                            value={categoryId}
                                            onChange={e => setCategoryId(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Choose category</option>
                                            {filteredCategories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Amount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={amount}
                                            onChange={e => setAmount(Number(e.target.value))}
                                            min={0}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                    <button type="submit" className="btn btn-primary">{editTransactionId ? 'Update' : 'Add'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
