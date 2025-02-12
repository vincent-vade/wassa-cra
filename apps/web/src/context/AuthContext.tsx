import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const cookies = nookies.get();
        const token = cookies.token;

        if (token) {
            // Fetch user data with token
            setUser({ token });
        } else {
            // router.push('/login');
        }
    }, []);

    const login = (token) => {
        nookies.set(null, 'token', 'your-auth-token', { path: '/' });
        setUser({ token });
        router.push('/');
    };

    const logout = () => {
        nookies.destroy(null, 'token');
        // Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);