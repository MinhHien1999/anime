import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "../../components/NotFound";
import Modal from "../../components/Modal";
import "./style.css";
import Cookies from "js-cookie";
import { useAuth } from "../../context/authProvider";

function AnimeDetail() {
  const { animeId } = useParams();
  const [anime, setAnime] = useState([]);
  const [error, setError] = useState(false);
  const [activeModal, setModal] = useState(false);
  const { USER_NAME_TOKEN } = useAuth();
  const [animeRelations, setAnimeRelations] = useState([]);
  const user = Cookies.get(USER_NAME_TOKEN);
  const getAnimeDetail = async (animeId) => {
    let URL = `${process.env.REACT_APP_JIKAN_API_GET_ANIME_BY_ID}/${animeId}`;
    try {
      const response = await axios.get(URL);
      setAnime(response.data);
    } catch (error) {
      console.error(
        `${error.response.status} | Anime ${error.response.statusText}`
      );
      setError(true);
    }
  };
  const getAnimeRelations = async (animeId) => {
    let URL = `https://api.jikan.moe/v4/anime/${animeId}/relations`;
    try {
      const AnimeRelations = await axios.get(URL);
      setAnimeRelations(filterAnimeRelations(AnimeRelations.data));
    } catch (error) {
      console.error(
        `${error.response.status} | Anime ${error.response.statusText}`
      );
    }
  };
  const filterAnimeRelations = (animeData) => {
    const result = animeData.data.filter((anime, index) => {
      return anime.entry.some((filter) => {
        return filter.type === "anime";
      });
    });
    return result;
  };
  const showModal = () => {
    setModal(true);
  };
  const CloseModal = () => {
    setModal(false);
  };
  useEffect(() => {
    getAnimeDetail(animeId);
    getAnimeRelations(animeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId]);
  if (error) return <NotFound />;
  return (
    <>
      {anime.data && (
        <div className="anime-detail">
          <div className="left-info">
            <img
              className="left-info-poster"
              src={anime.data.images.webp.image_url}
              alt="poster"
            />
            <div className="left-info-score">
              <p className="text">score</p>
              <p className="text">{anime.data.score + "/10"}</p>
            </div>
            <div className="left-info-title">
              <span className="text">Original Title</span>
              <p className="text">{anime.data.title_japanese}</p>
            </div>
            <div className="left-info-status">
              <span className="text">Status</span>
              <p className="text">{anime.data.status}</p>
            </div>
            <div className="left-info-premiere">
              <span className="text">Premiere</span>
              <p className="text">
                {anime.data.aired.prop.from.day +
                  "/" +
                  anime.data.aired.prop.from.month +
                  "/" +
                  anime.data.aired.prop.from.year}
              </p>
            </div>
            {anime.data.season ? (
              <div className="left-info-season">
                <span className="text">Season</span>
                <p className="text">
                  {anime.data.season.charAt(0).toUpperCase() +
                    anime.data.season.slice(1) +
                    " " +
                    anime.data.year}
                </p>
              </div>
            ) : (
              <Fragment />
            )}
          </div>
          <div className="right-info">
            <div className="right-info-title-box">
              <div className="right-info-title">
                <h3 className="text">{anime.data.title}</h3>
                <p className="text">{anime.data.title_english}</p>
              </div>
              {user ? (
                <div className="right-info-mark">
                  <button className="right-info-mark-btn" onClick={showModal}>
                    abcd
                  </button>
                </div>
              ) : (
                <Fragment />
              )}
            </div>
            <div className="right-info-card">
              <div className="right-info-card-metadata">
                <div className="right-info-card-metadata-format">
                  <p className="right-info-card-metadata-title">Format</p>
                  <p className="right-info-card-metadata_textContent text">
                    {anime.data.type}
                  </p>
                </div>
                <div className="right-info-card-metadata-source">
                  <p className="right-info-card-metadata-title">Source</p>
                  <p className="right-info-card-metadata_textContent text">
                    {anime.data.source}
                  </p>
                </div>
                <div className="right-info-card-metadata-episodes">
                  <p className="right-info-card-metadata-title">Episodes</p>
                  <p className="right-info-card-metadata_textContent text">
                    {anime.data.episodes ? anime.data.episodes : "?"}
                  </p>
                </div>
                <div className="right-info-card-metadata-duration">
                  <p className="right-info-card-metadata-title">Run time</p>
                  <p className="right-info-card-metadata_textContent text">
                    {anime.data.duration}
                  </p>
                </div>
              </div>
              <div className="right-info-card-description">
                <p className="right-info-card-description_textContent text">
                  {anime.data.synopsis}
                </p>
              </div>
              <div className="right-info-card-studios">
                <p className="text">
                  {anime.data.studios.length === 0 ||
                  anime.data.studios.length === 1
                    ? "Studio"
                    : "Studios"}
                </p>
                <div className="right-info-card-studio text">
                  {anime.data.studios.length === 0
                    ? "TBA"
                    : anime.data.studios.map((studio, index) => (
                        <p
                          className="right-info-card-studio_textContent text"
                          href="/"
                          key={`studio-${studio.name}-${index}`}
                        >
                          {studio.name}
                        </p>
                      ))}
                </div>
              </div>
              {anime.data.genres === null || anime.data.genres.length === 0 ? (
                <></>
              ) : (
                <div className="right-info-card-genres">
                  <p className="text">
                    {anime.data.genres.length === 1 ? "Tag" : "Tags"}
                  </p>
                  <div className="right-info-card-genre">
                    {anime.data.genres.map((genre, index) => (
                      <p
                        className="right-info-card-genre_textContent text"
                        href="/"
                        key={`genre-${genre.name}-${index}`}
                      >
                        {genre.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {!anime.data.trailer.embed_url ? (
              <></>
            ) : (
              <div className="right-info-video">
                <div className="right-info-video-trailer">
                  <div className="right-info-video-trailer_text text">
                    <p>Video</p>
                  </div>
                </div>
                <div className="right-info-video-trailer_item">
                  <a href={anime.data.trailer.embed_url}>
                    <img
                      src={anime.data.trailer.images.small_image_url}
                      alt="..."
                    />
                  </a>
                </div>
              </div>
            )}
            {animeRelations.length === 0 ? (
              <></>
            ) : (
              <div className="right-info-relation">
                <div className="right-info-video-relation_text text">
                  <p>Relations</p>
                </div>
                {animeRelations.map((relation, index) =>
                  relation.entry.map((a) => (
                    <div
                      className="anime-relation-card"
                      key={`relation-${a.mal_id}`}
                    >
                      <Link
                        className="text"
                        style={{ textAlign: "center", fontWeight: "400" }}
                        to={`/anime/${a.mal_id}`}
                      >
                        <p>{a.name}</p>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {activeModal && <Modal anime={anime.data} onClose={CloseModal} />}
    </>
  );
}

export default AnimeDetail;
