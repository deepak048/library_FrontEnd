import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "../css/custom.css";
import libraryImage from "../assets/library.jpg";
import { useNavigate } from "react-router-dom";
import { useApi } from '../hooks/useApiHelper';
import Cookies from 'js-cookie'; 

const FloatLabelDemo = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const toast = React.useRef(null);
    const navigate = useNavigate();
    const { apiRequest } = useApi();  

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const login = async () => {
        try {
            const response = await apiRequest({
                url: "http://localhost:8080/api/login",
                method: "POST",
                payload: {
                    userName,
                    password
                }
            });

            if (response && response.message.includes("successful")) {
                const token = response.jwt;
                Cookies.set('jwtToken', token, { expires: 7 });
                toast.current.show({ severity: "success", summary: "Success", detail: "Login successful" });
                navigate("/library");
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: response.message || "Login failed" });
            }
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "An error occurred while logging in." });
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!userName) newErrors.userName = "Username is required.";
        if (!password) newErrors.password = "Password is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        if (validateFields()) {
            login();
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill out all fields.' });
        }
    };

    return (
        <div className="login-card" style={{ backgroundImage: `url(${libraryImage})` }}>
            <Toast ref={toast} />

            <form onSubmit={handleSubmit}>
                <FloatLabel className="float-label">
                    <InputText
                        id="username"
                        value={userName}
                        onChange={handleInputChange(setUserName)}
                        autoComplete="username" 
                    />
                    <label htmlFor="username">Username</label>
                    {errors.userName && <small className="p-error">{errors.userName}</small>}
                </FloatLabel>

                <FloatLabel className="float-label">
                    <InputText
                        id="password"
                        type="password"
                        value={password}
                        onChange={handleInputChange(setPassword)}
                        autoComplete="current-password" 
                    />
                    <label htmlFor="password">Password</label>
                    {errors.password && <small className="p-error">{errors.password}</small>}
                </FloatLabel>

                <Button label="Submit" type="submit" className="p-button login-btn" /><br />
                <label className="register-link">Don't have an account? Create one. <a href="/register">Register</a></label>
            </form>
        </div>
    );
};

export default FloatLabelDemo;
