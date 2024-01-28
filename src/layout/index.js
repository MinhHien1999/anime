import Header from './Header'

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