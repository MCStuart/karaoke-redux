// LYRIC INFO
const songList = {
  1: "And when I have some words, This is the way Ill sing, To a distortion box, To make the music sing, then Im gonna have to write a chorus, Gonna need to have a chorus, And this seems to be as good as any other place to sing it till Im blue in the face, yeah were gonna need to have a chorus, gonna have to write a chorus, and this seems to be as good as any other place to sing it till Im blue in the face, Happy with what you have to be happy with to be happy with what you have you have to be happy with what you have, happy with what you have to be happy with you have to be happy with what you have, to be happy with what you have, you have to be happy with what you have to be happy wiiith".split(', '),
  2: "Why men great 'til they gotta be great?  Woo, I just took a DNA test, turns out I'm 100% that bitch, Even when I'm crying crazy, Yeah, I got boy problems, that's the human in me, Bling bling, then I solve 'em, that's the goddess in me, You coulda had a bad bitch, non-committal, Help you with your career just a little, You're 'posed to hold me down, but you're holding me back, And that's the sound of me not calling you back, Why men great 'til they gotta be great?, Don't text me, tell it straight to my face, Best friend sat me down in the salon chair, Shampoo press, get you out of my hair, Fresh photos with the bomb lighting, New man on the Minnesota Vikings, Truth hurts, needed something more exciting, Bom bom bi dom bi dum bum bay".split(', ')
};

// INITIAL REDUX STATE
const initialState = {
  currentSongId: null,
  songsById: {
    1: {
      title: "Happy With What You Have To Be Happy With",
      artist: "King Crimson",
      songId: 1,
      songArray: songList[1],
      arrayPosition: 0,
    },
    2: {
      title: "Truth Hurts",
      artist: "Lizzo",
      songId: 2,
      songArray: songList[2],
      arrayPosition: 0,
    }
  }
};

// REDUX REDUCER
const lyricChangeReducer = (state = initialState.songsById, action) => {
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;
  switch (action.type) {
    case 'NEXT_LYRIC':
      newArrayPosition = state[action.currentSongId].arrayPosition + 1;
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: newArrayPosition
      })
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });
      return newSongsByIdStateSlice;
    case 'RESTART_SONG':
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: 0
      })
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });
      return newSongsByIdStateSlice;
    default:
      return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type) {
    case 'CHANGE_SONG':
      return action.newSelectedSongId
    default:
      return state;
  }
}

const rootReducer = this.Redux.combineReducers({
  currentSongId: songChangeReducer,
  songsById: lyricChangeReducer
});

// REDUX STORE
const { createStore } = Redux;
const store = createStore(rootReducer);

// JEST TESTS + SETUP
const { expect } = window;

expect(lyricChangeReducer(initialState.songsById, { type: 'NEXT_LYRIC', currentSongId: 2 })).toEqual({
  1: {
    title: "Happy With What You Have To Be Happy With",
    artist: "King Crimson",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "Truth Hurts",
    artist: "Lizzo",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 1,
  }
});

expect(lyricChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId: 1 })).toEqual({
  1: {
    title: "Happy With What You Have To Be Happy With",
    artist: "King Crimson",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "Truth Hurts",
    artist: "Lizzo",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 0,
  }
});

expect(rootReducer(initialState, { type: null })).toEqual(initialState);

expect(lyricChangeReducer(initialState.songsById, { type: null })).toEqual(initialState.songsById);

expect(store.getState().currentSongId).toEqual(songChangeReducer(undefined, { type: null }));

expect(store.getState().songsById).toEqual(lyricChangeReducer(undefined, { type: null }));

expect(songChangeReducer(initialState, { type: 'CHANGE_SONG', newSelectedSongId: 1 })).toEqual(1);

expect(songChangeReducer(initialState.currentSongId, { type: 'CHANGE_SONG', newSelectedSongId: 1 })).toEqual(1);

// RENDERING STATE IN DOM
const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }

  if (store.getState().currentSongId) {
    const currentLine = document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[store.getState().songsById[store.getState().currentSongId].arrayPosition]);
    document.getElementById('lyrics').appendChild(currentLine);
  } else {
    const selectSongMessage = document.createTextNode("Select a song from the menu above to sing along!");
    document.getElementById('lyrics').appendChild(selectSongMessage);
  }
}

const renderSongs = () => {
  console.log('renderSongs method successfully fired!');
  console.log(store.getState());
  // Retrieves songsById state slice from store:
  const songsById = store.getState().songsById;
  // Cycles through each key in songsById:
  for (const songKey in songsById) {
    // Locates song corresponding with each key, saves as 'song' constant:
    const song = songsById[songKey]
    // Creates <li>, <h3>, and <em> HTMl elements to render this song's
    // information in the DOM:
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    // Creates text node containing each song's title:
    const songTitle = document.createTextNode(song.title);
    // Creates text node containing each song's artist:
    const songArtist = document.createTextNode(' by ' + song.artist);
    // Adds songTitle text node to the <em> element we created 3 lines up:
    em.appendChild(songTitle);
    // Adds <em> element that now contains song title to <h3> element created
    // 5 lines up:
    h3.appendChild(em);
    // Also adds songArtist text node created 2 lines up to <h3> element created
    // 6 lines up:
    h3.appendChild(songArtist);
    // Adds click event listener to same  <h3> element, when this <h3> is clicked,
    // an event handler called selectSong() will run, using song's ID as argument:
    h3.addEventListener('click', function () {
      selectSong(song.songId);
    });
    // Adds entire <h3> element to the <li> element created 11 lines above:
    li.appendChild(h3);
    // Appends this <li> element to the <ul> in index.html with a 'songs' ID:
    document.getElementById('songs').appendChild(li);
  }
}

window.onload = function () {
  renderSongs();
  renderLyrics();
}

// CLICK LISTENER
const userClick = () => {
  if (store.getState().songsById[store.getState().currentSongId].arrayPosition === store.getState().songsById[store.getState().currentSongId].songArray.length - 1) {
    store.dispatch({
      type: 'RESTART_SONG',
      currentSongId: store.getState().currentSongId
    });
  } else {
    store.dispatch({
      type: 'NEXT_LYRIC',
      currentSongId: store.getState().currentSongId
    });
  }
}

const selectSong = (newSongId) => {
  let action;
  if (store.getState().currentSongId) {
    action = {
      type: 'RESTART_SONG',
      currentSongId: store.getState().currentSongId
    }
    store.dispatch(action);
  }
  action = {
    type: 'CHANGE_SONG',
    newSelectedSongId: newSongId
  }
  store.dispatch(action);
}

// SUBSCRIBE TO REDUX STORE
store.subscribe(renderLyrics);