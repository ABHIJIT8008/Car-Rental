// File Path: frontend/src/pages/AuthPage.jsx

import React, { useState } from 'react';
import { Car, LoaderCircle } from 'lucide-react';

const AuthPage = ({ handleAuth, apiError, isLoading }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [role, setRole] = useState('user');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isRegister ? 'register' : 'login';
    const payload = isRegister ? { ...formData, role } : formData;
    handleAuth(endpoint, payload);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-6">
          <Car size={32} />
          <h1 className="ml-3 text-3xl font-bold tracking-tight">RideLink</h1>
        </div>
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-1 text-center">{isRegister ? 'Create an Account' : 'Welcome Back'}</h2>
          <p className="text-gray-400 mb-6 text-center">{isRegister ? 'Sign up to start your journey.' : 'Sign in to continue.'}</p>
          
          {apiError && <p className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{apiError}</p>}

          {isRegister && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => setRole('user')} 
                className={`py-3 px-4 rounded-lg text-center font-semibold transition ${role === 'user' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                I'm a User
              </button>
              <button 
                onClick={() => setRole('driver')} 
                className={`py-3 px-4 rounded-lg text-center font-semibold transition ${role === 'driver' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                I'm a Driver
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                <input type="text" name="name" id="name" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 px-4" onChange={handleChange} />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
              <input type="email" name="email" id="email" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 px-4" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <input type="password" name="password" id="password" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 px-4" onChange={handleChange} />
            </div>
            <button type="submit" disabled={isLoading} className="w-full h-12 flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400">
              {isLoading ? <LoaderCircle className="animate-spin" /> : (isRegister ? 'Create Account' : 'Sign In')}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-400">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => { setIsRegister(!isRegister); }} className="font-medium text-indigo-400 hover:text-indigo-300">
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

