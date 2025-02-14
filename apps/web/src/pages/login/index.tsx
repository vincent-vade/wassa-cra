import { useState } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';

import { useToaster } from '~/components/Toaster';

import './login.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const toaster = useToaster();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const isAuthenticated = await fakeAuth(email, password);

        if (isAuthenticated) {
            // nookies.set(null, 'token', 'your-auth-token', { path: '/' });

            toaster('Logged. You will be redirected soon...', 'success');

            setTimeout(() => {
                router.push('/projects');
            }, 3000)
        } else {
            toaster('Invalid credentials', 'error');
        }
    };

    return (
        <div className="login container">
            <div className="form-container">
                <h1>Login</h1>
                <form className="form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

const fakeAuth = async (email, password) => {
    return email === 'user@example.com' && password === 'password';
};

export default LoginPage;