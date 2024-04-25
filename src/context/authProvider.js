import { useContext, useState, createContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
const CryptoJS = require("crypto-js");

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "secret-key";
const USER_NAME_TOKEN = process.env.REACT_APP_JWT_TOKEN || "jwt-token";
const LOGIN_URL = process.env.REACT_APP_API_LOGIN;
const USER_TOKEN = process.env.REACT_APP_USER_TOKEN || "user-token";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const encrypt = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    return ciphertext;
  };
  const decrypt = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY).toString();
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  };
  const handleLogin = async (value) => {
    try {
      const response = await axios.post(LOGIN_URL, value, {
        withCredentials: true,
        credentials: "same-origin",
      });
      if (response.status === 200) {
        const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        Cookies.set(USER_NAME_TOKEN, response.data.token, {
          expires: expires,
        });
        Cookies.set(USER_TOKEN, response.data._id, {
          expires: expires,
        });
        setUser(response.data._id);
        setIsLoggedIn(true);
        return;
      }
    } catch (err) {
      let errors = {};
      errors = err.response.data.message;
      return errors;
    }
  };
  const handleLogout = () => {
    Cookies.remove(USER_NAME_TOKEN);
    Cookies.remove(USER_TOKEN);
    setIsLoggedIn(false);
    const path = location.pathname
    if(path === '/') {
      window.location.href = '/'
    }else{
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        USER_NAME_TOKEN,
        setIsLoggedIn,
        isLoggedIn,
        handleLogin,
        handleLogout,
        encrypt,
        decrypt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export const useAuth = () => {
  return useContext(AuthContext);
};
