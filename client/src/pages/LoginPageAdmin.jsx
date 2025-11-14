import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPageAdmin = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [adminSecretKey, setAdminSecretKey] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError("");
    try{
      const res = await axios.post("http://localhost:3000/auth/login",{
        email,
        password,
        adminSecretKey
      });
      if(res.status === 201){
        localStorage.setItem("token", res.data.token);
        console.log(res.data.token);
        navigate("/adminDashboard")
      }
    }catch(error){
      if (error.response) {
          console.error("Backend error:", error.response.data.msg);
          alert(error.response.data.msg);  
        } else {
          console.error("Something went wrong:", error.message);
        }
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-300">Sign in to your FilmFlex account</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Admin Secret Key</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              placeholder="Enter your password" 
              value={adminSecretKey}
              onChange={(e)=> setAdminSecretKey(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2 rounded" />
              <span className="text-sm text-gray-300">Remember me</span>
            </div>
            <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Forgot Password?
            </a>
          </div>
          
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-300">
            Don't have an account?{' '}
            <Link to="/registerAdmin" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Create Account
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPageAdmin;