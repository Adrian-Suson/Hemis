import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../utils/config";
import { Eye, EyeOff, Lock, Mail, ExternalLink, Sparkles, Shield } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formFocus, setFormFocus] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Background particles state
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);

    // Generate random particles for background
    const newParticles = Array(15).fill().map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2, // Even smaller size range
      speed: Math.random() * 20 + 15, // More consistent speed
      opacity: Math.random() * 0.2 + 0.1, // Lower opacity for subtlety
      color: i % 5 === 0 ? '#3b82f6' : i % 3 === 0 ? '#818cf8' : '#c4b5fd',
      phase: Math.random() * Math.PI * 2 // Random starting phase for each particle
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Ultra-smooth floating animation for particles
    const interval = setInterval(() => {
      const time = Date.now() / 2000; // Slower base time
      setParticles(prev => prev.map(particle => {
        const xPhase = time / (particle.speed * 0.5) + particle.phase;
        const yPhase = time / (particle.speed * 0.7) + particle.phase;

        return {
          ...particle,
          x: (particle.x + 0.01 * Math.sin(xPhase)) % 100,
          y: (particle.y + 0.01 * Math.cos(yPhase)) % 100,
          opacity: 0.1 + Math.abs(Math.sin(time / 8)) * 0.15 // Very subtle opacity change
        };
      }));
    }, 20); // Even faster update interval for ultra-smooth animation

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    setLoginAttempt(prev => prev + 1);

    if (!email || !password) {
      setError("Please fill in both fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${config.API_URL}/auth/login`,
        { email, password }
      );

      const token = response.data.data.token;
      const user = response.data.data.user;
      const institution = response.data.data.institution;

      // Check if the user is inactive
      if (user.status === "Inactive") {
        setError("Your account is inactive. Please contact support.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("institution", JSON.stringify(institution));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect based on user role
      switch (user.role) {
        case "super-admin":
          navigate("/super-admin/dashboard");
          break;
        case "hei-admin":
          navigate("/hei-admin/dashboard");
          break;
        case "hei-staff":
          navigate("/hei-staff/dashboard");
          break;
        default:
          setError("Unknown role. Please contact support.");
          localStorage.clear(); // Clear invalid login
          break;
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getRandomDelay = () => {
    return Math.random() * 0.5 + 0.1;
  };

  return (
    <div className="min-h-screen w-full flex items-stretch overflow-hidden relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/src/assets/cover.jpg')" }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Animated background particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity * 0.5, // Reduced opacity for better visibility with image
            transition: 'opacity 2s ease-in-out',
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Left panel with animated content */}
      <div
        className={`hidden lg:flex lg:w-3/5 relative overflow-hidden flex-col justify-center items-start px-16 transition-all duration-1000 ease-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-indigo-900/10" />

        {/* Animated shapes */}
        <div className="absolute right-0 top-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-500/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
             style={{animation: 'float 15s ease-in-out infinite'}}/>
        <div className="absolute right-1/4 bottom-1/4 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
             style={{animation: 'float 18s ease-in-out infinite 2s'}}/>

        {/* Content with staggered animations */}
        <div className="relative z-10 max-w-xl">
          <div
            className={`transform transition-all duration-1000 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center mb-6">
              <Sparkles className="text-yellow-400 h-8 w-8 mr-3" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                CHED Region IX
              </h1>
            </div>

            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full mb-8" />
          </div>

          <div
            className={`transform transition-all duration-1000 delay-500 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-2xl font-semibold text-white/90 mb-4">Higher Education Management System</h2>
            <p className="text-xl font-light mb-8 text-blue-100">Zamboanga Peninsula&#39;s innovative platform for educational excellence</p>
          </div>

          <div
            className={`transform transition-all duration-1000 delay-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >

          </div>

          <div
            className={`mt-12 transform transition-all duration-1000 delay-1000 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex space-x-4">
              {['Efficiency', 'Innovation', 'Excellence', 'Collaboration'].map((value, i) => (
                <div
                  key={value}
                  className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/90 border border-white/20 backdrop-blur-sm"
                  style={{
                    animation: animationComplete ? `pulse 3s infinite ${i * 0.7}s` : 'none',
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel with login form */}
      <div
        className={`w-full lg:w-2/5 flex items-center justify-center transition-all duration-1000 ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        }`}
      >
        <div className="w-full max-w-md px-8 py-10 sm:px-12 sm:py-12 relative">
          {/* Floating card effect */}
          <div
            className={`absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl transform transition-all duration-500 ${
              formFocus ? "scale-[1.02] shadow-blue-500/20" : "scale-100"
            }`}
          />

          <div className="relative z-10">
            <div
              className="flex flex-col items-center mb-10 transition-all duration-700"
              style={{ transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}
            >
              <div
                className="relative transform transition-all duration-700 hover:scale-105"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                {/* Glowing effect */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-75 blur-md" />
                <div className="relative bg-gradient-to-br from-yellow-100 to-yellow-400 p-2 rounded-full border-2 border-white/30 shadow-xl backdrop-blur-sm">
                  <div className="relative overflow-hidden rounded-full w-28 h-28 group">
                    <img
                      src="/src/assets/ChedLogo.png"
                      alt="CHED Region 9 Logo"
                      className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110"
                    />

                  </div>
                </div>
              </div>

              <h2 className="mt-8 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 text-center transition-all duration-700 delay-200">
                Welcome Back
              </h2>
              <p className="mt-2 text-blue-100/80 text-center transition-all duration-700 delay-300">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-6 overflow-hidden rounded-xl animate-fadeIn">
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 p-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-red-500/30">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm">{error}</p>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          type="button"
                          className="inline-flex rounded-md p-1.5 text-red-300 hover:bg-red-400/20 transition-all duration-300 focus:outline-none"
                          onClick={() => setError("")}
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="space-y-6"
              onFocus={() => setFormFocus(true)}
              onBlur={() => setFormFocus(false)}
            >
              <div
                className="transition-all duration-500"
                style={{
                  transitionDelay: `${getRandomDelay()}s`,
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                  opacity: mounted ? 1 : 0
                }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-blue-100 mb-1"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 rounded-lg opacity-0 group-focus-within:opacity-100 -z-10  transition-all duration-500"></div>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-300">
                    <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="bg-white/10 border border-white/30 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 block w-full pl-10 p-4 shadow-lg transition-all backdrop- placeholder-blue-200/50"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    style={{
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
              </div>

              <div
                className="transition-all duration-500"
                style={{
                  transitionDelay: `${getRandomDelay() + 0.2}s`,
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                  opacity: mounted ? 1 : 0
                }}
              >
                <div className="flex justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-blue-100 mb-1"
                  >
                    Password
                  </label>

                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 rounded-lg opacity-0 group-focus-within:opacity-100 -z-10 transition-all duration-500"></div>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="bg-white/10 border border-white/30 text-white text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 block w-full pl-10 pr-10 p-4 shadow-lg transition-all placeholder-blue-200/50"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    style={{
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-blue-300 hover:text-blue-200 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-blue-300 hover:text-blue-200 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div
                className="pt-2 transition-all duration-500"
                style={{
                  transitionDelay: `${getRandomDelay() + 0.4}s`,
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                  opacity: mounted ? 1 : 0
                }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:ring-4 focus:ring-blue-300/50 text-white font-medium rounded-lg text-base px-5 py-4 transition-all duration-300 ease-out disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 overflow-hidden"
                >
                  {/* Button background animation */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-slow transition-opacity"></span>

                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-yellow-400/20 to-yellow-400/0 transition-all duration-500 ease-out group-hover:w-full"></span>

                  <span className="relative flex items-center justify-center">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Securing access...</span>
                      </div>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        <span>Sign in to Dashboard</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Login attempt indicator */}
                {loginAttempt > 0 && (
                  <div className="mt-3 flex justify-center space-x-1">
                    {Array(loginAttempt).fill().map((_, i) => (
                      <div
                        key={i}
                        className="h-1 w-1 rounded-full bg-blue-400/60"
                        style={{
                          animation: `pulse 1.5s infinite ${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </form>

            <div
              className="mt-8 text-center transition-all duration-500"
              style={{
                transitionDelay: `${getRandomDelay() + 0.6}s`,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                opacity: mounted ? 1 : 0
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-200/80 backdrop-blur-sm rounded-md">
                    System Information
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <p className="text-sm text-blue-200/70">
                  Powered by{" "}
                  <a
                    href="https://chedro9.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 font-medium inline-flex items-center group transition-all duration-300"
                  >
                    <span className="relative">
                      CHED Region 9
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-300 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <ExternalLink className="ml-1 h-3.5 w-3.5 text-blue-300 group-hover:text-blue-200 transition-colors" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.3; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
