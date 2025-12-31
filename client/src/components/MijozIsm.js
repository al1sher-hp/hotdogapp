import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MijozIsm.css';

function MijozIsm() {
    const [ism, setIsm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!ism.trim()) {
            setError('Ismni kiriting!');
            return;
        }

        // Save name to localStorage
        localStorage.setItem('customerName', ism);
        navigate('/menu');
    };

    return (
        <div className="mijoz-ism-container">
            <div className="mijoz-ism-card">
                <h1 className="welcome-title">Xush kelibsiz!</h1>
                <p className="welcome-text">
                    Ismingizni yozing, buyurtma tayyor bo'lsa sizni shu ism bilan chaqirishadi!
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="input-field name-input"
                        placeholder="Ismingizni kiriting..."
                        value={ism}
                        onChange={(e) => {
                            setIsm(e.target.value);
                            setError('');
                        }}
                    />

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn btn-primary btn-large">
                        Davom etish
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MijozIsm;
