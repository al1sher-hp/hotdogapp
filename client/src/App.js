import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MijozIsm from './components/MijozIsm';
import MijozMenu from './components/MijozMenu';
import MijozSavat from './components/MijozSavat';
import MijozQR from './components/MijozQR';
import HodimLogin from './components/HodimLogin';
import HodimDashboard from './components/HodimDashboard';
import Ekran from './components/Ekran';
import BoshliqLogin from './components/BoshliqLogin';
import BoshliqDashboard from './components/BoshliqDashboard';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MijozIsm />} />
                    <Route path="/menu" element={<MijozMenu />} />
                    <Route path="/savat" element={<MijozSavat />} />
                    <Route path="/qr" element={<MijozQR />} />
                    <Route path="/hodim" element={<HodimLogin />} />
                    <Route path="/hodim/dashboard" element={<HodimDashboard />} />
                    <Route path="/ekran" element={<Ekran />} />
                    <Route path="/boshliq" element={<BoshliqLogin />} />
                    <Route path="/boshliq/dashboard" element={<BoshliqDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
