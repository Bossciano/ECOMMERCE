import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Account = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

        :root {
          --gold: #D4AF37;
          --gold-light: #F4E4C1;
          --gold-dark: #B8941F;
          --charcoal: #1A1A1A;
          --charcoal-light: #2D2D2D;
          --ivory: #FFFFF0;
          --cream: #FAF9F6;
          --champagne: #F7E7CE;
          --white: #FFFFFF;
        }

        .account-page {
          background: linear-gradient(180deg, var(--cream) 0%, var(--white) 50%, var(--champagne) 100%);
          font-family: 'Montserrat', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .account-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 1rem;
        }

        .account-card {
          background: linear-gradient(135deg, var(--white) 0%, var(--cream) 100%);
          border: 2px solid var(--gold);
          border-radius: 1.5rem;
          padding: 3rem;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 12px 48px rgba(212, 175, 55, 0.2);
          animation: fade-slide-up 0.6s ease-out;
          position: relative;
          overflow: hidden;
        }

        .account-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
          animation: rotate-gradient 20s linear infinite;
        }

        @keyframes rotate-gradient {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .account-card-content {
          position: relative;
          z-index: 1;
        }

        .account-logo {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .account-logo-text {
          font-family: 'Libre Baskerville', serif;
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 50%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .account-subtitle {
          font-size: 0.9375rem;
          color: var(--charcoal-light);
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .tab-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
          background: var(--champagne);
          padding: 0.5rem;
          border-radius: 0.75rem;
        }

        .tab-button {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border: none;
          background: transparent;
          color: var(--charcoal-light);
          font-weight: 600;
          font-size: 0.9375rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tab-button.active {
          background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 100%);
          color: var(--ivory);
          box-shadow: 0 4px 16px rgba(26, 26, 26, 0.2);
        }

        .tab-button:not(.active):hover {
          background: var(--gold-light);
          color: var(--charcoal);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--charcoal);
          margin-bottom: 0.625rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1.125rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gold-dark);
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3.25rem;
          border: 2px solid var(--champagne);
          background: var(--white);
          border-radius: 0.75rem;
          font-size: 0.9375rem;
          color: var(--charcoal);
          font-weight: 500;
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--gold);
          background: var(--cream);
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
        }

        .form-input::placeholder {
          color: var(--charcoal-light);
          opacity: 0.6;
        }

        .password-toggle {
          position: absolute;
          right: 1.125rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--charcoal-light);
          cursor: pointer;
          padding: 0.25rem;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: var(--gold-dark);
        }

        .submit-button {
          width: 100%;
          background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 100%);
          color: var(--ivory);
          border: none;
          padding: 1.125rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(26, 26, 26, 0.25);
          position: relative;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .submit-button:hover::before {
          opacity: 1;
        }

        .submit-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(26, 26, 26, 0.35);
        }

        .submit-button span {
          position: relative;
          z-index: 1;
        }

        .divider {
          position: relative;
          text-align: center;
          margin: 2rem 0;
        }

        .divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--champagne), transparent);
        }

        .divider-text {
          position: relative;
          background: var(--cream);
          padding: 0 1rem;
          color: var(--charcoal-light);
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .social-login {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .social-button {
          padding: 0.875rem 1rem;
          border: 2px solid var(--champagne);
          background: var(--white);
          border-radius: 0.625rem;
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--charcoal);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .social-button:hover {
          background: var(--champagne);
          border-color: var(--gold);
          transform: translateY(-2px);
        }

        .forgot-password {
          text-align: right;
          margin-top: 0.75rem;
        }

        .forgot-password-link {
          color: var(--gold-dark);
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password-link:hover {
          color: var(--charcoal);
          text-decoration: underline;
        }

        .terms-text {
          font-size: 0.8125rem;
          color: var(--charcoal-light);
          text-align: center;
          margin-top: 1.5rem;
          line-height: 1.6;
        }

        .terms-link {
          color: var(--gold-dark);
          font-weight: 600;
          text-decoration: none;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          padding: 0.875rem;
          background: linear-gradient(135deg, var(--champagne) 0%, var(--gold-light) 100%);
          border-radius: 0.625rem;
          border: 1px solid var(--gold);
        }

        .security-badge-icon {
          color: var(--gold-dark);
        }

        .security-badge-text {
          color: var(--charcoal);
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .welcome-message {
          text-align: center;
          margin-bottom: 2rem;
        }

        .welcome-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          color: var(--charcoal-light);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        @media (max-width: 640px) {
          .account-card {
            padding: 2rem 1.5rem;
          }

          .account-logo-text {
            font-size: 2rem;
          }

          .social-login {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="account-page">
        <Navbar />
        
        <div className="account-container">
          <div className="account-card">
            <div className="account-card-content">
              {/* Logo */}
              <div className="account-logo">
                <Link to="/">
                  <h1 className="account-logo-text">ÉLÉGANCE</h1>
                </Link>
                <p className="account-subtitle">Curated Luxury Experience</p>
              </div>

              {/* Tabs */}
              <div className="tab-container">
                <button
                  className={`tab-button ${isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={`tab-button ${!isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>

              {/* Welcome Message */}
              <div className="welcome-message">
                <h2 className="welcome-title">
                  {isLogin ? 'Welcome Back' : 'Join Our Circle'}
                </h2>
                <p className="welcome-subtitle">
                  {isLogin 
                    ? 'Continue your journey of refined elegance' 
                    : 'Begin your luxury shopping experience'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Full Name
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon h-5 w-5" strokeWidth={1.5} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="form-input"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <Mail className="input-icon h-5 w-5" strokeWidth={1.5} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <div className="input-wrapper">
                    <Lock className="input-icon h-5 w-5" strokeWidth={1.5} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                      ) : (
                        <Eye className="h-5 w-5" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="input-wrapper">
                      <Lock className="input-icon h-5 w-5" strokeWidth={1.5} />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="form-input"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="forgot-password">
                    <Link to="/forgot-password" className="forgot-password-link">
                      Forgot Password?
                    </Link>
                  </div>
                )}

                <button type="submit" className="submit-button">
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </button>
              </form>

              {/* Divider */}
              <div className="divider">
                <span className="divider-text">Or continue with</span>
              </div>

              {/* Social Login */}
              <div className="social-login">
                <button className="social-button">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button className="social-button">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>

              {/* Terms */}
              {!isLogin && (
                <p className="terms-text">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="terms-link">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                </p>
              )}

              {/* Security Badge */}
              <div className="security-badge">
                <Shield className="security-badge-icon h-5 w-5" strokeWidth={1.5} />
                <span className="security-badge-text">Secure & Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Account;
