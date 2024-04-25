import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { validateSignUpForm } from "../../validation/validation";
import "./signup.css";
import axios from "axios";
import { useAuth } from "../../context/authProvider";
const SIGNUP_URL = process.env.REACT_APP_API_SIGNUP;

function SignUp() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const handleInput = (event) => {
    const newObj = { ...values, [event.target.name]: event.target.value };
    setValues(newObj);
  };
  const handleSubmit = async (value) => {
    try {
      const response = await axios.post(SIGNUP_URL, value);
      showSwal(response.data.message);
    } catch (err) {
      setErrors(err.response.data.message);
    }
  };
  const handleValidation = (e) => {
    e.preventDefault();
    const validataForm = validateSignUpForm(values);
    const checkEmpty = isEmpty(validataForm);
    if (checkEmpty) {
      handleSubmit(values);
    } else {
      setErrors(validataForm);
    }
  };
  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0 && typeof obj === "object";
  };
  const showSwal = (message) => {
    withReactContent(Swal)
      .fire({
        title: message,
        confirmButtonText: `OK`,
        icon: "success",
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
  };
  return (
    <>
      <div className="logo">
        <Link to="/">
          <h1 className="text">My Anime</h1>
        </Link>
      </div>
      <div className="signup-title">
        <h1 className="text">Sign up</h1>
      </div>
      <div className="signup-card">
        <form className="signup-form" onSubmit={handleValidation}>
          <div className="signup-form-username signup-form-field">
            <label className="text">UserName</label>
            <input
              name="username"
              type="text"
              id="username"
              onChange={handleInput}
              required
              placeholder="username between 6-12 characters"
            />
            {errors.username && <p className="text-error">{errors.username}</p>}
          </div>
          <div className="signup-form-email signup-form-field">
            <label className="text">Email</label>
            <input
              name="email"
              type="email"
              id="email"
              onChange={handleInput}
              required
            />
            {errors.email && <p className="text-error">{errors.email}</p>}
          </div>
          <div className="signup-form-password signup-form-field">
            <label className="text">Password</label>
            <input
              name="password"
              type="password"
              id="password"
              onChange={handleInput}
              required
              placeholder="passwords between 8-16 characters"
            />
            {errors.password && <p className="text-error">{errors.password}</p>}
          </div>
          <div className="signup-form-action">
            <Link className="signup text" to="/login">
              Log in
            </Link>
            <button type="submit" className="button-submit">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
