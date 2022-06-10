import axios from 'axios';
import authHeader from './auth-header';

const BASE_URL = 'http://localhost:8081/';


const API_URL = BASE_URL + 'api/test/';


class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  getCitizenList() {
    return axios.get(BASE_URL + 'citizens', { headers: authHeader() });
  }

  findCitizenList(term) {
    return axios.get(BASE_URL + 'citizens/find?term='+term, { headers: authHeader() });
  }

  getContactDetails(nid) {
    return axios.get(BASE_URL + 'citizens/'+nid+'/contacts', { headers: authHeader() });
  }

   deleteCitizen(nid) {
    return axios.delete(BASE_URL + 'citizens/' + nid, { headers: authHeader() });
  }

  getUserDetails(nid) {
    return axios.get(BASE_URL + 'citizens/'+nid, { headers: authHeader() });
  }

  updateApproval(nid,value) {
    return axios.put(BASE_URL + 'citizens/'+nid,{isApproved: value}, { headers: authHeader() });
  }

  updateQualification(nid,qualifications,docs) {
    return axios.put(BASE_URL + 'citizens/'+ nid ,{qualifications: qualifications,docs:docs}, { headers: authHeader() });
  }


  uploadFile(file) {
    return axios.post(BASE_URL + 'upload',file, { headers: authHeader() });
  }

  getResourceURL() {
    return BASE_URL
  }
}

export default new UserService();
