/* global data */
/* exported data */

var $searchForm = document.querySelector('#search-form');

$searchForm.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();
  var $movieTitleRaw = $searchForm.elements.movieTitle.value;
  var $movieTitle = '';
  for (let i = 0; i < $movieTitleRaw.length; i++) {
    if ($movieTitleRaw[i] === ' ') {
      $movieTitle += '+';
    } else {
      $movieTitle += $movieTitleRaw[i];
    }
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://www.omdbapi.com/?s=' + $movieTitle + '&apikey=fd3f5e28');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var $searchResultsRaw = xhr.response.Search;
    if (xhr.response.Error === 'Movie not found!') {
      var $h1Search = document.querySelector('#h1-search');
      $h1Search.textContent = 'Results';
      var $pNoResult = document.querySelector('#p-no-results');
      $pNoResult.className = 'white-text text-align-center';
      $searchForm.elements.movieTitle.value = '';
    } else {
      data.view = 'results-view';
      for (let i = 0; i < $searchResultsRaw.length; i++) {
        var $result = renderSearchResult($searchResultsRaw[i]);
        $resultsList.appendChild($result);
      }
      $searchView.className = 'hidden';
      $resultsView.className = '';
      $searchForm.reset();
    }
  });

  xhr.send();
}

var $resultsList = document.querySelector('#results-list');

function renderSearchResult(resultObj) {
  var $liEl = document.createElement('li');
  $liEl.className = 'result-card pad-1-bot marg-1-1-2-bot column-fourth';
  $liEl.setAttribute('data-entry-id', resultObj.imdbID);
  var $divEl1 = document.createElement('div');
  $divEl1.className = 'search-img-container';
  var $imgEl = document.createElement('img');
  $imgEl.className = 'search-img';
  if (resultObj.Poster === 'N/A') {
    $imgEl.setAttribute('src', 'images/noposter.png');
  } else {
    $imgEl.setAttribute('src', resultObj.Poster);
  }
  var $iEl = document.createElement('i');
  $iEl.className = 'fas fa-info-circle info-icon';
  var $divEl2 = document.createElement('div');
  $divEl2.className = 'pad-1-2-left-right text-align-center';
  var $h3El = document.createElement('h3');
  $h3El.className = 'result-title';
  $h3El.textContent = resultObj.Title;
  var $buttonEl = document.createElement('button');
  $buttonEl.className = 'button-style review-button';
  $buttonEl.textContent = 'REVIEW';
  $divEl1.appendChild($imgEl);
  $divEl1.appendChild($iEl);

  $divEl2.appendChild($h3El);
  $divEl2.appendChild($buttonEl);
  $liEl.appendChild($divEl1);
  $liEl.appendChild($divEl2);

  return $liEl;
}

var $searchView = document.querySelector('div#search-view');
var $resultsView = document.querySelector('div#results-view');
var $reviewFormView = document.querySelector('div#review-form-view');
var $navBar = document.querySelector('#nav-bar');

$navBar.addEventListener('click', swapViewNav);

function swapViewNav(event) {
  if (event.target.matches('#nav-search')) {
    data.view = 'search-view';
    $searchView.className = '';
    $resultsView.className = 'hidden';
    $reviewFormView.className = 'hidden';
    resetReviewForm();
    resetSearchBar();
    removeSearchResults();
  } else if (event.target.matches('#nav-post')) {
    data.view = 'review-form-view';
    $reviewFormView.className = '';
    $searchView.className = 'hidden';
    $resultsView.className = 'hidden';
    resetReviewForm();
    resetSearchBar();
    removeSearchResults();
  }
}

var $viewContainer = document.querySelector('div#view-container');
$viewContainer.addEventListener('click', swapView);

function swapView(event) {
  if (event.target.matches('.review-button')) {
    data.view = 'review-form-view';
    $reviewFormView.className = '';
    $searchView.className = 'hidden';
    $resultsView.className = 'hidden';
    data.results = [];
  }
}

window.addEventListener('DOMContentLoaded', showSameView);

function showSameView(event) {
  if (data.view === 'search-view') {
    $searchView.className = '';
    $resultsView.className = 'hidden';
    $reviewFormView.className = 'hidden';
  } else if (data.view === 'results-view') {
    $resultsView.className = '';
    $searchView.className = 'hidden';
    $reviewFormView.className = 'hidden';
  } else if (data.view === 'review-form-view') {
    $reviewFormView.className = '';
    $searchView.className = 'hidden';
    $resultsView.className = 'hidden';
  }
}

function resetSearchBar() {
  $searchForm.reset();
  var $h1Search = document.querySelector('#h1-search');
  $h1Search.textContent = 'Search';
  var $pNoResult = document.querySelector('#p-no-results');
  $pNoResult.className = 'hidden white-text text-align-center';
}

