import Cookies from "js-cookie";
import "./style.css";
import { useAuth } from "../../../context/authProvider";
import { Link } from "react-router-dom";

function Header() {
  const MENUS = ["My Anime"];
  const { handleLogout, USER_NAME_TOKEN } = useAuth();
  const userToken = Cookies.get(USER_NAME_TOKEN);
  return (
    <div className="header">
      <ul className="header-menu-left">
        {MENUS.map((menu, index) => (
          <li key={index}>
            <a className="text text-home" href="/">
              {menu}
            </a>
          </li>
        ))}
      </ul>
      <ul className="header-menu-right">
        <li>
          <Link
            className="text text-home"
            to="/user/library"
            style={{
              padding: "5px",
              border: "1px solid #7db4e8",
              borderRadius: "5px",
            }}
          >
            Library
          </Link>
        </li>
        <li>
          {!userToken ? (
            <Link
              className="text text-home"
              to="/login"
              style={{
                padding: "5px",
                border: "1px solid #7db4e8",
                borderRadius: "5px",
              }}
            >
              Log in
            </Link>
          ) : (
            <Link
              className="text text-home"
              to="/"
              style={{
                padding: "5px",
                border: "1px solid #7db4e8",
                borderRadius: "5px",
                margin: "0",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              Log out
            </Link>
          )}
          {/* <a
            className="text text-home"
            href="/login"
            style={{
              padding: "5px",
              border: "1px solid #7db4e8",
              borderRadius: "5px",
            }}
          >
            Log in
          </a> */}
        </li>
      </ul>
    </div>
  );
}

export default Header;
