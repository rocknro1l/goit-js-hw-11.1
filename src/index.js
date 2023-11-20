import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchData } from './js/fetchData';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const target = document.querySelector('.js-guard');

let query = '';
let currentPage = 1;
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onScroll, options);

async function onScroll(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      const response = await fetchData(query, currentPage);

      markupContent(response);
      galleryLightbox.refresh();

      const lastPage = Math.ceil(response.totalHits / 40);

      if (lastPage === currentPage) {
        observer.unobserve(target);
        Notiflix.Notify.info('End');
      }
    }
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  query = event.target.elements.searchQuery.value;
  removeItems();
  currentPage = 1;

  let inputFormValue = query.toLowerCase().trim();

  if (inputFormValue === '') {
    Notiflix.Notify.failure('Please write query');
    return;
  }
  const response = await fetchData(query, currentPage);
  checkSearchData(response);
});

let galleryLightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

function markupContent(data) {
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a class="gallery__item" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
      </div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function removeItems() {
  gallery.innerHTML = '';
}

function checkSearchData(response) {
  const totalHits = response.totalHits;

  if (totalHits > 40) {
    observer.observe(target);
  }

  if (totalHits > 0) {
    Notiflix.Notify.success(`We have the ${totalHits} pictures fo you!`);
  }

  markupContent(response);
  galleryLightbox.refresh();

  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    removeItems();
  }
}
