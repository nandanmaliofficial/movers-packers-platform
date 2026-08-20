import "./Registerpage.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrlUser } from "../../apiUrl";
import Alert from "../../components/Alert/alert";

const RegisterPage = () => {
  const [step, setStep] = useState(1);

  const [profilePreview, setProfilePreview] = useState();

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [aleert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    role: "",
    address: "",
    file:null,
  });

  const [circle1, setCircle1] = useState("step-circle active");
  const [circle2, setCircle2] = useState("step-circle");

  const navigate = useNavigate();

  // =========================
  // NEXT STEP
  // =========================

  const nextStep = () => {
    setStep(2);
    setCircle1("step-circle");
    setCircle2("step-circle active");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setErrors("");
  };

  // =========================
  // BACK STEP
  // =========================

  const backStep = () => {
    setStep(1);
    setCircle2("step-circle");
    setCircle1("step-circle active");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setErrors("");
  };

  // =========================
  // IMAGE PREVIEW
  // =========================

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    
    setFormData((prev)=>({...prev,file}));

    validateField("file",file);

    const reader = new FileReader();

    reader.onload = (e) => {
      setProfilePreview(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // PASSWORD STRENGTH
  // =========================

  const getStrength = () => {
    let strength = 0,
      colorr,
      message;

    if (formData.password.length >= 6) strength += 25;

    if (formData.password.length >= 8) {
      strength += 25;
    }

    if (/[A-Z]/.test(formData.password) && formData.password.length >= 4) {
      strength += 25;
    }

    if (/[0-9]/.test(formData.password) && formData.password.length >= 4) {
      strength += 25;
    }
    if (strength === 0) {
      colorr = "#fff";
    } else if (strength <= 25) {
      colorr = "#ef4444";
      message = "Poor Password";
    } else if (strength <= 50) {
      colorr = "#f59e0b";
      message = "Good Password";
    } else if (strength <= 75) {
      colorr = "#3b82f6";
      message = "Strong Password";
    } else {
      colorr = "#22c55e";
      message = "Very Strong Password";
    }

    return { strength, colorr, message };
  };

  const strength = getStrength();

  // =========================
  // PASSWORD MATCH
  // =========================
  const passwordMatch =
    formData.password === confirmPassword && confirmPassword !== "";

  const [errors, setErrors] = useState({});

  //validation

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (!(value.length >= 3)) {
          error = "Name is too small";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = "Invalid email";
        } else if (existingEmails.includes(formData.email.toLowerCase())) {
          error = "Email already registered";
        }
        break;

      case "username":
        if (!value.trim()) {
          error = "Username is required";
        } else if (!(value.length >= 5)) {
          error = "Username is too small";
        } else if (existingUsernames.includes(formData.email.toLowerCase())) {
          error = "Email already registered";}
      break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^\d+$/.test(value)) {
          error = "Only numbers are allowed";
        } else if (!(value.length === 10)) {
          error = "Enter a valid 10-digit number";
        }
        break;

      case "password":
        if (!value.trim()) {
          error = "Password is required";
        } else if (!(value.length >= 5)) {
          error = "Password is too small";
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
  const [existingEmails,setExistingsEmail]=useState([]);
  const [existingUsernames,setExistingsUsernames]=useState([]);
  useEffect(()=>{ 
    axios.get(apiUrlUser+"fetch").then((res)=>{
       const users=res.data;
      
            const existingEmail = [];
          
            const existingUsername = [];

      for (let user of users){
        existingEmail.push(user.email);
        existingUsername.push(user.username);
      }

      setExistingsEmail(existingEmail);
      setExistingsUsernames(existingUsername);
      }).catch(()=>{

      })
},[]);
  const validateForm = () => {
    let newErrors = {};

    const errorField = () => {
      setStep(1);
      setCircle2("step-circle");
      setCircle1("step-circle active");
      window.scrollTo({
        top: 300,
        behavior: "smooth",
      });
    };

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      errorField();
    } else if (!(formData.name.length >= 3)) {
      newErrors.name = "Name is too small";
      errorField();
    }
    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      errorField();
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email";
      errorField();
    } else if (existingEmails.includes(formData.email.toLowerCase())) {
      newErrors.email = "Email already registered";
      errorField();
    }

    // Username Validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      errorField();
    } else if (existingUsernames.includes(formData.username.toLowerCase())) {
      newErrors.username = "Username already registered";
      errorField();
    } else if (!(formData.username.length >= 5)) {
      newErrors.username = "UserName is too small";
      errorField();
    }

    // Phone Validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      errorField();
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Only numbers are allowed";
      errorField();
    } else if (!(formData.phone.length === 10)) {
      newErrors.phone = "Enter a valid 10-digit number";
      errorField();
    }

    // Password Validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      window.scrollTo({
        top: 300,
        behavior: "smooth",
      });
    } else if (!(formData.password.length >= 5)) {
      newErrors.password = "Password is too small";
      window.scrollTo({
        top: 300,
        behavior: "smooth",
      });
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()  &&  passwordMatch) {
      setErrors("");
    setAlert(null);

    const formdata1=new FormData();
    formdata1.append("name",formData.name);
    formdata1.append("email",formData.email);
    formdata1.append("username",formData.username);
    formdata1.append("phone",formData.phone);
    formdata1.append("role",formData.role);
    if (formData.file) {
      formdata1.append("file", formData.file);
    }
    formdata1.append("password",formData.password);
    formdata1.append("address",formData.address);
    
    axios.post(apiUrlUser + "save", formdata1)
      .then((res) => {
        setAlert({ message: "Registration Successful", type: "successAlert" });

        setTimeout(() => {
          //verify otp
          // navigate("/verify-otp", {
          //   state: {
          //     email: formData.email,
          //   },
          // });

          setFormData({
            name: "",
            username: "",
            email: "",
            phone: "",
            role: "",
            password: "",
            address: "",
            file:null
          });
          setConfirmPassword("");
        }, 4000);
      })
      .catch((err) => {
        setAlert({ message: "Registration Failed", type: "errorAlert" });
      });}
  };

  useEffect(() => {
    document.body.style.opacity = "1";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="body1">
        {aleert && <Alert message={aleert.message} type={aleert.type} />}

        <div className="registercontainer">
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
              <span className="badge">Trusted Logistics Platform</span>

              <h1>
                Your Journey
                <span>Starts Here</span>
              </h1>

              <p>
                Join our professional movers and packers network. Manage
                deliveries, track operations and access services from one secure
                platform.
              </p>

              <div className="features">
                <div className="feature-card">
                  <i className="fas fa-shield-alt"></i>

                  <div>
                    <h4>Secure Access</h4>
                    <p>Protected account system</p>
                  </div>
                </div>

                <div className="feature-card">
                  <i className="fas fa-location-dot"></i>

                  <div>
                    <h4>Live Tracking</h4>
                    <p>Track operations instantly</p>
                  </div>
                </div>

                <div className="feature-card">
                  <i className="fas fa-headset"></i>

                  <div>
                    <h4>24/7 Support</h4>
                    <p>Always available for help</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="illustration">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200"
                alt="Truck"
              />
            </div>
          </div>

          {/* <!-- RIGHT PANEL --> */}

          <div className="right-panel">
            {/* <!-- Progress --> */}

            <div className="progress-wrapper">
              <div className={circle1}>1</div>

              <div className="progress-line"></div>

              <div className={circle2}>2</div>
            </div>

            {/* <!-- STEP 1 --> */}

            <div className={step === 1 ? "form-step active" : "form-step"}>
              <div className="form-header">
                <span>STEP 1 OF 2</span>

                <h2>Create Your Account</h2>

                <p>Enter your basic information</p>
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label>Full Name</label>

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
                  <label>Username</label>

                  <input
                    type="text"
                    placeholder="Choose Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <span className="error" style={{ color: "red" }}>
                      {errors.username}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    placeholder="Enter Email"
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
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <span className="error" style={{ color: "red" }}>
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="role-section">
                <h3>Choose Access Level</h3>

                <div className="role-cards">
                  <div
                    className={`role-card ${formData.role === "User" ? "active" : ""}`}
                    onClick={() =>
                      handleChange({ target: { name: "role", value: "User" } })
                    }
                  >
                    <i className="fas fa-user"></i>

                    <h4>User</h4>

                    <span>Standard Access</span>
                  </div>

                  <div
                    className={`role-card ${formData.role === "Transport Partner" ? "active" : ""}`}
                    onClick={() =>
                      handleChange({
                        target: { name: "role", value: "Transport Partner" },
                      })
                    }
                  >
                    <i className="fas fa-user-tie"></i>

                    <h4>Transport Partner</h4>

                    <span>Transport Operations</span>
                  </div>


                </div>
              </div>

              <button className="next-btn" id="nextBtn" onClick={nextStep}>
                Next Step
                <i className="fas fa-arrow-right"></i>
              </button>
<br/><br/>
             <div className="register-link">
              Already have an account?&nbsp;
              <Link to="/login">Login In</Link>
            </div>

            </div>
            <div >
              {/* <!-- STEP 2 --> */}

              <div className={step === 2 ? "form-step active" : "form-step"}>
                <div className="form-header">
                  <span>STEP 2 OF 2</span>

                  <h2>Complete Profile</h2>

                  <p>Set up your profile and security</p>
                </div>

                {/* <!-- Upload --> */}

                <div className="upload-section">
                  <div className="avatar-preview">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="profile"
                        style={{ display: "block" }}
                      />
                    ) : (
                      <i className="fas fa-camera"></i>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    name="file"
                    onChange={handleImageUpload}
                    id="profileImage"
                  />

                  <label htmlFor="profileImage" className="upload-btn">
                    Upload Profile Image
                  </label>
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="password-box">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Create Password"
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

                <div className="strength-wrapper">
                  <span>Password Strength</span>

                  <div className="strength-bar">
                    <div
                      id="strengthFill"
                      style={{
                        width: `${strength.strength}%`,
                        background: `${strength.colorr}`,
                      }}
                    ></div>
                  </div>
                  <h5 style={{ color: `${strength.colorr}` }}>
                    {strength.message}
                  </h5>
                </div>

                <div className="input-group">
                  <label>Confirm Password</label>
                  <div className="password-box">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <i
                      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>

                  <small className={passwordMatch ? "match" : "not-match"}>
                    {" "}
                    {confirmPassword
                      ? passwordMatch
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"
                      : ""}
                  </small>
                </div>


                <div className="input-group">
                  <label>Address</label>

                  <textarea
                    rows="3"
                    placeholder="Enter Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="checkbox-group">
                  <label>
                    <input type="checkbox" />I agree to the Terms & Conditions
                  </label>

                  <label>
                    <input type="checkbox" />
                    Receive updates and notifications
                  </label>
                </div>

                <div className="button-group">
                  <button className="back-buttonn" onClick={backStep}>
                    Back
                  </button>

                  <button onClick={handleSubmit} className="submit-btn">
                    Create Account
                  </button>
                </div>
                <br/><br/>
             <div className="register-link">
              Already have an account?&nbsp;
              <Link to="/login">Login In</Link>
            </div>

              </div>
            </div>
          </div>
        </div>

        <script src="script.js"></script>
      </div>
    </>
  );
};

export default RegisterPage;
