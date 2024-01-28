import {SET_PREVIOUS, SET_NEXT, LOAD_MORE_DATA, SET_FILTER} from "./constants"

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
      newState = {
        data: [...state.data, ...action.payload.data],
        season: action.payload.season,
        year: action.payload.year,
        current_page: action.payload.current_page,
        total_pages: action.payload.total_pages,
        filter: action.payload.filter,
      };
      break;
    case SET_FILTER.tv:
      newState = action.payload;
      break;
    case SET_FILTER.movie:
      newState = action.payload;
      break;
    case SET_FILTER.ova:
      newState = action.payload;
      break;
    case SET_FILTER.all:
      newState = action.payload;
      break;
    default:
      newState = action.payload;
      break;
  }
  return newState;
};

export default reducerAnimes