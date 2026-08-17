import React, { useEffect, useState } from "react";
import "./Loginpage.css";
import axios from "axios";
import Alert from "../../components/Alert/alert";
import { apiUrlUser } from "../../apiUrl";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aleert, setAlert] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);

   }, []);

  const [errors, setErrors] = useState({});

  //validation

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        }
        break;

      case "password":
        if (!value.trim()) {
          error = "Password is required";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const validateForm = () => {
    let newErrors = {};

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } 

    // Password Validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setErrors("");
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
      }, 2000);

      const users = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      };
      setAlert(null);
      axios
        .post(apiUrlUser + "login", users)
        .then((res) => {

          setAlert({ message: "Login Successful", type: "successAlert" });

          localStorage.setItem("_id", res.data.users._id);
          localStorage.setItem("name", res.data.users.name);
          localStorage.setItem("email", res.data.users.email);
          localStorage.setItem("phone", res.data.users.phone);
          localStorage.setItem("username", res.data.users.username);
          localStorage.setItem("role", res.data.users.role);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("ProfilePic",res.data.users.ProfilePic);
          setTimeout(() => {

          setFormData({
            name: "",
            email: "",
            password: "",
            role: "",
          });

            if (res.data.users.role === "Admin") {
              navigate("/admin/dashboard");
            }

            if (res.data.users.role === "User") {
              navigate("/user/dashboard");
            }

            if (res.data.users.role === "Transport Partner") {
              navigate("/partner/dashboard");
            }
          }, 4000);
        })
        .catch((err) => {
          if (err?.response?.status === 403) {
            setAlert({ message: "Verify Your Email", type: "warningAlert" });
            setTimeout(() => {
              navigate("/verify-otp",{
            state: {
              email: formData.email,
            },
          });
            }, 4000);
          } else if (err?.response?.status === 404) {
            setAlert({ message: "User Not Found (Invalid Details)", type: "warningAlert" });
          } else {
            setAlert({ message: "Login Failed", type: "errorAlert" });
          }
        });
    }
  };

  return (
    <>
      <div className="login-container">
        {aleert && <Alert message={aleert.message} type={aleert.type} />}

        {/* <!-- LEFT PANEL --> */}

        <div className="left-panel">
          <div className="brand">
            <div className="logo">
              <i className="fas fa-truck-moving"></i>
            </div>

            <div>
              <h2>MOVERS & PACKERS</h2>

              <span>Moving Made Simple</span>
            </div>
          </div>

          <div className="hero-content">
            <h1>
              Welcome Back!
              <span>Let's Get Moving</span>
            </h1>

            <p>
              Log in to your account to manage deliveries, track operations and
              access all services.
            </p>

            <div className="features">
              <div className="feature">
                <i className="fas fa-shield-alt"></i>

                <div>
                  <h4>Secure Access</h4>

                  <p>Your data is protected</p>
                </div>
              </div>

              <div className="feature">
                <i className="fas fa-location-dot"></i>

                <div>
                  <h4>Live Tracking</h4>

                  <p>Real-time updates</p>
                </div>
              </div>

              <div className="feature">
                <i className="fas fa-headset"></i>

                <div>
                  <h4>24/7 Support</h4>

                  <p>Always available</p>
                </div>
              </div>
            </div>
          </div>

          <div className="truck-section">
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200"
              alt="Truck"
            />
          </div>
        </div>

        {/* <!-- RIGHT PANEL --> */}

        <div className="right-panel">
          <div className="login-card">
            <div className="user-icon">
              <i className="fas fa-user"></i>
            </div>

            <h2>Login To Your Account</h2>

            <p>Enter your credentials to continue</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Name</label>

                <input
                  type="text"
                  placeholder="Enter Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label>Email</label>

                <input
                  type="text"
                  placeholder="Enter Your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label>Password</label>

                <div className="password-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter Your Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <i
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
                {errors.password && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label>Select Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Choose Role</option>
                  <option value="User">User</option>
                  <option value="Transport Partner">Transport Partner</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>


              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Logging In...
                  </>
                ) : (
                  <>
                    Login
                    <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="register-link">
              Don't have an account?
              <Link to="/register">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
