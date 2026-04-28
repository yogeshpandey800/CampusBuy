import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../utils/appSlice';
import HomeHeader from '../Component/HomeHeader';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Calendar, Trash2, AlertCircle, PlusCircle, Pencil, X, Check } from 'lucide-react';

const CATEGORIES = ['electronics', 'furniture', 'vehicles', 'fashion', 'books', 'others'];
const CONDITIONS = ['new', 'like-new', 'used'];

function EditModal({ product, onClose, onSave }) {
    const [form, setForm] = useState({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        condition: product.condition || '',
        price: product.price || '',
        negotiable: product.negotiable || false,
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim() || !form.category || !form.condition || !form.price) {
            toast.error('Please fill all required fields');
            return;
        }
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('category', form.category);
            formData.append('condition', form.condition);
            formData.append('price', form.price);
            formData.append('negotiable', form.negotiable);

            const response = await axios.put(
                `http://localhost:5000/api/product/${product._id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSave(response.data.product);
            toast.success('Product updated successfully');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Edit Product</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full resize-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition capitalize"
                            >
                                <option value="">Select</option>
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c} className="capitalize">{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Condition <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="condition"
                                value={form.condition}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition capitalize"
                            >
                                <option value="">Select</option>
                                {CONDITIONS.map(c => (
                                    <option key={c} value={c} className="capitalize">{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="price"
                                type="number"
                                min="0"
                                value={form.price}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            />
                        </div>
                        <label className="flex items-center gap-2 pb-2 cursor-pointer select-none text-sm text-gray-700 dark:text-gray-200">
                            <input
                                type="checkbox"
                                name="negotiable"
                                checked={form.negotiable}
                                onChange={handleChange}
                                className="w-4 h-4 accent-indigo-600"
                            />
                            Negotiable
                        </label>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition ${
                                saving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {saving ? (
                                <>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                        className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

function History() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setCurrentPage('history'));
        fetchUserProducts();
    }, [dispatch]);

    const fetchUserProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to view your listed products');
                setLoading(false);
                return;
            }
            const response = await axios.get('http://localhost:5000/api/product/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            const errorMessage = error.response?.data?.error || 'Failed to fetch products';
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleSaveEdit = (updatedProduct) => {
        setProducts(prev => prev.map(p => p._id === updatedProduct._id ? { ...p, ...updatedProduct } : p));
    };

    const confirmDelete = (productId) => setDeleteConfirm(productId);
    const cancelDelete = () => setDeleteConfirm(null);

    const handleDelete = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { toast.error('Please login to delete products'); return; }

            await axios.delete(`http://localhost:5000/api/product/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProducts(products.filter(product => product._id !== productId));
            setDeleteConfirm(null);
            toast.success('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error(error.response?.data?.error || 'Failed to delete product');
            setDeleteConfirm(null);
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

    return (
        <section className="bg-gradient-to-b from-[#fcfdfd] via-[#fffbee] to-[#f7f9ff] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 h-full transition-colors duration-300">
            <HomeHeader />

            {/* Edit Modal */}
            <AnimatePresence>
                {editingProduct && (
                    <EditModal
                        product={editingProduct}
                        onClose={() => setEditingProduct(null)}
                        onSave={handleSaveEdit}
                    />
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                My Products
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                Manage your listed products and track their status
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/sell')}
                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                            <PlusCircle size={20} />
                            List New Product
                        </motion.button>
                    </div>
                </motion.div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                        />
                        <p className="text-gray-600 dark:text-gray-300 mt-4">Loading your products...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
                    >
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-red-800 mb-2">Oops!</h3>
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchUserProducts}
                            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}

                {/* Empty */}
                {!loading && !error && products.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Products Yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Start selling by listing your first product!</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/sell')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                        >
                            <PlusCircle size={20} />
                            List Your First Product
                        </motion.button>
                    </motion.div>
                )}

                {/* Products Grid */}
                {!loading && !error && products.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.07 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-colors duration-300 overflow-hidden group flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden flex-shrink-0">
                                    <img
                                        src={product.images?.[0] || 'https://placehold.co/400x300?text=No+Image'}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Condition badge */}
                                    {product.condition && (
                                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-700 capitalize shadow">
                                            {product.condition}
                                        </span>
                                    )}

                                    {/* Negotiable badge */}
                                    {product.negotiable && (
                                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow">
                                            Negotiable
                                        </span>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-base text-gray-800 dark:text-gray-100 mb-1 line-clamp-1">
                                        {product.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2 flex-1">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                            {formatPrice(product.price)}
                                        </p>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                                            {product.category || '—'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-4">
                                        <Calendar size={12} />
                                        <span>{new Date(product.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}</span>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2 mt-auto">
                                        <AnimatePresence mode="wait">
                                            {deleteConfirm === product._id ? (
                                                <motion.div
                                                    key="confirm"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="flex gap-2 w-full"
                                                >
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-xs font-semibold"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={cancelDelete}
                                                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs font-semibold"
                                                    >
                                                        Cancel
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="actions"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex gap-2 w-full"
                                                >
                                                    {/* Edit button */}
                                                    <button
                                                        onClick={() => setEditingProduct(product)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-xs font-semibold"
                                                    >
                                                        <Pencil size={13} />
                                                        Edit
                                                    </button>
                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => confirmDelete(product._id)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-xs font-semibold"
                                                    >
                                                        <Trash2 size={13} />
                                                        Remove
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}

export default History;
