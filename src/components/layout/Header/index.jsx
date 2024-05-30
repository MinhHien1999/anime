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
          <Link to="/user/library" style={{}}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#ffffff"
                  d="M 6.0097656 2 C 4.9143111 2 4.0097656 2.9025988 4.0097656 3.9980469 L 4 22 L 12 19 L 20 22 L 20 20.556641 L 20 4 C 20 2.9069372 19.093063 2 18 2 L 6.0097656 2 z M 6.0097656 4 L 18 4 L 18 19.113281 L 12 16.863281 L 6.0019531 19.113281 L 6.0097656 4 z"
                ></path>
              </svg>
            </div>
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
