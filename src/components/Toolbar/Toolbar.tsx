import {Link} from "react-router-dom";
import {useState} from "react";

const Toolbar = () => {
    const [showModal, setShowModal] = useState(false);

    const addTransaction = () => {
        setShowModal(true);
        console.log('MODAL OPENED');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                MyBudget
            </Link>
            <div>
                <Link to="/categories" style={{ marginRight: '1rem' }}>
                    Categories
                </Link>
                <button onClick={addTransaction}>Add</button>
            </div>
        </div>
    );
};

export default Toolbar;