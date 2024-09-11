import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // loading ステートを追加

    useEffect(() => {
        // トークンが存在する場合、ユーザー情報を取得
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/validate_token`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                },
                withCredentials: true
            })
            .then((response) => {
                setUser(response.data.user);
                setIsLoggedIn(true);
            })
            .catch((error) => {
                console.error("Error validating token:", error);
                setIsLoggedIn(false);
            })
            .finally(() => {
                setLoading(false); // ローディング完了
            });
        } else {
            setLoading(false); // トークンがない場合もローディング完了
        }
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        setIsLoggedIn(true);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, token, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};