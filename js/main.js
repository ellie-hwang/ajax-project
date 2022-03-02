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
    for (let i = 0; i < $searchResultsRaw.length; i++) {
      var $result = renderSearchResult($searchResultsRaw[i]);
      $resultsList.appendChild($result);
    }
  });

  xhr.send();
  data.view = 'results-view';
}

var $resultsList = document.querySelector('#results-list');

function renderSearchResult(resultObj) {
  var $liEl = document.createElement('li');
  $liEl.className = 'result-card pad-1-bot marg-1-bot column-fourth';
  var $divEl1 = document.createElement('div');
  $divEl1.className = 'search-img-container';
  var $imgEl = document.createElement('img');
  $imgEl.className = 'search-img';
  $imgEl.setAttribute('src', resultObj.Poster);
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
