import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div>
            <h2>Register</h2>
            <form>
                <div>
                    <label>Name:</label>
                    <input type="text" placeholder="Enter your name" />
                </div>
                <div>
                    <label>Mobile No.:</label>
                    <input type="tel" placeholder="Enter your mobile number" />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" placeholder="Enter your email" />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" placeholder="Enter your password" />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" placeholder="Confirm your password" />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already registered, <Link to="/login">Login</Link>.</p>
        </div>
    );
}

export default Register;
