import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../context/authProvider";
import { validateLoginForm } from "../../validation/validation";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const { handleLogin, USER_NAME_TOKEN} = useAuth();
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const userToken = Cookies.get(USER_NAME_TOKEN);
  const handleInput = (event) => {
    const newObj = { ...values, [event.target.name]: event.target.value };
    setValues(newObj);
  };
  const handleValidation = (e) => {
    e.preventDefault();
    const validataForm = validateLoginForm(values);
    const checkEmpty = isEmpty(validataForm);
    if (checkEmpty) {
      handleLogin(values).then((err) => {
        if (err) {
          setErrors(err);
        } else {
          navigate("/");
        }
      });
    } else {
      setErrors(validataForm);
    }
  };
  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0 && typeof obj === "object";
  };
  if (userToken) {
    return <Navigate to="/" />;
  } else {
    return (
      <>
        <div className="logo">
          <Link to="/">
            <h1 className="text">My Anime</h1>
          </Link>
        </div>
        <div className="login-title">
          <h1 className="text">Log in</h1>
        </div>
        <div className="login-card">
          <form className="login-form" onSubmit={handleValidation}>
            <div className="login-form-email login-form-field">
              <label className="text">Email</label>
              <input name="email" type="email" onChange={handleInput} />
              {errors.email && <p className="text-error">{errors.email}</p>}
            </div>
            <div className="login-form-password login-form-field">
              <label className="text">Password</label>
              <input
                name="password"
                type="password"
                onChange={handleInput}
                placeholder="passwords between 8-16 characters"
              />
              {errors.password && (
                <p className="text-error">{errors.password}</p>
              )}
            </div>
            <div className="login-form-action">
              <Link className="signup text" to="/signup">
                Sign up
              </Link>
              <button className="button-submit">Log in</button>
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default Login;
