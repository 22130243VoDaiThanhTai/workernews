import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users") || "[]");

        const user = users.find(
            (u: any) => u.username === username && u.password === password
        );

        if (!user) {
            alert("Sai tài khoản hoặc mật khẩu");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/");
    };

    return (
        <div className="auth-container">
            <h2>Đăng nhập</h2>

            <form onSubmit={handleLogin}>
                <input
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button type="submit">ĐĂNG NHẬP</button>
            </form>

            <p>
                Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
        </div>
    );
}

export default LoginPage;
