import libraryApi from "../../api/libraryApi";

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

export async function getMark(userId, animeId) {
  try {
    const response = await libraryApi.getAnimeLibraryById(userId,animeId)
    if (response.library !== null) {
      const data = {
        library_id: response.library._id,
        status: response.library.status,
        note: response.library.note,
      };
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}

