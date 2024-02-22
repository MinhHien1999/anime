import AnimeCard from "../pages/AnimeCard";
import AnimeDetail from "../pages/AnimeDetail";
import NotFound from "../components/NotFound";
import Login from "../pages/Login";
const publicRoutes = [
  { path: "/", component: AnimeCard },
  { path: "login", component: Login, layout: null },
  { path: "anime/:animeId", component: AnimeDetail },
  { path: "*", component: NotFound },
];

export { publicRoutes };
