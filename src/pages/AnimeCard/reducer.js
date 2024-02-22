import {SET_PREVIOUS, SET_NEXT, LOAD_MORE_DATA, SET_FILTER} from "./constants"

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
const filterSeasonData = (dataAnimes, season) => {
  const result = dataAnimes.filter(anime => anime.season === season)
  return result
}
const reducerAnimes = (state, action) => {
  let newState;
  switch (action.type) {
    case SET_PREVIOUS:
      newState = action.payload;
      break;
    case SET_NEXT:
      newState = action.payload;
      break;
    case LOAD_MORE_DATA:
      const filterData = filterSeasonData(action.payload.data, action.payload.season)
      const newData = [...state.data, ...filterData];
      const data = filterDuplicate(newData)
      newState = {
        data: data,
        season: action.payload.season,
        year: action.payload.year,
        current_page: action.payload.current_page,
        total_pages: action.payload.total_pages,
        filter: action.payload.filter,
      };
      break;
    case SET_FILTER.tv:
      newState = action.payload;
      newState.data = filterDuplicate(filterSeasonData(newState.data, newState.season))
      break;
    case SET_FILTER.movie:
      newState = action.payload;
      newState.data = filterDuplicate(newState.data)
      break;
    case SET_FILTER.ova:
      newState = action.payload;
      newState.data = filterDuplicate(newState.data)
      break;
    case SET_FILTER.all:
      newState = action.payload;
      break;
    default:
      newState = action.payload
      newState.data = filterDuplicate(filterSeasonData(newState.data, newState.season))
      break;
  }
  return newState;
};

export default reducerAnimes