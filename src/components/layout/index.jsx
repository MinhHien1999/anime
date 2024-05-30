import Header from './Header'
import './style.css';

function Layout({children}){
    return (
        <div className="content">
            <Header />
            <>
                {children}
            </>
        </div>
    );
}

export default Layout