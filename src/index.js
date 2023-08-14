import Notiflix from 'notiflix';
import pixabayAPI from './PixabayApi';
import { createMarkup } from './createMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApiInstance = new pixabayAPI();
const elements = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

let isShow = 0;

elements.form.addEventListener('submit', handlerSearchImg);
elements.btnLoadMore.addEventListener('click', handlerBtnLoadMoreClick);

elements.btnLoadMore.classList.add('is-hidden');

function handlerSearchImg(evt) {
  evt.preventDefault();
  elements.gallery.innerHTML = '';
  elements.btnLoadMore.classList.add('is-hidden');

  pixabayApiInstance.page = 1;
  pixabayApiInstance.searchTerm = elements.form[0].value.trim();
  isShow = 0;

  if (pixabayApiInstance.searchTerm === '') {
    Notiflix.Notify.warning('Please, fill the main field');
    return;
  }
  fetchGallery();
}

async function fetchGallery() {
  const response = await pixabayApiInstance.fetchImg();
  const { hits, totalHits } = response;
  console.log(response);
  isShow += hits.length;

  if (!hits.length) {
    elements.btnLoadMore.classList.add('is-hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (isShow >= totalHits) {
      elements.btnLoadMore.classList.add('is-hidden');
          Notiflix.Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
  } else if (isShow < totalHits && this.page !== 1) {
    elements.btnLoadMore.classList.remove('is-hidden');
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  elements.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
  const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionDelay: 250,
  });
  lightbox.refresh();
}
function handlerBtnLoadMoreClick() {
  pixabayApiInstance.incrementPage();
  fetchGallery();
}
