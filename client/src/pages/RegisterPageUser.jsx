import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const RegisterPageUser = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com|protonmail\.com)$/;

    if (!emailRegex.test(email)) {
      setError("Invalid email");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/auth/register", {
        name: fullName,
        email,
        password,
      });

      if (res.status === 201) {
        setSuccessMessage("Registration successful!");
        console.log("from RegisterAdminPage", res.data.token);
        navigate("/loginUser");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axios.post("http://localhost:3000/auth/google", {
        token,
      });
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      navigate("/");
    } catch (err) {
      setError("Google Sign-In failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Join FilmFlex
          </h2>
          <p className="text-gray-300">Create your account to start booking</p>
        </div>

        {error && (
          <p className="bg-red-500 text-white text-sm p-2 rounded mb-4">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="bg-green-500 text-white text-sm p-2 rounded mb-4">
            {successMessage}
          </p>
        )}

        <div className="mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={() => setError("Google Sign-In failed.")}
            useOneTap
          />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="mr-3" required />
            <span className="text-sm text-gray-300">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-gray-300 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPageUser;
