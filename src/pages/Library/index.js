// import { useAuth } from "../../context/authProvider";
import axios from "axios";
import "./library.css";
import Modal from "../../components/Modal";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import NotFound from "../../components/NotFound";

const LIBRARY_FILTER = ["Watching", "Completed", "Planning", "Dropped"];

function Library() {
  const { userId } = useParams();
  const [error, setError] = useState(false);
  const [library, setLibrary] = useState([]);
  const [anime, setAnime] = useState([]);
  const [activeModal, setModal] = useState(false);
  const [username, setUserName] = useState("");
  const [animeFilter, setAnimeFilter] = useState("");
  const userToken = Cookies.get(process.env.REACT_APP_USER_TOKEN);
  const getAllLibrary = async () => {
    const URL =
      process.env.REACT_APP_API_GET_ALL_LIBRARY_USER ||
      `${process.env.REACT_APP_API_BASE_URL}/user/library`;
    const filter = animeFilter;
    try {
      const response = await axios.get(URL, {
        params: {
          user_id: userId || userToken,
          filter,
        },
      });
      const library = response.data.library;
      const user = response.data.username;
      setLibrary(library);
      setUserName(user);
    } catch (error) {
      if (error.response.status === 404) setError(true);
    }
  };
  const showModal = (anime) => {
    setAnime(anime);
    setModal(true);
  };
  const CloseModal = () => {
    setModal(false);
  };
  const handleFilter = () => {
    getAllLibrary();
  };
  useEffect(() => {
    getAllLibrary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (error) return <NotFound />;
  return (
    <>
      {username && (
        <>
          <div>
            <h1 style={{padding: "0px 15px"}} className="text">{`${username}'s Anime List`}</h1>
          </div>
          <div className="anime-library-filter">
            <select onChange={(e) => setAnimeFilter(e.target.value)}>
              <option value="">All</option>
              {LIBRARY_FILTER.map((filter, index) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
            <button className="anime-filter-btn" onClick={handleFilter}>
              OK
            </button>
          </div>
        </>
      )}
      <div className="anime-library">
        {library &&
          library.map((lib) => (
            <div
              className={`anime-item text ${lib.status.toLowerCase()}`}
              key={`lib-${lib.anime_id}`}
              id={`lib-${lib.anime_id}`}
            >
              <div className="anime-item-left">
                <Link to={`/anime/${lib.anime_id}`}>
                  <img
                    className="anime-image"
                    src={lib.anime_image}
                    alt={lib.anime_title}
                  />
                </Link>
              </div>
              <div className="anime-item-right">
                <Link to={`/anime/${lib.anime_id}`}>
                  <p className="anime-library-text">{lib.anime_title}</p>
                </Link>
                <p className="anime-library-text_episode">
                  {" "}
                  {`Total: ${lib.episode} EP`}
                </p>
                {userToken && (
                  <div
                    className={`mark-btn ${lib.status.toLowerCase()}`}
                    onClick={() => showModal(lib)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ffffff"
                        d="M 6.0097656 2 C 4.9143111 2 4.0097656 2.9025988 4.0097656 3.9980469 L 4 22 L 12 19 L 20 22 L 20 20.556641 L 20 4 C 20 2.9069372 19.093063 2 18 2 L 6.0097656 2 z M 6.0097656 4 L 18 4 L 18 19.113281 L 12 16.863281 L 6.0019531 19.113281 L 6.0097656 4 z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      {activeModal && <Modal anime={anime} onClose={CloseModal} />}
    </>
  );
}

export default Library;
