import axios from "axios";

const API_URL = "http://localhost:8081/";

class AuthService {
  login(nid, password) {
    return axios
      .post(API_URL + "login", {
        nid,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(nid, email, password,name,
    age,
    latitude,
    longitude,
    profession,
    affiliation) {
    return axios.post(API_URL + "citizens", {
      nid,
      email,
      password,
      name,
      age,
      latitude,
      longitude,
      profession,
      affiliation,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
