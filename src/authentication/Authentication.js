//Authentication.js
import React, { useState } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';

const Authentication = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div>
            {isLogin ? <Login /> : <Register />}
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Register' : 'Switch to Login'}
            </button>
        </div>
    );
};

export default Authentication;
