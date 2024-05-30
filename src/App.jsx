import "./App.css";
import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes, PrivateRoute, AuthRoute } from "./Routes";
import DefaultLayout from "./components/layout";
import AuthProvider from "./context/authProvider";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<AuthRoute/>}>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<SignUp/>}/>
            </Route>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              const Layout = route.layout === null ? Fragment : DefaultLayout;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
            <Route element={<PrivateRoute />}>
              {privateRoutes.map((route, index) => {
                const Page = route.component;
                const Layout = route.layout === null ? Fragment : DefaultLayout;
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              })}
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