function resetReviewForm() {
  $reviewFormImg.setAttribute('src', 'images/placeholder-image-poster.png');
  var $stars = document.querySelectorAll('.star-icon');
  for (let i = 0; i < $stars.length; i++) {
    $stars[i].className = 'far fa-star star-icon';
  }
  $starRating.setAttribute('data-star', '0');
  $reviewForm.reset();
}

function removeSearchResults() {
  var $liElementList = document.querySelectorAll('li.result-card');
  for (let i = 0; i < $liElementList.length; i++) {
    $liElementList[i].remove();
  }
}

var $modalMovieDetails = document.querySelector('#modal-movie-details');
$resultsView.addEventListener('click', showMovieDetails);
var $movieDetailsContainer = document.querySelector('#movie-details-container');

function showMovieDetails(event) {
  var $closestLi = null;
  if (event.target.matches('.info-icon')) {
    $modalMovieDetails.className = 'modal-bg';
    $closestLi = event.target.closest('li');
    var $imdbID = $closestLi.getAttribute('data-entry-id');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://www.omdbapi.com/?i=' + $imdbID + '&apikey=fd3f5e28');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var movieObj = xhr.response;
      var $movieDetails = renderMovieDetails(movieObj);
      $movieDetailsContainer.appendChild($movieDetails);
    });
    xhr.send();
  }
}

function renderMovieDetails(movieObj) {
  var $divEl1 = document.createElement('div');
  $divEl1.className = 'row dialogue-box-movie-details';
  var $divEl2 = document.createElement('div');
  $divEl2.className = 'dialogue-poster column-half';
  var $imgEl = document.createElement('img');
  $imgEl.className = 'dialogue-poster-img';
  if (movieObj.Poster === 'N/A') {
    $imgEl.setAttribute('src', 'images/noposter.png');
  } else {
    $imgEl.setAttribute('src', movieObj.Poster);
  }
  var $divEl3 = document.createElement('div');
  $divEl3.className = 'column-full column-half text-align-center pad-1';
  var $divEl4 = document.createElement('div');
  $divEl4.className = 'text-align-right';
  var $iEl = document.createElement('i');
  $iEl.className = 'far fa-times-circle close-icon';
  var $h2El = document.createElement('h2');
  $h2El.className = 'no-marg';
  $h2El.textContent = movieObj.Title;
  var $h3El1 = document.createElement('h3');
  $h3El1.className = 'no-marg pad-1-bot';
  $h3El1.textContent = movieObj.Year;
  var $h3El2 = document.createElement('h3');
  $h3El2.className = 'no-marg';
  $h3El2.textContent = 'SYNOPSIS';
  var $pEl1 = document.createElement('p');
  $pEl1.textContent = movieObj.Plot;
  var $h3El3 = document.createElement('h3');
  $h3El3.className = 'no-marg';
  $h3El3.textContent = 'DIRECTORS';
  var $pEl2 = document.createElement('p');
  $pEl2.textContent = movieObj.Director;
  var $h3El4 = document.createElement('h3');
  $h3El4.className = 'no-marg';
  $h3El4.textContent = 'CAST';
  var $pEl3 = document.createElement('p');
  $pEl3.textContent = movieObj.Actors;

  $divEl2.appendChild($imgEl);
  $divEl4.appendChild($iEl);
  $divEl3.appendChild($divEl4);
  $divEl3.appendChild($h2El);
  $divEl3.appendChild($h3El1);
  $divEl3.appendChild($h3El2);
  $divEl3.appendChild($pEl1);
  $divEl3.appendChild($h3El3);
  $divEl3.appendChild($pEl2);
  $divEl3.appendChild($h3El4);
  $divEl3.appendChild($pEl3);
  $divEl1.appendChild($divEl2);
  $divEl1.appendChild($divEl3);

  return $divEl1;
}

$modalMovieDetails.addEventListener('click', closeModal);

function closeModal(event) {
  if (event.target.matches('.close-icon')) {
    $modalMovieDetails.className = 'modal-bg hidden';
    var $divEl1 = document.querySelector('.dialogue-box-movie-details');
    $divEl1.remove();
  }
}

$resultsList.addEventListener('click', popReviewForm);
var $reviewForm = document.querySelector('#review-form');

function popReviewForm(event) {
  var $closestLi = null;
  var $reviewFormImg = document.querySelector('.review-form-img');
  if (event.target.matches('.review-button')) {
    $closestLi = event.target.closest('li');
    var $imdbID = $closestLi.getAttribute('data-entry-id');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://www.omdbapi.com/?i=' + $imdbID + '&apikey=fd3f5e28');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var movieObj = xhr.response;
      $reviewForm.elements.movieTitleForm.value = movieObj.Title;
      $reviewForm.elements.posterUrlForm.value = movieObj.Poster;
      if ($reviewForm.elements.posterUrlForm.value === 'N/A') {
        $reviewFormImg.setAttribute('src', 'images/noposter.png');
      } else {
        $reviewFormImg.setAttribute('src', $reviewForm.elements.posterUrlForm.value);
      }
    });
    xhr.send();
  }
}

