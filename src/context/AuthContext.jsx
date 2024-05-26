import { createContext, useState, useContext } from 'react'
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth'
import Cookies from "js-cookie";
import { useEffect } from "react";
export const AuthContext = createContext();
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within ab AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState([]);

    // clear errors after 5 seconds
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    const signup = async (user) => {
        try {
            const res = await registerRequest(user)
            if (res.status === 200) {
                setUser(res.data)
                setIsAuthenticated(true)
            }
        } catch (error) {
            setErrors(error.response.data.messsage)
        }
    }

    const singin = async (user) => {
        try {
            const res = await loginRequest(user)
            setUser(res.data)
            setIsAuthenticated(true)
        } catch (err) {
            if (Array.isArray(err.response.data.messsage)) {
                return setErrors(err.response.data.messsage)
            }
            setErrors([err.response.data.message])
        }
    }

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const checkLogin = async () => {
            const cookies = Cookies.get();
            // console.log(cookies);
            if (!cookies.token) {
                setIsAuthenticated(false);
                // setLoading(false);
                return;
            }

            try {
                const res = await verifyTokenRequest(cookies.token);
                // console.log(res);
                if (!res.data) return setIsAuthenticated(false);
                setIsAuthenticated(true);
                setUser(res.data);
                // setLoading(false);
            } catch (error) {
                // console.log(error);
                setIsAuthenticated(false);
                // setLoading(false);
            }
        };
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{ signup, singin, logout, user, isAuthenticated, errors }}>
            {children}
        </AuthContext.Provider>
    )
};

