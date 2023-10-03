import axios from 'axios';

const myApiKey = '39808919-1d9799ea84529475b5b50a509';

async function fetchData(query, perPage, page) {
  const url = `https://pixabay.com/api/?key=${myApiKey}&q=${query}&image_type=photo&pretty=true&per_page=${perPage}&page=${page}&orientation=horizontal&safesearch=true`;
  try {
    const { data } = await axios.get(url);

    return data;
  } catch (error) {}
}
export { fetchData };