var $posterUrlForm = document.querySelector('input[name="posterUrlForm"]');
var $reviewFormImg = document.querySelector('.review-form-img');
$posterUrlForm.addEventListener('input', updatePosterPreview);

function updatePosterPreview(event) {
  $reviewFormImg.setAttribute('src', $posterUrlForm.value);
}

var $starRating = document.querySelector('.star-rating');
$starRating.addEventListener('click', setStarRating);

function setStarRating(event) {
  var $stars = document.querySelectorAll('.star-icon');
  if (event.target.matches('.star-icon')) {
    var $starAmt = event.target.getAttribute('data-star');
    $starAmt = parseInt($starAmt);
    for (let i = 0; i < $starAmt; i++) {
      $stars[i].className = 'fas fa-star star-icon';
    }
    for (let i = $starAmt; i < $stars.length; i++) {
      $stars[i].className = 'far fa-star star-icon';
    }
    $starRating.setAttribute('data-star', event.target.getAttribute('data-star'));
  }
}

$reviewForm.addEventListener('submit', createReview);

function createReview(event) {
  event.preventDefault();
  var reviewObj = {
    title: $reviewForm.elements.movieTitleForm.value,
    posterUrl: $reviewForm.elements.posterUrlForm.value,
    reviewNotes: $reviewForm.elements.reviewNotesForm.value,
    starRating: $starRating.getAttribute('data-star'),
    reviewId: data.nextReviewId
  };
  data.nextReviewId++;
  data.reviews.unshift(reviewObj);
  $reviewFormImg.setAttribute('src', 'images/placeholder-image-poster.png');
  var $stars = document.querySelectorAll('.star-icon');
  for (let i = 0; i < $stars.length; i++) {
    $stars[i].className = 'far fa-star star-icon';
  }
  $starRating.setAttribute('data-star', '0');
  $reviewForm.reset();
  resetSearchBar();
  removeSearchResults();
}

function renderReview(reviewObj) {
  var $liEl = document.createElement('li');
  $liEl.className = 'column-half-review marg-1-1-2-bot text-align-center review-card';
  $liEl.setAttribute('data-review-id', reviewObj.revieId);
  var $divEl1 = document.createElement('div');
  $divEl1.className = 'pad-1-bot';
  var $imgEl = document.createElement('img');
  $imgEl.className = 'review-img';
  $imgEl.setAttribute('src', reviewObj.posterUrl);
  var $divEl2 = document.createElement('div');
  $divEl2.className = 'star-rating-review';
  $divEl2.setAttribute('data-star', '0');
  var $iEl1 = document.createElement('i');
  $iEl1.className = 'far fa-star star-icon-review';
  $iEl1.setAttribute('data-star', '1');
  var $iEl2 = document.createElement('i');
  $iEl2.className = 'far fa-star star-icon-review';
  $iEl2.setAttribute('data-star', '2');
  var $iEl3 = document.createElement('i');
  $iEl3.className = 'far fa-star star-icon-review';
  $iEl3.setAttribute('data-star', '3');
  var $iEl4 = document.createElement('i');
  $iEl4.className = 'far fa-star star-icon-review';
  $iEl4.setAttribute('data-star', '4');
  var $iEl5 = document.createElement('i');
  $iEl5.className = 'far fa-star star-icon-review';
  $iEl5.setAttribute('data-star', '5');
  var $divEl3 = document.createElement('div');
  $divEl3.className = 'pad-1';
  var $h3El = document.createElement('h3');
  $h3El.className = 'no-marg review-title';
  $h3El.textContent = reviewObj.title;
  var $pEl = document.createElement('p');
  $pEl.className = 'review-notes pad-2-bot';
  $pEl.textContent = reviewObj.reviewNotes;
  var $divEl4 = document.createElement('div');
  var $iEl6 = document.createElement('i');
  $iEl6.className = 'fas fa-pen-alt pen-icon';

  $divEl1.appendChild($imgEl);
  $divEl2.appendChild($iEl1);
  $divEl2.appendChild($iEl2);
  $divEl2.appendChild($iEl3);
  $divEl2.appendChild($iEl4);
  $divEl2.appendChild($iEl5);
  $divEl3.appendChild($h3El);
  $divEl3.appendChild($pEl);
  $divEl4.appendChild($iEl6);
  $liEl.appendChild($divEl1);
  $liEl.appendChild($divEl2);
  $liEl.appendChild($divEl3);
  $liEl.appendChild($divEl4);

  return $liEl;
}

window.addEventListener('DOMContentLoaded', displayReviews);
var $reviewList = document.querySelector('ul#reviews-list');

function displayReviews(event) {
  for (let i = 0; i < data.reviews.length; i++) {
    var $review = renderReview(data.reviews[i]);
    $reviewList.appendChild($review);
  }
}
