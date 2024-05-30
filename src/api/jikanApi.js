import * as apiClient from "./apiClient";

const _URL_ = {
  seasons: {
    path: `/seasons`,
    setYearSeason(year, season){
      return `${this.path}/${year}/${season}`
    }
  },
}
class JikanApi {
  getSeasons = () => {
    const url = `/seasons`
    return apiClient.jikanClient.get(url)
  }
  getAnimes = (year, season, page = 1, filter = "all") => {
    const LIMIT = 21;
    let url = `${_URL_.seasons.setYearSeason(year, season)}?limit=${LIMIT}&page=${page}&filter=${filter}&sfw=true`
    if (filter === "all") {
      url = `${_URL_.seasons.setYearSeason(year, season)}?limit=${LIMIT}&page=${page}&sfw=true`;
    }
    return apiClient.jikanClient.get(url, {})
  };
  getInfoAnimeById = (animeId) =>{
    const url = `/anime/${animeId}`;
    return apiClient.jikanClient.get(url, {})
  };
  getAnimeRelationsById = (animeId) =>{
    const url = `/anime/${animeId}/relations`;
    return apiClient.jikanClient.get(url, {})
  }
}
const jikanApi = new JikanApi();

export default jikanApi;
