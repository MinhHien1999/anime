import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authProvider";

import AnimeCard from "../pages/AnimeCard";
import AnimeDetail from "../pages/AnimeDetail";
import NotFound from "../components/NotFound";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Library from "../pages/Library";
import Cookies from "js-cookie";
const publicRoutes = [
  { path: "/", component: AnimeCard },
  { path: "login", component: Login, layout: null },
  { path: "signup", component: SignUp, layout: null },
  { path: "anime/:animeId", component: AnimeDetail },
  { path: "user/:userId/library", component: Library },
  { path: "*", component: NotFound },
];
const privateRoutes = [{ path: "user/library", component: Library }];

const PrivateRoute = () => {
  const {USER_NAME_TOKEN} = useAuth()
  const userToken = Cookies.get(USER_NAME_TOKEN);
  if (!userToken) return <Navigate to="/login" />;
  return <Outlet />;
};
const AuthRoute = () => {
  const {USER_NAME_TOKEN} = useAuth()
  const userToken = Cookies.get(USER_NAME_TOKEN);
  if (userToken) return <Navigate to="/" />;
  return <Outlet />;
};
export { publicRoutes, privateRoutes, PrivateRoute, AuthRoute };
