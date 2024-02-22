import { Link } from "react-router-dom";
import "./login.css";

function Login() {
    return (
        <>
            <div className="logo">
                <Link to="/">
                    <h1 className="text">LOGO</h1>
                </Link>
            </div>
            <div className="login-card">
                <form className="login-form">
                    <div className="login-form-username login-form-field">
                        <label className="text">UserName</label>
                        <input name="username" type="text"/>
                    </div>
                    <div className="login-form-email login-form-field">
                        <label className="text">Email</label>
                        <input name="email" type="email"/>
                    </div>
                    <div className="login-form-password login-form-field">
                        <label className="text">Password</label>
                        <input name="password" type="password"/>
                    </div>
                    <div className="login-form-action">
                        <button className='modal-card-action button-submit'>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>

    )
}

export default Login;