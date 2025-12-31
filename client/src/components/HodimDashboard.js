import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsQR from 'jsqr';
import io from 'socket.io-client';
import './HodimDashboard.css';

function HodimDashboard() {
    const [scanning, setScanning] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [activeOrders, setActiveOrders] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/hodim');
            return;
        }

        // Setup axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch active orders
        fetchActiveOrders();

        // Setup Socket.io
        const socket = io('http://localhost:5000');
        socket.on('order-update', () => {
            fetchActiveOrders();
        });

        return () => {
            socket.disconnect();
            stopScanning();
        };
    }, [navigate]);

    const fetchActiveOrders = async () => {
        try {
            const response = await axios.get('/api/employee-orders');
            setActiveOrders(response.data);
        } catch (error) {
            console.error('Fetch orders error:', error);
        }
    };

    const startScanning = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            setScanning(true);
            setError('');
            scanQRCode();
        } catch (error) {
            console.error('Camera error:', error);
            setError('Kamera ochishda xato');
        }
    };

    const stopScanning = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setScanning(false);
    };

    const scanQRCode = () => {
        if (!scanning || !videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                handleQRCode(code.data);
                return;
            }
        }

        requestAnimationFrame(scanQRCode);
    };

    const handleQRCode = async (orderId) => {
        stopScanning();

        try {
            const response = await axios.get(`/api/get-order/${orderId}`);
            setCurrentOrder(response.data);
            setSuccess('Buyurtma topildi!');
        } catch (error) {
            console.error('Get order error:', error);
            setError('Buyurtma topilmadi');
        }
    };

    const confirmOrder = async () => {
        if (!currentOrder) return;

        try {
            await axios.post(`/api/confirm-order/${currentOrder.id}`);
            setSuccess('Buyurtma tasdiqlandi!');
            setCurrentOrder(null);
            fetchActiveOrders();
        } catch (error) {
            console.error('Confirm order error:', error);
            setError(error.response?.data?.error || 'Tasdiqlashda xato');
        }
    };

    const completeOrder = async (orderId) => {
        try {
            await axios.post(`/api/complete-order/${orderId}`);
            setSuccess('Buyurtma tayyor!');
            fetchActiveOrders();
        } catch (error) {
            console.error('Complete order error:', error);
            setError('Xato yuz berdi');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        navigate('/hodim');
    };

    return (
        <div className="hodim-dashboard-container">
            <div className="dashboard-header">
                <h1>Hodim Paneli</h1>
                <button className="btn btn-danger" onClick={logout}>Chiqish</button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="dashboard-content">
                {!scanning && !currentOrder && (
                    <div className="card">
                        <h2>QR Kod Skanerlash</h2>
                        <button className="btn btn-primary" onClick={startScanning}>
                            Kamerani ochish
                        </button>
                    </div>
                )}

                {scanning && (
                    <div className="card scanner-card">
                        <h2>QR kodni skanerlang</h2>
                        <video ref={videoRef} className="scanner-video" />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <button className="btn btn-danger" onClick={stopScanning}>
                            Bekor qilish
                        </button>
                    </div>
                )}

                {currentOrder && (
                    <div className="card order-details-card">
                        <h2>Buyurtma Tafsilotlari</h2>
                        <div className="order-info">
                            <p><strong>Mijoz:</strong> {currentOrder.ism}</p>
                            <p><strong>Buyurtma raqami:</strong> {currentOrder.id}</p>

                            <h3>Mahsulotlar:</h3>
                            <ul className="order-items-list">
                                {currentOrder.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.name} × {item.quantity} = {(item.price * item.quantity).toLocaleString()} so'm
                                    </li>
                                ))}
                            </ul>

                            <p className="order-total">
                                <strong>Jami:</strong> {currentOrder.total.toLocaleString()} so'm
                            </p>
                        </div>

                        <div className="order-actions">
                            <button className="btn btn-success" onClick={confirmOrder}>
                                Tasdiqlash (Pul olindi)
                            </button>
                            <button className="btn btn-danger" onClick={() => setCurrentOrder(null)}>
                                Bekor qilish
                            </button>
                        </div>
                    </div>
                )}

                <div className="card">
                    <h2>Tayyorlanayotgan Buyurtmalar</h2>
                    {activeOrders.length === 0 ? (
                        <p className="empty-text">Hozircha buyurtma yo'q</p>
                    ) : (
                        <div className="active-orders-list">
                            {activeOrders.map((order) => (
                                <div key={order.id} className="active-order-card">
                                    <div className="order-header-info">
                                        <h3>{order.ism}</h3>
                                        <span className="order-number">#{order.id.slice(-6)}</span>
                                    </div>
                                    <ul className="order-items-compact">
                                        {order.items.map((item, idx) => (
                                            <li key={idx}>{item.name} × {item.quantity}</li>
                                        ))}
                                    </ul>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => completeOrder(order.id)}
                                    >
                                        Tayyor
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HodimDashboard;
