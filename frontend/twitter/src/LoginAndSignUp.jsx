import React, { useState, useEffect } from 'react';
import './output.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faEnvelope, 
    faLock, 
    faUserCircle, 
} from '@fortawesome/free-solid-svg-icons';

import { faTwitter} from '@fortawesome/free-brands-svg-icons';



const DisplayError = ({ error, details }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
      <p>{error}</p>
      {details && details.map((detail, index) => (
        <p key={index} className="text-sm mt-1">{detail}</p>
      ))}
    </div>
  );

const SignupPage = ({onLoginClick, onSignupSuccess})=>{
    const [formInfo, setFormInfo] = useState({
        fullName: '', username:'', email: '', password: ''
    });

    const [error, setError] = useState([]);
    const[loading, setLoading] = useState(false);

    const handleChange =(e) =>{
        setFormInfo({...formInfo, [e.target.name]: e.target.value});
        setError (null);
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setError(null);

        try{
            const response = await fetch('http://localhost:3001/api/v1/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formInfo),
                credentials: 'include'
              });
            
              let data;
              const contentType = response.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                  data = await response.json();
              } else {
                  throw new Error("Server returned non-JSON response");
              }
            if (!response.ok){
                setError({
                    message: data.error || 'Signup failed',
                    details: data.details || []
                });
                return;
            }

            if (onSignupSuccess){
                onSignupSuccess(data.user);
            }
        }catch(error){
            console.error('Signup error:', error);
            setError({
                message: 'Network error or invalid response',
                details: [error.message]
            });
        }finally{
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50  ">
        <div className="flex flex-col justify-center p- space-y-6 bg-white shadow-lg rounded-lg max-w-md w-full">
          

         
          <div className="flex flex-col justify-center  p-8 space-y-6">
        
    
            <div className="mb-8 justify-center">
                <FontAwesomeIcon icon={faTwitter} size="3x" color="#0ea5e9" /> 
             <h2 className="text-2xl font-bold justify center">Join the community today.</h2>
             
            </div>
    
            {error && (
              <div >
                <p>{error.message}</p>
                {error.details && error.details.map((detail, index) => (
                  <p key={index} className="text-sm mt-1">{detail}</p>
                ))}
              </div>
            )}
    
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
           
    
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Username"
                  value={formInfo.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Full name"
                  value={formInfo.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  value={formInfo.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
    
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={formInfo.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
    
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gray-800 text-white font-bold hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>
    
            <div className="mt-8">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={onLoginClick}
                  className="text-blue-500 hover:underline"
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
        </div>
      );
    };
  
  

const LoginPage = ({onSignupClick, onLoginSuccess}) =>{
    const[formData, setFormData] = useState({
        username: '', password: ''
    });

    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const handleChange = (event) =>{
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setError(null);
    }

    const handleSubmit = async(event) =>{
        event.preventDefault();
        setLoading(true);
        setError(null);

        try{
            const response = await fetch('http://localhost:3001/api/v1/auth/login',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'  
            });

            const data = await response.json();
            if (!response.ok){
                setError({
                    message: data.error,
                    details: data.details 
                });
                return;
            }

            if (onLoginSuccess){
                onLoginSuccess(data.user);
            }

        }catch(error){
            console.error('Signup error:', error);
            setError({
                message: 'Network error or invalid response',
                details: [error.message]
            });
        }finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
          <div className="w-full max-w-md">
            
            <div className="bg-white px-6 py-8 rounded-lg shadow-md">
              {/* Header */}
              <FontAwesomeIcon icon={faTwitter} size="3x" color="#0ea5e9" /> 
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                
              </div>
    
           
              {error && (
                <div className="mb-4  text-red-700 px-4 py-3 rounded relative">
                  <p className="font-medium">{error.message}</p>
                  {error.details && error.details.map((detail, index) => (
                    <p key={index} className="text-sm">{detail}</p>
                  ))}
                </div>
              )}
     
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label 
                    htmlFor="username" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username: 
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-blue-500"
                    placeholder="Enter your username"
                  />
                </div>
    
                {/* Password Field */}
                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password: 
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                </div>
    
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md
                           font-medium hover:bg-blue-700 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition duration-200"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>
    
              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={onSignupClick}
                    className="text-blue-600 hover:text-blue-700 font-medium
                             focus:outline-none focus:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const LoggedInPage = ({ user, onLogout }) =>{
        const [error, setError] = useState([]);
        const handleLogout = async () => {
            try {
              const response = await fetch('http://localhost:3001/api/v1/auth/logout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                
                },
                credentials: 'include'
              });

        
              const data = await response.json();
              if (!response.ok) {
                throw new Error(data.error || 'Failed to logout');
                
              }
              onLogout();
            }catch(error){
                console.error('Logout error:', error);
                setError({
                    message: 'Network error or invalid response',
                    details: [error.message]
                });
            }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl max-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="hidden md:flex bg-blue-500 items-center justify-center p-8">
              <FontAwesomeIcon icon={faTwitter} size="3x" color="#0ea5e9" />
            </div>
    
            <div className="flex flex-col justify-center p-8 space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold">Welcome, {user.username}!</h2>
                <p className="text-gray-600 mt-2">You're now logged in.</p>
              </div>
    
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-full bg-black text-white font-bold 
                         hover:bg-gray-900 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-gray-900 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      );
};
    
 
   
export { SignupPage, LoginPage, LoggedInPage};

