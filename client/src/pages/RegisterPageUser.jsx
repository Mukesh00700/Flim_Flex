import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPageUser = () => {
  const [fullName, setFullName] = useState(\"\");
  const [email, setEmail] = useState(\"\");
  const [password, setPassword] = useState(\"\");
  const [confirmPassword, setConfirmPassword] = useState(\"\");
  const [error, setError] = useState(\"\");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(\"\");
  const [registeredEmail, setRegisteredEmail] = useState(\"\");
  const [isVerifying, setIsVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState(\"\");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com|protonmail\.com)$/;

    if (!emailRegex.test(email)) {
      console.log(
        "Invalid email address. Use a valid domain like Gmail, Hotmail, Yahoo, etc."
      );
      setError("invalid email");
      return;
    } else {
      console.log("Valid email address!");
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

      if (res.status === 201 && res.data.requiresVerification) {
        // Show OTP input section
        setRegisteredEmail(email);
        setShowOtpInput(true);
        setSuccessMessage(res.data.message);
        setError(\"\");
      }
    } catch (error) {
      if (error.response) {
        console.error(\"Backend error:\", error.response.data.msg);
        setError(error.response.data.msg);
      } else {
        console.error(\"Something went wrong:\", error.message);
        setError(\"Registration failed. Please try again.\");
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(\"\");
    setIsVerifying(true);

    if (otp.length !== 6) {
      setError(\"OTP must be 6 digits\");
      setIsVerifying(false);
      return;
    }

    try {
      const res = await axios.post(\"http://localhost:3000/auth/verify-email\", {
        email: registeredEmail,
        otp: otp,
      });

      if (res.status === 200 && res.data.success) {
        setSuccessMessage(res.data.msg);
        setTimeout(() => {
          navigate(\"/login\");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg);
      } else {
        setError(\"Verification failed. Please try again.\");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setError(\"\");
    try {
      const res = await axios.post(\"http://localhost:3000/auth/resend-verification\", {
        email: registeredEmail,
      });

      if (res.status === 200) {
        setSuccessMessage(res.data.msg);
        setTimeout(() => setSuccessMessage(\"\"), 3000);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg);
      } else {
        setError(\"Failed to resend OTP. Please try again.\");
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
      console.log("token is ", token);
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Google Sign-In failed. Try again.");
    }
  };

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6\">
      <div className=\"bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20\">
        <div className=\"text-center mb-8\">
          <h2 className=\"text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2\">
            {showOtpInput ? \"Verify Your Email\" : \"Join FilmFlex\"}
          </h2>
          <p className=\"text-gray-300\">
            {showOtpInput 
              ? \"Enter the OTP sent to your email\" 
              : \"Create your account to start booking\"}
          </p>
        </div>

        {error && (
          <p className=\"bg-red-500 text-white text-sm p-2 rounded mb-4\">
            {error}
          </p>
        )}

        {successMessage && (
          <p className=\"bg-green-500 text-white text-sm p-2 rounded mb-4\">
            {successMessage}
          </p>
        )}

        {showOtpInput ? (
          /* OTP Verification Form */
          <form className=\"space-y-6\" onSubmit={handleVerifyOtp}>
            <div>
              <label className=\"block text-gray-300 mb-2 font-medium\">
                Enter 6-Digit OTP
              </label>
              <input
                type=\"text\"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\\D/g, '').slice(0, 6))}
                className=\"w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all\"
                placeholder=\"000000\"
                maxLength=\"6\"
                required
              />
              <p className=\"text-gray-400 text-sm mt-2 text-center\">
                Sent to: {registeredEmail}
              </p>
            </div>

            <button
              type=\"submit\"
              disabled={isVerifying || otp.length !== 6}
              className=\"w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100\"
            >
              {isVerifying ? \"Verifying...\" : \"Verify Email\"}
            </button>

            <div className=\"text-center\">
              <button
                type=\"button\"
                onClick={handleResendOtp}
                className=\"text-purple-400 hover:text-purple-300 text-sm transition-colors\"
              >
                Didn't receive OTP? Resend
              </button>
            </div>
          </form>
        ) : (
          /* Registration Form */
          <>
            <div className=\"mb-6\">
              <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={() => setError("Google Sign-In failed.")}
            useOneTap
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign up with Google
              </button>
            )}
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
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="mr-3 rounded" required />
            <span className="text-sm text-gray-300">
              I agree to the{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </a>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        </>
      )}
      </div>
    </div>
  );
};

export default RegisterPageUser;
