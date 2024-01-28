import './style.css';

function Header(){
    const MENUS = [
        "Schedule",
        "Seasons"
    ]
    return (
        <div>
            <ul className='header-menu'>
                {MENUS.map((menu, index) => (
                    <li key={index}>
                        <a href='/'>
                            {menu}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Header;