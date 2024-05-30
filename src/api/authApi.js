import * as apiClient from "./apiClient";


const URL = {
  login: `/login`,
  signup: `/signup`,
}
class AuthApi {
  login = (value) => {
    return apiClient.axiosClient.post(URL.login, value, {
      withCredentials: true,
      credentials: "same-origin",
    });
  };
  signUp = (value) => {
    return apiClient.axiosClient.post(URL.signup, value)
  }
}

const authApi = new AuthApi();

export default authApi;