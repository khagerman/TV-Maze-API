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
    let shows = res.data.map((result) => {
      return {
        id: result.show.id,
        year: result.show.premiered.slice(0, 4),
        name: result.show.name,
        summary: result.show.summary,
        image: result.show.image
          ? result.show.image.medium
          : "https://tinyurl.com/tv-missing",
      };
    });
    return shows;
  } catch (e) {
    alert("TV show not found!!");
  }
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img class="card-img-top" src="${show.image}">
            <h5 class="card-title">${show.name}</h5>
            <h6>Premiered: ${show.year}</h6>
             <p class="card-text">${show.summary}</p>
             <button  class="btn btn-info get-episodes">Episode Info</button>
           </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();

  $("#episodes-area").hide();

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
async function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `
    );

    $episodesList.append($item);
  }
  $("#episodes-area").show();
}
$("#shows-list").on(
  "click",
  ".get-episodes",
  async function handleEpisodeClick(e) {
    let id = $(e.target).closest(".Show").data("show-id");
    let episodes = await getEpisodes(id);
    populateEpisodes(episodes);
  }
);
