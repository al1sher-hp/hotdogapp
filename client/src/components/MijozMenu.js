import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MijozMenu.css';

function MijozMenu() {
    const [menu, setMenu] = useState(null);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if customer name exists
        const customerName = localStorage.getItem('customerName');
        if (!customerName) {
            navigate('/');
            return;
        }

        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }

        // Fetch menu
        fetchMenu();
    }, [navigate]);

    const fetchMenu = async () => {
        try {
            const response = await axios.get('/api/get-menu');
            setMenu(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Menu yuklash xatosi:', error);
            setLoading(false);
        }
    };

    const addToCart = (item, sectionName) => {
        const existingItem = cart.find(i => i._id === item._id);

        let newCart;
        if (existingItem) {
            newCart = cart.map(i =>
                i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
            );
        } else {
            newCart = [...cart, { ...item, quantity: 1, sectionName }];
        }

        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const updateQuantity = (itemId, delta) => {
        const newCart = cart.map(item => {
            if (item._id === itemId) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: Math.max(0, newQuantity) };
            }
            return item;
        }).filter(item => item.quantity > 0);

        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const getItemQuantity = (itemId) => {
        const item = cart.find(i => i._id === itemId);
        return item ? item.quantity : 0;
    };

    const goToCart = () => {
        navigate('/savat');
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="mijoz-menu-container">
            <div className="menu-header">
                <h1>Menyu</h1>
                <button className="btn btn-primary cart-btn" onClick={goToCart}>
                    Savat ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </button>
            </div>

            {menu && menu.sections && menu.sections.map((section, idx) => (
                <div key={idx} className="menu-section">
                    <h2 className="section-title">{section.name}</h2>
                    <div className="items-grid">
                        {section.items && section.items.map((item) => (
                            <div key={item._id} className="menu-item-card">
                                {item.image_url && (
                                    <img src={item.image_url} alt={item.name} className="item-image" />
                                )}
                                <div className="item-info">
                                    <h3 className="item-name">{item.name}</h3>
                                    {item.description && (
                                        <p className="item-description">{item.description}</p>
                                    )}
                                    <p className="item-price">{item.price.toLocaleString()} so'm</p>

                                    <div className="item-actions">
                                        {getItemQuantity(item._id) > 0 ? (
                                            <div className="quantity-controls">
                                                <button
                                                    className="btn-quantity"
                                                    onClick={() => updateQuantity(item._id, -1)}
                                                >
                                                    -
                                                </button>
                                                <span className="quantity-display">
                                                    {getItemQuantity(item._id)}
                                                </span>
                                                <button
                                                    className="btn-quantity"
                                                    onClick={() => updateQuantity(item._id, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => addToCart(item, section.name)}
                                            >
                                                Savatga qo'shish
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {(!menu || !menu.sections || menu.sections.length === 0) && (
                <div className="empty-menu">
                    <p>Menu hozircha bo'sh</p>
                </div>
            )}
        </div>
    );
}

export default MijozMenu;
