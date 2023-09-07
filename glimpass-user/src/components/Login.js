import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" placeholder="Enter your email" />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" placeholder="Enter your password" />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>If you're not registered, <Link to="/register">register yourself</Link>.</p>
        </div>
    );
}

export default Login;
