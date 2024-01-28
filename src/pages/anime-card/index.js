import { useState, useReducer, useEffect, useRef } from "react"
import {SET_PREVIOUS, SET_NEXT, LOAD_MORE_DATA, SET_FILTER, INIT_SEASON} from "./constants"
import reducerAnimes from "./reducer"
import axios from "axios"
import "./style.css"

function AnimeCard() {
  const initIndexSeason = () => {
    const getMonth = new Date().getMonth() + 1
    if (getMonth === 1 || getMonth === 2 || getMonth === 3) return 0
    if (getMonth === 4 || getMonth === 5 || getMonth === 6) return 1
    if (getMonth === 7 || getMonth === 8 || getMonth === 9) return 2
    if (getMonth === 10 || getMonth === 11 || getMonth === 12) return 3
  }
  let indexSeason = useRef(initIndexSeason())
  let indexYear = useRef(0)
  let currentFilter = useRef("tv")
  const [seasons, setSeasons] = useState([])
  const [season, setSeason] = useState(INIT_SEASON[initIndexSeason()])
  const [year, setYear] = useState(new Date().getFullYear())
  const initAnimes = []
  const [animes, dispatchAnimes] = useReducer(reducerAnimes, initAnimes)
  useEffect(() => {
    const getSeasons = async () => {
      const response = await axios.get(`https://api.jikan.moe/v4/seasons`)
      const dataSeasons = response.data.data
      setSeasons(dataSeasons)
      setYear(dataSeasons[0].year)
    }
    getSeasons()
  }, [])
  const filterDuplicate = (dataAnimes) => {
    let data = []
     dataAnimes.reduce(
      (previousValue, currentValue, index) => {
        if(previousValue === undefined) {
          data.push(currentValue)
        }
        if(previousValue.mal_id !== currentValue.mal_id){
          data.push(currentValue)
        }
        return currentValue
      }, 
    0);
    return data
  }
  const getAnimes = async (year, season, type='',filter = 'tv', page = 1) => {
    const LIMIT = 21
    let URL = `https://api.jikan.moe/v4/seasons/${year}/${season}?limit=${LIMIT}&page=${page}&filter=${filter}&sfw=true`
    if(filter === "all"){
        URL = `https://api.jikan.moe/v4/seasons/${year}/${season}?limit=${LIMIT}&page=${page}&sfw=true`
    }
    try {
      const response = await axios.get(URL)
      const dataAnimes = response.data.data
      const TOTAL_PAGES = response.data.pagination.last_visible_page
      const data = filterDuplicate(dataAnimes)
      dispatchAnimes({
        type: type,
        payload: {
          data: data,
          year,
          season,
          current_page: page,
          total_pages: TOTAL_PAGES,
          filter
          },
      })
    } catch (error) {
      throw new Error(`connection error: ${error.message}`)
    }

  }
  useEffect(() => {
    getAnimes(year, season)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year,season])
  const handleSeasonPrevious = () => {        
    indexSeason.current--
    currentFilter.current = SET_FILTER.tv
    if (indexSeason.current < 0) {
      indexSeason.current = 3
      indexYear.current++
    }
    let season = seasons[indexYear.current].seasons[indexSeason.current]
    let year = seasons[indexYear.current].year
    getAnimes(year, season, SET_PREVIOUS)
    setSeason(seasons[indexYear.current].seasons[indexSeason.current])
    setYear(seasons[indexYear.current].year)
  }

  const handleSeasonNext = () => {
    indexSeason.current++
    currentFilter.current = SET_FILTER.tv
    if (indexSeason.current > seasons[indexYear.current].seasons.length - 1) {
      indexSeason.current = 0
      indexYear.current--
    }
    if (indexYear.current < 0) {
        indexYear.current = 0
        indexSeason.current = seasons[indexYear.current].seasons.length - 1
    }
    let season = seasons[indexYear.current].seasons[indexSeason.current]
    let year = seasons[indexYear.current].year
    getAnimes(year, season, SET_NEXT)
    setSeason(seasons[indexYear.current].seasons[indexSeason.current])
    setYear(seasons[indexYear.current].year)
  }
  const loadMoreData = () => {
    let current_page = animes.current_page
    if(current_page < animes.total_pages){
        current_page++
        getAnimes(year, season, LOAD_MORE_DATA,animes.filter, current_page)
    }
  }
  const handleFilter = (filter) => {
    getAnimes(year, season, filter,filter)
    currentFilter.current = filter
  }
  return (
    <>
      <div className="header-wrap">
        <div className="header-box">
          <div className="header-box-navigation-button -previous">
            <i onClick={handleSeasonPrevious}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="svg-icon" width="2em" height="2em"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
            </i>
          </div>
          <div className="header-box-content">
            <div className="page-header-box__sub-title">        
            {
                season === 'winter' ? `January ${year}–March ${year}` :
                season === 'spring' ? `April ${year}–June ${year}` :
                season === 'summer' ? `July ${year}–September ${year}` : 
                `October ${year}–December ${year}`
            }
            </div>
            <h1>
              {season.charAt(0).toUpperCase() + season.slice(1) + ' '+ year + ' Anime'}
            </h1>
          </div>
          <div className="header-box-navigation-button -next">
            <i className="bi bi-arrow-right" onClick={handleSeasonNext}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="svg-icon" width="2em" height="2em"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
            </i>
          </div>
        </div>
        <nav>
          <ul className="ul-tabs">
            <li className={`li-tab ${currentFilter.current === SET_FILTER.tv && 'active' }`}>
                <p onClick={() => handleFilter(SET_FILTER.tv) }>Television</p>
            </li>
            <li className={`li-tab ${currentFilter.current === SET_FILTER.movie && 'active' }`}>
              <p onClick={() => handleFilter(SET_FILTER.movie) }>Movies</p>
            </li>
            <li className={`li-tab ${currentFilter.current === SET_FILTER.ova && 'active' }`}>
              <p onClick={() => handleFilter(SET_FILTER.ova) }>OVAs</p>
            </li>
            <li className={`li-tab ${currentFilter.current === 'all' && 'active' }`}>
              <p onClick={() => handleFilter("all") }>All</p>
            </li>
          </ul>
        </nav>
      </div>

      <main className="anime">
        {animes.data &&
          animes.data
            .filter(
              (animeFilter) =>  animeFilter.season === animes.season.toLowerCase() || 
              (animeFilter.type && animeFilter.type.toLowerCase() === currentFilter.current) ||
              currentFilter.current === "all"
            )
            .map((anime, index) => (
              <div className="anime-card" key={index}>
                <h3 className="anime-card_title">
                  <a href="google.com">{anime.title}</a>
                </h3>
                <ol className="anime-card_tags">
                  {anime.genres.map((genre, index) => (
                    <li className="anime-card_tag" key={genre.name}>
                      {genre.name}
                    </li>
                  ))}
                </ol>
                <div style={{ height: "100%" }}>
                  <div className="anime-card-poster">
                    <img
                      className="anime-card-poster_image"
                      src={anime.images.jpg.image_url}
                      alt=""
                    />
                  </div>

                  <div className="anime-card-info">
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
                            ? anime.episodes + " ep x " + anime.duration
                            : "?"}
                        </div>
                      </div>
                    </div>
                    <div className="anime-card-info_synopsis">
                      <p>{anime.synopsis}</p>
                    </div>
                  </div>
                </div>
              </div>
              
            ))
            }
      </main>
      {animes &&
                animes.current_page !== animes.total_pages ?
                <div style={{height: "30px", width: "100%"}}>
                    <button style={{height: "30px", width: "100%"}} onClick={loadMoreData}> More Data</button>
                </div>
                : ''
            }
    </>
  )
}

export default AnimeCard
