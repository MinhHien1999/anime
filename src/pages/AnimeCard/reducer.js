import {
  SET_PREVIOUS,
  SET_NEXT,
  LOAD_MORE_DATA,
  SET_FILTER,
  SET_START_COUNTDOWN,
  SET_DECREMENT_COUNTDOWN,
} from "./constants";

const filterDuplicate = (dataAnimes) => {
  let data = [];
  dataAnimes.reduce((previousValue, currentValue, index) => {
    if (previousValue === undefined) {
      data.push(currentValue);
    }
    if (previousValue.mal_id !== currentValue.mal_id) {
      data.push(currentValue);
    }
    return currentValue;
  }, 0);
  return data;
};
const filterSeasonData = (dataAnimes, season) => {
  const result = dataAnimes.filter((anime) => {
    return (
      anime.season === season ||
      (anime.season !== season && anime.airing === true)
    );
  });
  return result;
};
const Broadcast = (mal_id, episodes, dates, time, type, airing) => {
  let episodeComing = 1;
  const WEEK = 604800000;
  let milisecondsRemaining = WEEK;
  const now = new Date();
  const vietnamDate = new Date(now.getTime()); //GMT+7
  const dateString = `${
    dates.year +
    "-" +
    dates.month.toString().padStart(2, "0") +
    "-" +
    dates.day.toString().padStart(2, "0") +
    `T${time}:00+09:00`
  }`;
  const dateBroadcast = Date.parse(dateString); //milliseconds, ngay dau tien khoi chieu GMT+9
  const remainingTime = new Date(
    vietnamDate.getTime() - dateBroadcast
  ).getTime(); //tgian từ ngày khởi chiếu đến ngày hiện tại, miliseconds
  const pastSeconds = Math.floor(remainingTime / 1000);
  const pastWeeks = Math.floor(pastSeconds / 604800); //604800s = 1 week
  let newDateBroadcast = new Date(
    dateBroadcast + WEEK * (pastWeeks + 1)
  ).getTime(); // ngay chieu ep moi nhat, miliseconds
  episodeComing += pastWeeks + 1;
  milisecondsRemaining = newDateBroadcast - vietnamDate;
  if (type !== "TV" || isNaN(episodeComing) || isNaN(milisecondsRemaining)) {
    episodeComing = 0;
    milisecondsRemaining = 0;
  }

  const countdown = {
    mal_id,
    episodeComing,
    milisecondsRemaining,
    airing,
  };
  return countdown;
};
const handleBroadcast = (dataAnimes) => {
  const broadcast = [];
  dataAnimes.map((anime) => {
    broadcast.push(
      Broadcast(
        anime.mal_id,
        anime.episodes,
        anime.aired.prop.from,
        anime.broadcast.time,
        anime.type,
        anime.airing
      )
    );
  });
  return broadcast;
};
const reducerAnimes = (state, action) => {
  let newState;
  switch (action.type) {
    case SET_PREVIOUS:
      {
        newState = action.payload;
        const dataAnimes = action.payload.data;
        const broadcasts = handleBroadcast(dataAnimes);
        const newArr = [];
        dataAnimes.forEach((item, index) => {
          newArr[index] = broadcasts[index];
          dataAnimes[index].countdown = newArr[index];
        });
        newState.data = dataAnimes;
      }
      break;
    case SET_NEXT:
      {
        newState = action.payload;
        const dataAnimes = action.payload.data;
        const broadcasts = handleBroadcast(dataAnimes);
        const newArr = [];
        dataAnimes.forEach((item, index) => {
          newArr[index] = broadcasts[index];
          dataAnimes[index].countdown = newArr[index];
        });
        newState.data = dataAnimes;
      }
      break;
    case LOAD_MORE_DATA:
      {
        const filterData = filterSeasonData(
          action.payload.data,
          action.payload.season
        );
        const newArr = [...state.data, ...filterData];
        const data = filterDuplicate(newArr);
        const newArr1 = [];
        const newData = {
          data: data,
          library: action.payload.library,
          season: action.payload.season,
          year: action.payload.year,
          current_page: action.payload.current_page,
          total_pages: action.payload.total_pages,
          filter: action.payload.filter,
        };
        console.log(newData);
        const broadcasts = handleBroadcast(newData.data);
        newData.data.forEach((item, index) => {
          newArr1[index] = broadcasts[index];
          newData.data[index].countdown = newArr1[index];
        });
        newState = newData;
      }
      break;
    case SET_FILTER.tv:
      {
        newState = action.payload;
        const dataFilter = filterDuplicate(
          filterSeasonData(newState.data, newState.season)
        );
        const broadcasts = handleBroadcast(dataFilter);
        const newArr = [];
        console.log(dataFilter);
        dataFilter.forEach((item, index) => {
          newArr[index] = broadcasts[index];
          dataFilter[index].countdown = newArr[index];
        });
        newState.data = dataFilter;
      }
      break;
    case SET_FILTER.movie:
      {
        newState = action.payload;
        const dataFilter = filterDuplicate(newState.data);
        const broadcasts = handleBroadcast(dataFilter);
        const newArr = [];
        dataFilter.forEach((item, index) => {
          newArr[index] = broadcasts[index];
          dataFilter[index].countdown = newArr[index];
        });
        newState.data = dataFilter;
      }
      break;
    case SET_FILTER.ova:
      {
        newState = action.payload;
        const dataFilter = filterDuplicate(newState.data);
        const broadcasts = handleBroadcast(dataFilter);
        const newArr = [];
        dataFilter.forEach((item, index) => {
          newArr[index] = broadcasts[index];
          dataFilter[index].countdown = newArr[index];
        });
        newState.data = dataFilter;
      }
      break;
    case SET_FILTER.all:
      {
        newState = action.payload;
        const dataFilter = filterDuplicate(newState.data);
        const broadcasts = handleBroadcast(dataFilter);
        const newArr = [];
        dataFilter.forEach((item, index) => {
          newArr[index] = broadcasts[index];
          dataFilter[index].countdown = newArr[index];
        });
        newState.data = dataFilter;
      }
      break;
    case SET_START_COUNTDOWN:
      {
        const initialCountdown = state.data.reduce((acc, item, index) => {
          acc[index] = {
            mal_id: item.mal_id,
            episodeComing: item.countdown.episodeComing,
            remaining: item.countdown.milisecondsRemaining,
            airing: state.data[index].episodes !== null && state.data[index].episodes <= item.countdown.episodeComing ? false : item.countdown.airing
          };
          return acc;
        }, {});
        newState = {
          ...state,
          countdown: initialCountdown,
        };
      }
      break;
    case SET_DECREMENT_COUNTDOWN:
      {
        let newCountdown = {};
        // console.log(action.payload)
        const timeRemaining = action.payload.countdown.remaining;
        const secondsRemaining = Math.floor(timeRemaining / 1000);
        const seconds = Math.floor(((secondsRemaining % 86400) % 3600) % 60);
        const hours = Math.floor((secondsRemaining % 86400) / 3600);
        const minutes = Math.floor(((secondsRemaining % 86400) % 3600) / 60);
        const day = Math.floor(secondsRemaining / 86400);
        newCountdown = {
          ...state.countdown,
          [action.payload.id]: {
            mal_id: action.payload.countdown.mal_id,
            episodeComing: action.payload.countdown.episodeComing,
            remaining: action.payload.countdown.remaining - 1000,
            airing: action.payload.countdown.airing,
          },
        };
        if (day === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          newCountdown[action.payload.id].episodeComing =
            action.payload.countdown.episodeComing + 1;
        }
        newState = {
          ...state,
          countdown: newCountdown,
        };
      }
      break;
    default:
      {
        newState = action.payload;
        const dataFilter = filterDuplicate(
          filterSeasonData(newState.data, newState.season)
        );
        const broadcasts = handleBroadcast(dataFilter);
        const newArr = [];
        dataFilter.forEach((item, index) => {
          newArr[index] = broadcasts[index];
          dataFilter[index].countdown = newArr[index];
        });
        newState.data = dataFilter;
      }
      break;
  }
  return newState;
};

export default reducerAnimes;
