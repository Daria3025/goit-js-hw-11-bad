import axios from 'axios';
export default class pixabayAPI {
  BASE_URL = 'https://pixabay.com/api/';
  API_KEY = '38813768-e622c26a05e1632f84811751b';
  searchTerm = null;
  page = 1;

  async fetchImg() {
    const searchParams = new URLSearchParams({
      key: this.API_KEY,
      q: `${this.searchTerm}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });
    try {
      const response = await axios.get(`${this.BASE_URL}?${searchParams}`);
      const data = response.data;
      return data;
    } catch (err) {
      console.warn(err);
    }
  }
  incrementPage() {
    this.page += 1;
  }
}
