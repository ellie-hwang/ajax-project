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
    }
  });

  xhr.send();
}

var $resultsList = document.querySelector('#results-list');

function renderSearchResult(resultObj) {
  var $liEl = document.createElement('li');
  $liEl.className = 'result-card pad-1-bot marg-1-bot column-fourth';
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

var $navBar = document.querySelector('#nav-bar');

$navBar.addEventListener('click', swapViewNav);

function swapViewNav(event) {
  if (event.target.matches('#nav-search')) {
    data.view = 'search-view';
    $searchView.className = '';
    $resultsView.className = 'hidden';
    $searchForm.elements.movieTitle.value = '';
    var $h1Search = document.querySelector('#h1-search');
    $h1Search.textContent = 'Search';
    var $pNoResult = document.querySelector('#p-no-results');
    $pNoResult.className = 'hidden white-text text-align-center';
    $searchForm.elements.movieTitle.value = '';
    var $liElementList = document.querySelectorAll('li');
    for (let i = 0; i < $liElementList.length; i++) {
      $liElementList[i].remove();
    }
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

// $starRating.addEventListener
