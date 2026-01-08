import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users") || "[]");

        if (users.find((u: any) => u.username === username)) {
            alert("Tài khoản đã tồn tại");
            return;
        }

        users.push({
            id: crypto.randomUUID(),
            username,
            password,
            favorites: []
        });

        localStorage.setItem("users", JSON.stringify(users));
        alert("Đăng ký thành công");
        navigate("/login");
    };

    return (
        <div className="auth-container">
            <h2>Đăng ký</h2>

            <form onSubmit={handleRegister}>
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

                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit">ĐĂNG KÝ</button>
            </form>

            <p>
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
        </div>
    );
}

export default RegisterPage;
