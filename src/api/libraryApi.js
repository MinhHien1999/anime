import * as apiClient from "./apiClient";
import Cookies from "js-cookie";

const URL = {
  library: {
    setUserId(userId){
      return `/library/${userId}`
    },
    setUserIdAndAnimeId(userId,animeId){
      return `/library/${userId}/${animeId}`
    }
  },
  userLibrary: `/user/library`,
  mark: {
    path: `/mark`,
    setLibraryId(libraryId){
      return `/mark/${libraryId}`
    }
  }

}
class LibraryApi {
  getAll = (user_id, filter = "Watching", locationPath = "") => {
    const userToken = Cookies.get(process.env.REACT_APP_USER_TOKEN);
    let url = URL.library.setUserId(user_id)
    if(userToken && locationPath === "/"){
        return apiClient.axiosClient.get(url)
    }
    if(userToken !== user_id){
        url = URL.userLibrary
    }
    return apiClient.axiosClient.get(url, {
        params: {
            user_id: user_id,
            filter,
          },
    })
  };
  getAnimeLibraryById = (userId, animeId) => {
    return apiClient.axiosClient.get(URL.library.setUserIdAndAnimeId(userId, animeId));
  }
  saveBookMark = (value, userTokenName) => {
    return apiClient.axiosClient.post(URL.mark.path, value, {
      headers: { authorization: `Bearer ${userTokenName}` },
      withCredentials: true,
      credentials: "same-origin",
    });
  };
  deleteBookMark = (library_id) => {
    return apiClient.axiosClient.delete(URL.mark.setLibraryId(library_id));
  };
}
const libraryApi = new LibraryApi();

export default libraryApi;
