import {useSelector} from "react-redux";
import type {RootState} from "../../app/store.ts";

const Home = () => {
    const transactions = useSelector((state: RootState) => state.transactions.items)
    const categories = useSelector((state: RootState) => state.categories.items)
    const loading = useSelector((state: RootState) => state.transactions.loading)

    return (
        <div>
            {loading && (
                <div className="d-flex justify-content-center my-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;