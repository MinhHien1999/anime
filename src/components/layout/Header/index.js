import "./style.css";

function Header() {
  const MENUS = ["Schedule", "Seasons"];
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
            <a className="text text-home" href="/login" style={
              {
                padding: '5px',
                border: '1px solid #7db4e8',
                borderRadius: '5px',
              }
              }>
              Log in
            </a>
          </li>
      </ul>
    </div>
  );
}

export default Header;
