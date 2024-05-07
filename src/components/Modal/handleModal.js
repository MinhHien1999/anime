import axios from "axios";

export function ChangeLibraryItem(locationPath, value) {
  switch (locationPath) {
    case "/":
      {
        const animeEle = document.getElementById(`anime-${value.anime_id}`);
        const bookmarkEle = document.getElementById(
          `anime-card-bookmark-${value.anime_id}`
        );
        const newStatus = value.status.toLowerCase();
        const statusCurrent = animeEle.classList.item(1);
        if (!statusCurrent) {
          animeEle.classList.toggle(newStatus);
          bookmarkEle.classList.toggle(newStatus);
        } else {
          animeEle.classList.replace(statusCurrent, newStatus);
          bookmarkEle.classList.replace(statusCurrent, newStatus);
        }
      }
      break;
    case "/user/library":
      {
        const animeEle = document.getElementById(`lib-${value.anime_id}`);
        const bookmarkEle = document.getElementById(
          `anime-library-mark-${value.anime_id}`
        );
        const newStatus = value.status.toLowerCase();
        const statusCurrent = animeEle.classList.item(1);
        animeEle.classList.replace(statusCurrent, newStatus);
        bookmarkEle.classList.replace(statusCurrent, newStatus);
      }
      break;
    default:
      break;
  }
}

export function deleteLibraryItem(locationPath, anime_id, status = "") {
  switch (locationPath) {
    case "/":
      {
        const animeEle = document.getElementById(`anime-${anime_id}`);
        const bookmarkEle = document.getElementById(
          `anime-card-bookmark-${anime_id}`
        );
        animeEle.classList.remove(status.toLowerCase());
        bookmarkEle.classList.remove(status.toLowerCase());
      }
      break;
    case "/user/library":
      {
        const animeEle = document.getElementById(`lib-${anime_id}`);
        animeEle.remove();
      }
      break;
    default:
      break;
  }
}

export async function getMark(user_id, anime_id) {
  const URL = `${process.env.REACT_APP_API_BASE_URL}/library/${user_id}/${anime_id}`;
  try {
    const response = await axios.get(URL);
    if (response.data.library !== null) {
      const data = {
        library_id: response.data.library._id,
        status: response.data.library.status,
        note: response.data.library.note,
      };
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}

