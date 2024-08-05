import { createContext, useState, useContext, useEffect } from 'react';
import { registerRequest, loginRequest, verifyTokenRequest, getAllUsersRequest, getUserByIdentiRequest, updateUserRequest, deleteUserRequest } from '../api/auth';
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);

    // Clear errors after 5 seconds
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
            const res = await registerRequest(user);
            if (res.status === 200) {
                return { success: true, message: 'Usuario creado exitosamente' };
            }
        } catch (err) {
            let errorMessages = [];
    
            if (Array.isArray(err.response.data.message)) {
                errorMessages = err.response.data.message;
            } else {
                errorMessages = [err.response.data.message];
            }
    
            setErrors(errorMessages);
            return { success: false, message: errorMessages.join(', ') };
        }
    };

    const singin = async (user) => {
        try {
            const res = await loginRequest(user);
            Cookies.set('token', res.data.token);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (err) {
            if (Array.isArray(err.response.data.message)) {
                return setErrors(err.response.data.message);
            }
            setErrors([err.response.data.message]);
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        setIsAuthenticated(false);
    };

    const getAllUsers = async () => {
        try {
            const res = await getAllUsersRequest();
            setUsers(res.data);
        } catch (error) {
            setErrors([error.response.data.message]);
        }
    };

    const getUserByIdenti = async (cedulaRUC) => {
        try {
            const res = await getUserByIdentiRequest(cedulaRUC);
            setUser(res.data);
        } catch (error) {
            setErrors([error.response.data.message]);
        }
    };

    const updateUser = async (user) => {
        try {
            const res = await updateUserRequest(user);
            if (res.status === 200) {
                await getAllUsers(); // Refresh the user list
                return { success: true, message: 'Usuario actualizado exitosamente' };
            }
        } catch (err) {
            let errorMessages = [];
    
            if (Array.isArray(err.response.data.message)) {
                errorMessages = err.response.data.message;
            } else {
                errorMessages = [err.response.data.message];
            }
    
            setErrors(errorMessages);
            return { success: false, message: errorMessages.join(', ') };
        }
    };

    const deleteUser = async (identidad) => {
        try {
            const res = await deleteUserRequest(identidad);
            if (res.status === 200) {
                await getAllUsers(); // Refresh the user list
                return { success: true, message: 'Usuario eliminado exitosamente' };
            }
        } catch (err) {
            let errorMessages = [];
    
            if (Array.isArray(err.response.data.message)) {
                errorMessages = err.response.data.message;
            } else {
                errorMessages = [err.response.data.message];
            }
            
            setErrors(errorMessages);
            return { success: false, message: errorMessages.join(', ') };
        }
    };

    useEffect(() => {
        const checkLogin = async () => {
            const cookies = Cookies.get();
            if (!cookies.token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const res = await verifyTokenRequest(cookies.token);
                if (!res.data) return setIsAuthenticated(false);
                setIsAuthenticated(true);
                setUser(res.data);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{ signup, singin, logout, getAllUsers, getUserByIdenti, updateUser, deleteUser, user, users, isAuthenticated, errors }}>
            {children}
        </AuthContext.Provider>
    );
};
