import {Link} from "react-router-dom";
import {useState} from "react";

const Toolbar = () => {
    const [showModal, setShowModal] = useState(false);

    const addTransaction = () => {
        setShowModal(true);
        console.log('MODAL OPENED');
    };

    return (
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
    );
};

export default Toolbar;