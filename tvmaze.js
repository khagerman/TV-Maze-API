/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  try {
    const url = `http://api.tvmaze.com/search/shows?q=${query}`;
    const res = await axios.get(url);
    let shows = res.data.map((res) => {
      return {
        id: res.show.id,
        name: res.show.name,
        summary: res.show.summary,
        image: res.show.image
          ? res.show.image.medium
          : "https://tinyurl.com/tv-missing",
      };
    });
    console.log(shows);
    return shows;
  } catch (e) {
    alert("TV show not found :(");
  }
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
const showsList = document.querySelector("#shows-list");
function populateShows(shows) {
  showsList.innerHTML = "";

  for (let show of shows) {
    let item = document.createElement("div");
    item.className = `col-md-6 col-lg-3 Show" data-show-id="${show.id}`;
    item.innerHTML = `
        <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img class="card-img-top" src="${show.image}">
            <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id="episodebtn" class="btn btn-info">Episode Info</button>
           </div>
          </div>
      </div>
      `;
    showsList.append(item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */
const submit = document.querySelector("#submit");
submit.addEventListener("click", async function (e) {
  e.preventDefault();

  let query = document.querySelector("#search-query").value;
  console.log(query);
  if (!query) return;

  document.querySelector("#episodes-area").style.display = "none";

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const url = `http://api.tvmaze.com/shows/${id}/episodes`;
  const res = await axios.get(url);
  let episodes = res.data.map((episode) => {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
    };
  });
  return episodes;
}
//
// data-show-id="${show.id}"
async function populateEpisodes(episode) {
  for (let episode of episodes) {
    let episodeList = document.querySelector("#episodes-list");
    let newLI = document.createElement("LI");
    newLI.innerText = `${episode.name}
         (season ${episode.season}, episode ${episode.number})`;
    episodeList.append(newLI);
  }
}

document.addEventListener("click", async function (e) {
  document.querySelector("#episodes-area").style.display = "";
  if (e.target.id == "episodebtn") {
    console.log(e.target.closest("div"));
    let id = e.target.closest(".col-md-6 col-lg-3 Show").dataset.showId;
  }
});
