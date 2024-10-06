import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/register';
import Library from './pages/library';
import BorrowCart from './pages/borrowCart';
import Login from './components/login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/library" element={<Library />} />
                <Route path="/borrowCart" element={<BorrowCart />} />
            </Routes>
        </Router>
    );
}

export default App;
