/* exported data */

var data = {
  view: 'search-form',
  reviews: [],
  editing: null,
  nextReviewId: 1
};

var previousDataJSON = localStorage.getItem('reviews-local-storage');
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', saveEntry);

function saveEntry(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('reviews-local-storage', dataJSON);
}
