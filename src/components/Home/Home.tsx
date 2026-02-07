import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store.ts";
import { useEffect } from "react";
import { fetchTransactions } from "../../features/transactionsSlice.ts";
import { fetchCategories } from "../../features/categoriesSlice.ts";
import dayjs from "dayjs";

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const transactions = useSelector((state: RootState) => state.transactions.items);
    const categories = useSelector((state: RootState) => state.categories.items);
    const loading = useSelector((state: RootState) => state.transactions.loading);

    useEffect(() => {
        dispatch(fetchTransactions());
        dispatch(fetchCategories());
    }, [dispatch]);

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

            <div className="d-flex flex-wrap gap-3 p-2">
                {transactions.map(t => {
                    const category = categories.find(c => c.id === t.categoryId);
                    return (
                        <div key={t.id} className="card p-2 shadow-sm" style={{ width: '220px' }}>
                            <div className="card-body">
                                <h6 className="card-subtitle mb-2 text-muted">{t.type.toUpperCase()}</h6>
                                <p className="card-text mb-1">
                                    <strong>Category:</strong> {category?.name || "Unknown"}
                                </p>
                                <p className="card-text mb-1">
                                    <strong>Amount:</strong> {t.amount}
                                </p>
                                <p className="card-text">
                                    <small className="text-muted">{dayjs(t.createdAt).format('DD/MM/YYYY HH:mm')}</small>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
