import "./library.css";
import Modal from "../../components/Modal";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import NotFound from "../../components/NotFound";
import libraryApi from "../../api/libraryApi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
    try {
      const user_id = userId || userToken
      const filter = animeFilter;
      const response = await libraryApi.getAll(user_id, filter)
      const library = response.library;
      const user = response.username;
      setLibrary(library);
      setUserName(user);
    } catch (err) {
      if (err.response.status === 404) setError(true);
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
  const copyText = () => {
    const shareLink = `${process.env.REACT_APP_BASE_URL}/user/${userToken}/library`
    navigator.clipboard.writeText(shareLink)
    showSwal("Copied to Clipboard")
  }
  const showSwal = (message) => {
    withReactContent(Swal)
      .fire({
        title: message,
        confirmButtonText: `OK`,
        icon: "success",
      })
  };
  if (error) return <NotFound />;
  return (
    <>
      {username && (
        <>
          <div style={{ padding: "0px 15px", display: "flex", justifyContent: "space-between" }}>
            <h1 className="text">{`${username}'s Anime List`}</h1>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button style={{ height: "3em", cursor: "pointer" }} onClick={copyText}>Share</button>
            </div>
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
              Filter
            </button>
          </div>
        </>
      )}
      <div className="anime-library">
        {library &&
          library.map((lib) => (
            <div
              className={`anime-item ${lib.status.toLowerCase()} text`}
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
                <p className="anime-library-text_format">Format: {lib.format}</p>

                {userToken && (
                  <div
                    className={`mark-btn ${lib.status.toLowerCase()}`}
                    id={`anime-library-mark-${lib.anime_id}`}
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
