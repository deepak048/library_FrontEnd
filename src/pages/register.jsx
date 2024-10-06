import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/custom.css";
import libraryImage from "../assets/library.jpg";

const Register = () => {
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const toast = React.useRef(null);
    const navigate = useNavigate();

    const validateFields = () => {
        const newErrors = {};
        
        if (!userName) {
            newErrors.userName = "Username is required.";
            toast.current.show({ severity: "error", summary: "Validation Error", detail: "Username is required." });
            return;
        }
        if (!password) {
            newErrors.password = "Password is required.";
            toast.current.show({ severity: "error", summary: "Validation Error", detail: "Password is required." });
            return;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required.";
            toast.current.show({ severity: "error", summary: "Validation Error", detail: "Passwords do not match." });
            return;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            toast.current.show({ severity: "error", summary: "Validation Error", detail: "Passwords do not match." });
            return;
        }
        if (!phoneNo) {
            newErrors.phoneNo = "Phone number is required.";
            toast.current.show({ severity: "error", summary: "Validation Error", detail: "Phone number is required." });
            return;
        }
        if (!email) {
            newErrors.email = "Email is required.";
            toast.current.show({ severity: "error", summary: "Validation Error", detail: "Email is required." });
            return;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateFields()) {
            try {
                const response = await axios.post("http://localhost:8080/api/register", {
                    userName,
                    password,
                    confirmPassword,
                    phoneNo,
                    email,
                });

                if (response.status === 200) {
                    toast.current.show({ severity: "success", summary: "Success", detail: response.data.message });
                    navigate("/");
                } else {
                    toast.current.show({ severity: "error", summary: "Error", detail: response.data.message });
                }
            } catch (error) {
                if (error.response) {
                    toast.current.show({ severity: "error", summary: "Error", detail: error.response.data.message });
                } else {
                    toast.current.show({ severity: "error", summary: "Error", detail: "Network error. Please try again." });
                }
            }
        }
    };

    return (
        <div className="register-container">
            <Toast ref={toast} />
            <div className="register-card">
                <form onSubmit={handleSubmit}>
                    <h2 className="register-title">Register</h2>
                    <FloatLabel className="float-label">
                        <InputText
                            id="username"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                        />
                        <label htmlFor="username">Username</label>
                    </FloatLabel>

                    <FloatLabel className="float-label">
                        <InputText
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="off"
                        />
                        <label htmlFor="password">Password</label>
                    </FloatLabel>

                    <FloatLabel className="float-label">
                        <InputText
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="off"
                        />
                        <label htmlFor="confirm-password">Confirm Password</label>
                    </FloatLabel>

                    <FloatLabel className="float-label">
                        <InputText
                            id="phone-no"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            autoComplete="off"
                        />
                        <label htmlFor="phone-no">Phone No</label>
                    </FloatLabel>

                    <FloatLabel className="float-label">
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                        />
                        <label htmlFor="email">Email Address</label>
                    </FloatLabel>

                    <Button label="Register" type="submit" className="register-button" />
                </form>
            </div>
        </div>
    );
};

export default Register;
