const API_KEY = "2c9a7b29c70306a2475bdff8f792b247";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

let currentMovies = [];

async function getMovies() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    currentMovies = data.results;
    render(currentMovies);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

const mainCard = document.querySelector("#movie-container");
const noData = document.querySelector("#noData");
function render(array) {
  if (array.length === 0) {
    mainCard.innerHTML = "";
    noData.textContent = "No Data";
  } else {
    noData.textContent = "";
    mainCard.innerHTML = "";
    array.forEach(function (arr) {
      let card = document.createElement("div");
      card.classList.add("movie-card");
      card.dataset.id = arr.id;
      let posterCard = document.createElement("div");
      posterCard.classList.add("poster-wrapper");
      let posterImg = document.createElement("img");
      posterImg.src = IMG_BASE_URL + arr.poster_path;
      posterImg.alt = arr.title;
      let movieInfo = document.createElement("div");
      movieInfo.classList.add("movie-info");
      let h3 = document.createElement("h3");
      h3.textContent = arr.title;
      let meta = document.createElement("div");
      meta.classList.add("meta");
      let date = document.createElement("span");
      date.textContent = arr.release_date.substring(0, 4);
      let rating = document.createElement("span");
      rating.textContent = arr.vote_average;

      let overView = document.createElement("p");
      overView.classList.add("overview");
      overView.textContent = arr.overview;

      posterCard.appendChild(posterImg);
      movieInfo.appendChild(h3);
      meta.appendChild(date);
      meta.appendChild(rating);
      movieInfo.appendChild(meta);
      movieInfo.appendChild(overView);
      card.appendChild(posterCard);
      card.appendChild(movieInfo);
      mainCard.appendChild(card);
    });
  }
}

let search = document.querySelector("#search-input");

// const SEARCH_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

// search.addEventListener("input", function(){
//     let filt = currentMovies.filter(function(arr){
//         return arr.title.toLowerCase().includes(search.value.toLowerCase())
//     })
//     render(filt)
// })

// Delete your old search.addEventListener and replace it with this:

const SEARCH_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

search.addEventListener("input", async function () {
  const searchTerm = search.value;

  // If the search bar has text, fetch the searched movies
  if (searchTerm && searchTerm !== "") {
    try {
      const response = await fetch(SEARCH_API_URL + searchTerm);
      const data = await response.json();
      currentMovies = data.results;
      render(currentMovies);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  } else {
    // If the search bar is empty, load the popular movies again
    getMovies();
  }
});

getMovies();

const searchBtn = document.querySelector("#search-btn");
const close = document.querySelector("#close");

searchBtn.addEventListener("click", function () {
  searchBtn.style.display = "none";
  search.style.display = "block";
  close.style.display = "block";
});

close.addEventListener("click", function () {
  search.value = "";
  search.style.display = "none";
  close.style.display = "none";
  searchBtn.style.display = "block";
});

const mode = document.querySelector("#mode");
const modeIcon = document.querySelector("#modeIcon");

mode.addEventListener("click", function () {
  document.body.classList.toggle("light-mode");
  if (document.body.classList.contains("light-mode")) {
    modeIcon.classList.remove("ri-sun-line");
    modeIcon.classList.add("ri-moon-line");
  } else {
    modeIcon.classList.remove("ri-moon-line");
    modeIcon.classList.add("ri-sun-line");
  }
});

const upButton = document.querySelector(".floating-btn");

upButton.style.display = "none";

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    upButton.style.display = "block";
  } else {
    upButton.style.display = "none";
  }
});

upButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});


async function getCast(id) {
  try{
  const CAST_API_URL = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`;

  const response = await fetch(CAST_API_URL)
  const data = await response.json()
  console.log("Cast Data:", data.cast);
  }catch(error){
    console.log(error)
  }
}

mainCard.addEventListener("click", async function (event) {
  const clickCard = event.target.closest(".movie-card");
  if (!clickCard) return;

  let cardId = clickCard.dataset.id;

  const selectMovie = currentMovies.find(function (arr) {
    // FIX 1: Convert the string to a Number
    return arr.id === Number(cardId);
  });

  document.querySelector("#modal-title").textContent = selectMovie.title;
  document.querySelector("#modal-plot").textContent = selectMovie.overview;
  document.querySelector("#modal-img").src =
    IMG_BASE_URL + selectMovie.poster_path;
  getCast(selectMovie.id)

  // FIX 2: Actually unhide the modal box!
  document.querySelector("#movie-modal").style.display = "flex";
});

document.querySelector("#close-modal").addEventListener("click", function(){
  document.querySelector("#movie-modal").style.display = "none";
})