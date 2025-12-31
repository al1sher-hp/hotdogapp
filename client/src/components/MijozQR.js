import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MijozQR.css';

function MijozQR() {
    const [qrCode, setQrCode] = useState('');
    const [customerName, setCustomerName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedQR = localStorage.getItem('qrCode');
        const savedName = localStorage.getItem('customerName');

        if (!savedQR || !savedName) {
            navigate('/');
            return;
        }

        setQrCode(savedQR);
        setCustomerName(savedName);
    }, [navigate]);

    const startNewOrder = () => {
        localStorage.removeItem('qrCode');
        localStorage.removeItem('orderId');
        localStorage.removeItem('customerName');
        localStorage.removeItem('cart');
        navigate('/');
    };

    return (
        <div className="mijoz-qr-container">
            <div className="qr-card">
                <h1>Buyurtma qabul qilindi!</h1>
                <p className="qr-instruction">
                    Ushbu QR kodni hodimga ko'rsating va pul to'lang
                </p>

                {qrCode && (
                    <div className="qr-code-wrapper">
                        <img src={qrCode} alt="QR Code" className="qr-code-image" />
                    </div>
                )}

                <div className="customer-info">
                    <p>Sizning ismingiz: <strong>{customerName}</strong></p>
                    <p className="info-text">
                        Buyurtma tayyor bo'lganda ekranda sizning ismingiz ko'rinadi
                    </p>
                </div>

                <button className="btn btn-primary" onClick={startNewOrder}>
                    Yangi buyurtma
                </button>
            </div>
        </div>
    );
}

export default MijozQR;
