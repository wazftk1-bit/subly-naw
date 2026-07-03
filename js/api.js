const API_URL = "https://subly-api-production.up.railway.app";

class SublyAPI {
  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('token');
  }

  async fetch(endpoint, options = {}) {
    const response = await fetch(this.baseURL + endpoint, options);
    return await response.json();
  }
}

const api = new SublyAPI();
