import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { addTransactionFirebase } from "../../features/transactionsSlice.ts";
import { fetchCategories } from "../../features/categoriesSlice.ts";

const Toolbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector((state: RootState) => state.categories.items);
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [amount, setAmount] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<string>('');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const filteredCategories = categories.filter(c => c.type === type);

    const addTransaction = () => setShowModal(true);

    const sendTransaction = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!categoryId) return;
        dispatch(addTransactionFirebase({ type, amount, categoryId }));
        setType('income');
        setAmount(0);
        setCategoryId('');
        setShowModal(false);
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center p-3 border-bottom mb-4'>
                <Link to="/" className='fw-bold fs-4 text-decoration-none text-dark'>
                    MyBudget
                </Link>
                <div>
                    <Link to="/categories" className='btn btn-outline-primary me-2'>
                        Categories
                    </Link>
                    <button onClick={addTransaction} className='btn btn-primary'>Add</button>
                </div>
            </div>

            {showModal && (
                <div className="modal d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={sendTransaction}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Transaction</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
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
                                    <button type="submit" className="btn btn-primary">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Toolbar;
