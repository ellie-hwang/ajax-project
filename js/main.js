/* global data */
/* exported data */

var $searchForm = document.querySelector('#search-form');

$searchForm.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();
  var $movieTitle = $searchForm.elements.movieTitle.value;

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
  $iEl.className = 'fas fa-info-circle';
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

// var $viewContainer = document.querySelector('div#view-container');
// $viewContainer.addEventListener('click', swapView);

var $searchView = document.querySelector('div#search-view');
var $resultsView = document.querySelector('div#results-view');

// function swapView(event) {
//   if (event.target.matches('#search-button') && data.view === 'results-view') {
//     $searchView.className = 'hidden';
//     $resultsView.className = '';
//   }
// }

var $navBar = document.querySelector('#nav-bar');
// var $navSearch = document.querySelector('#nav-search');

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
