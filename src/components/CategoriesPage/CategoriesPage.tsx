import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, addCategoryFirebase, updateCategoryFirebase, deleteCategoryFirebase, Category } from '../../features/categoriesSlice'
import type { AppDispatch, RootState } from '../../app/store'

const CategoriesPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.categories);

    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('income');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const openAddModal = () => {
        setEditId(null);
        setName('');
        setType('income');
        setShowModal(true);
    };

    const openEditModal = (cat: Category) => {
        setEditId(cat.id);
        setName(cat.name);
        setType(cat.type);
        setShowModal(true);
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editId) {
            dispatch(updateCategoryFirebase({ id: editId, name, type }));
        } else {
            dispatch(addCategoryFirebase({ name, type }));
        }
        setShowModal(false);
        setName('');
        setType('income');
        setEditId(null);
    }

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch(deleteCategoryFirebase(id))
        }
    };

    return (
        <div className="container p-2">
            <h2 className="m-2">Categories</h2>
            <button className="btn btn-primary mb-3" onClick={openAddModal}>
                Add Category
            </button>

            {showModal && (
                <div className="modal d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editId ? 'Edit Category' : 'Add Category'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Type</label>
                                        <select
                                            className="form-select"
                                            value={type}
                                            onChange={e => setType(e.target.value as 'income' | 'expense')}
                                        >
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editId ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="d-flex justify-content-center my-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {!loading && items.length > 0 && (
                <div className="list-group">
                    {items.map(cat => (
                        <div key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span>{cat.name}</span>
                                <span className={`badge ms-2 ${cat.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                                    {cat.type}
                                </span>
                            </div>
                            <div>
                                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEditModal(cat)}>
                                    Edit
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CategoriesPage
