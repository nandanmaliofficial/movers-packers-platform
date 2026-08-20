import React, { useState ,useEffect } from "react";
import axios from "axios";
import "./verifyOTP.css";
import { useLocation, useNavigate } from "react-router-dom";
import { apiUrlUser } from "../../apiUrl";
import Alert from "../../components/Alert/alert";

const VerifyOTP = (res) => {
const [otp, setOtp] = useState("");
const [loading, setLoading] = useState(false);
const [timer, setTimer] = useState(60);
const [aleert,setAlert]=useState(null);

const location = useLocation();
const navigate = useNavigate();

const email = location.state?.email;

    useEffect(() => {

        if (timer <= 0)
            return;

        const interval = setInterval(() => {
                setTimer(
                    prev =>
                        prev - 1
                );
        }, 1000);

        return () =>
            clearInterval(
                interval
            );

    }, [timer]);


const handleSubmit = async (e) => {
e.preventDefault();


if (otp.length !== 6) {
  alert("Please enter a valid 6-digit OTP");
  return;
}


  setLoading(true);

setAlert(null)
  await axios.post(apiUrlUser+"verify-otp",{email, otp}).then(()=>{

     setAlert({message: "Email Verified Successfully",type:"successAlert"});

     setTimeout(() => {
      
       navigate("/login");
      }, 3000);
  }).catch((error)=>{

    if (error.response.status===400) {
      setAlert({message: "Invalid OTP",type:"errorAlert"});
    } else if(error.response.status===401){
      setAlert({message: "OTP Expired",type:"warningAlert"});
    } 
    
  }).finally(()=>{
  setLoading(false);
})


};


const handleResend = async () => {
setAlert(null)
    try {
        await axios.post(apiUrlUser+"resend-otp",
                {
                    email:email,
                }
            );
        setAlert({message: "OTP sent Successfully",type:"successAlert"});
        setTimer(60);
    } catch (error) {
        setAlert({message: "OTP sent Failed",type:"errorAlert"});
      }
};

return ( 
<>
<div className="otp-container">
 {aleert && (<Alert message={aleert.message} type={aleert.type} />)}
  
   <div className="otp-card">


    <div className="otp-icon">
      📧
    </div>

    <h2>Email Verification</h2>

    <p>
      Enter the 6-digit OTP sent to
    </p>

    <span className="email">
      {email}
    </span>

    <form >
      <input
        type="text"
        maxLength="6"
        value={otp}
        onChange={(e) =>
          setOtp(
            e.target.value.replace(/\D/g, "")
          )
        }
        placeholder="Enter OTP"
        className="otp-input"
      />
      <br/>
      

      <button onClick={handleSubmit} className="verifyBtn" disabled={loading}>
        {loading? "Verifying...": "Verify OTP"}
      </button>
      <br/>
      <br/>

      { timer > 0 ? (
            <p>
                Resend OTP in{" "}
                {timer}s
            </p>
            )
          : (
            <button type="button"
                className="verifyBtn"
                 onClick={ handleResend }
            >
                Resend OTP
            </button>
                        )
                }

    </form>

  </div>
</div>
</>

);
};

export default VerifyOTP;
