import React, { useState, useReducer, useEffect, useRef } from "react";
import {
  SET_PREVIOUS,
  SET_NEXT,
  LOAD_MORE_DATA,
  SET_FILTER,
  INIT_SEASON,
} from "./constants";
import reducerAnimes from "./reducer";
import "./style.css";
import Modal from "../../components/Modal";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import jikanApi from "../../api/jikanApi";
import libraryApi from "../../api/libraryApi";

function AnimeCard() {
  const initIndexSeason = () => {
    const getMonth = new Date().getMonth() + 1;
    if (getMonth === 1 || getMonth === 2 || getMonth === 3) return 0;
    if (getMonth === 4 || getMonth === 5 || getMonth === 6) return 1;
    if (getMonth === 7 || getMonth === 8 || getMonth === 9) return 2;
    if (getMonth === 10 || getMonth === 11 || getMonth === 12) return 3;
  };
  let indexSeason = useRef(initIndexSeason());
  let indexYear = useRef(0);
  let currentFilter = useRef("tv");
  const user_id = Cookies.get(process.env.REACT_APP_USER_TOKEN);
  const [seasons, setSeasons] = useState([]);
  const [anime, setAnime] = useState([]);
  const [activeModal, setModal] = useState(false);
  const [season, setSeason] = useState(INIT_SEASON[initIndexSeason()]);
  const [year, setYear] = useState(new Date().getFullYear());
  const initAnimes = [];
  const [animes, dispatchAnimes] = useReducer(reducerAnimes, initAnimes);
  const getAllLibrary = async () => {
    let lib = [];
    if (!user_id) return null;
    try {
      const response = await libraryApi.getAll(user_id, {},"/")
      lib = response.library;
      return lib;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getSeasons = async () => {
      try {
        const response = await jikanApi.getSeasons();
        const dataSeasons = response.data
        setSeasons(dataSeasons);
        setYear(dataSeasons[0].year);
      } catch (error) {
        console.log(error);
      }
    };
    getSeasons();
  }, []);
  const getAnimes = async (
    year,
    season,
    type = "",
    filter = "tv",
    page = 1
  ) => {
    const lib = await getAllLibrary();
    try {
      const response = await jikanApi.getAnimes(year, season, page, filter)
      const data = response.data;
      const TOTAL_PAGES = response.pagination.last_visible_page;
      dispatchAnimes({
        type: type,
        payload: {
          data: data,
          library: lib,
          year,
          season,
          current_page: page,
          total_pages: TOTAL_PAGES,
          filter,
        },
      });
    } catch (error) {
      if (error.response.status === 429) {
        console.log("Too Many Requests");
        if (error.response.status === 404) {
          console.log("Not Found");
        }
      }
    }
  };
  useEffect(() => {
    getAnimes(year, season);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, season]);
  const showModal = (anime) => {
    setAnime(anime);
    setModal(true);
  };
  const CloseModal = () => {
    setModal(false);
  };
  const handleSeasonPrevious = async () => {
    indexSeason.current--;
    currentFilter.current = SET_FILTER.tv;
    if (indexSeason.current < 0) {
      indexSeason.current = 3;
      indexYear.current++;
    }
    let season = seasons[indexYear.current].seasons[indexSeason.current];
    let year = seasons[indexYear.current].year;
    await getAnimes(year, season, SET_PREVIOUS);
    setSeason(seasons[indexYear.current].seasons[indexSeason.current]);
    setYear(seasons[indexYear.current].year);
  };

  const handleSeasonNext = async () => {
    indexSeason.current++;
    currentFilter.current = SET_FILTER.tv;
    if (indexSeason.current > seasons[indexYear.current].seasons.length - 1) {
      indexSeason.current = 0;
      indexYear.current--;
    }
    if (indexYear.current < 0) {
      indexYear.current = 0;
      indexSeason.current = seasons[indexYear.current].seasons.length - 1;
    }
    let season = seasons[indexYear.current].seasons[indexSeason.current];
    let year = seasons[indexYear.current].year;
    await getAnimes(year, season, SET_NEXT);
    setSeason(seasons[indexYear.current].seasons[indexSeason.current]);
    setYear(seasons[indexYear.current].year);
  };
  const loadMoreData = async () => {
    let current_page = animes.current_page;
    if (current_page < animes.total_pages) {
      current_page++;
      await getAnimes(
        year,
        season,
        LOAD_MORE_DATA,
        animes.filter,
        current_page
      );
    }
  };
  const handleFilter = async (filter) => {
    await getAnimes(year, season, filter, filter);
    currentFilter.current = filter;
  };
  const changeColor = (mal_id, library) => {
    const result = library.find((lib) => lib.anime_id === mal_id);
    if (result) {
      return " " + result.status.toLowerCase();
    }
    return "";
  };
  return (
    <>
      <div className="header-wrap">
        <div className="header-box">
          <div className="header-box-navigation-button -previous">
            <i onClick={handleSeasonPrevious}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#95ccff"
                viewBox="0 0 24 24"
                className="svg-icon"
                width="2em"
                height="2em"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              </svg>
            </i>
          </div>
          <div className="header-box-content">
            <div className="page-header-box__sub-title text">
              {season === "winter"
                ? `January ${year}–March ${year}`
                : season === "spring"
                ? `April ${year}–June ${year}`
                : season === "summer"
                ? `July ${year}–September ${year}`
                : `October ${year}–December ${year}`}
            </div>
            <h1 className="text">
              {season.charAt(0).toUpperCase() +
                season.slice(1) +
                " " +
                year +
                " Anime"}
            </h1>
          </div>
          <div className="header-box-navigation-button -next">
            <i onClick={handleSeasonNext}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#95ccff"
                className="svg-icon"
                width="2em"
                height="2em"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
              </svg>
            </i>
          </div>
        </div>
        <nav>
          <ul className="ul-tabs">
            <li
              className={`li-tab ${
                currentFilter.current === SET_FILTER.tv && "active"
              }`}
            >
              <p
                className={`${
                  currentFilter.current === SET_FILTER.tv
                    ? "active"
                    : "unactive"
                }`}
                onClick={() => handleFilter(SET_FILTER.tv)}
              >
                Television
              </p>
            </li>
            <li
              className={`li-tab ${
                currentFilter.current === SET_FILTER.movie && "active"
              }`}
            >
              <p
                className={`${
                  currentFilter.current === SET_FILTER.movie
                    ? "active"
                    : "unactive"
                }`}
                onClick={() => handleFilter(SET_FILTER.movie)}
              >
                Movies
              </p>
            </li>
            <li
              className={`li-tab ${
                currentFilter.current === SET_FILTER.ova && "active"
              }`}
            >
              <p
                className={`${
                  currentFilter.current === SET_FILTER.ova
                    ? "active"
                    : "unactive"
                }`}
                onClick={() => handleFilter(SET_FILTER.ova)}
              >
                OVAs
              </p>
            </li>
            <li
              className={`li-tab ${
                currentFilter.current === "all" && "active"
              }`}
            >
              <p
                className={`${
                  currentFilter.current === SET_FILTER.all
                    ? "active"
                    : "unactive"
                }`}
                onClick={() => handleFilter("all")}
              >
                All
              </p>
            </li>
          </ul>
        </nav>
      </div>

      <main className="anime">
        {animes.data &&
          animes.data
            .filter(
              (animeFilter) =>
                animeFilter.season === animes.season.toLowerCase() ||
                (animeFilter.type &&
                  animeFilter.type.toLowerCase() === currentFilter.current) ||
                currentFilter.current === "all"
            )
            .map((anime, index) => (
              <div
                className={`anime-card${
                  animes.library === null
                    ? ""
                    : changeColor(anime.mal_id, animes.library)
                }`}
                key={index}
                id={`anime-${anime.mal_id}`}
              >
                <div className="anime-card_title">
                  <Link className="text" to={`anime/${anime.mal_id}`}>
                    {anime.title}
                  </Link>
                </div>
                <ol className="anime-card_tags">
                  {anime.genres.map((genre, index) => (
                    <li className="anime-card_tag text" key={genre.name}>
                      {genre.name}
                    </li>
                  ))}
                </ol>
                <div style={{ height: "100%" }}>
                  <div className="anime-card-poster">
                    <img
                      className="anime-card-poster_image"
                      src={anime.images.webp.image_url}
                      alt=""
                    />
                  </div>

                  <div className="anime-card-info text">
                    {anime.studios.length === 0 ? (
                      "TBA"
                    ) : anime.studios.length === 1 ? (
                      <div className="anime-card-info_studios">
                        {anime.studios.map((studio, index) => (
                          <span className="anime-card-info_studio" key={index}>
                            {studio.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <ul className="anime-card-info_studios">
                        {anime.studios.map((studio, index) => (
                          <li className="anime-card-info_studio" key={index}>
                            {studio.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="anime-card-info_date">
                      {anime.aired.prop.from.day +
                        "/" +
                        anime.aired.prop.from.month +
                        "/" +
                        anime.aired.prop.from.year +
                        " " +
                        (anime.broadcast.time ? anime.broadcast.time : "") +
                        (anime.broadcast.time ? " (JST)" : "")}
                      <div className="anime-card-info-metadata">
                        <div className="anime-card-info-metadata_source">
                          {anime.source}
                        </div>
                        <div className="anime-card-info-metadata_episodes">
                          {anime.episodes
                            ? anime.episodes +
                              " ep x " +
                              (anime.duration === "Unknown"
                                ? "?"
                                : anime.duration.replace(" per ep", ""))
                            : "?"}
                        </div>
                      </div>
                    </div>
                    <div className="anime-card-info_synopsis">
                      <p>{anime.synopsis}</p>
                    </div>
                  </div>
                </div>
                {user_id && (
                  <div
                    className={`anime-card-bookmark${
                      animes.library === null
                        ? ""
                        : changeColor(anime.mal_id, animes.library)
                    }`}
                    id={`anime-card-bookmark-${anime.mal_id}`}
                    onClick={() => showModal(anime)}
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
            ))}
        {activeModal && <Modal anime={anime} onClose={CloseModal} />}
      </main>
      {animes && animes.current_page !== animes.total_pages ? (
        <div style={{ height: "30px", width: "100%" }}>
          <button
            style={{ height: "30px", width: "100%" }}
            onClick={loadMoreData}
          >
            {" "}
            More Data
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default AnimeCard;
