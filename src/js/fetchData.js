import axios from 'axios';

const API_KEY = '40692232-4084d53797a695134229ef5d4';
const BASE_URL = 'https://pixabay.com/api/';

async function fetchData(query, currentPage) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&pretty=true&per_page=40&page=${currentPage}&orientation=horizontal&safesearch=true`;
  try {
    const { data } = await axios.get(url);

    return data;
  } catch (error) {}
}
export { fetchData };
