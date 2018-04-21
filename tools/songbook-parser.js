const fs = require('fs');
const request = require('request');

const fileContent = fs.readFileSync('', 'utf-8');

let songs = [];
const rawSongs = fileContent.split(/\n(?=\d+\.)/);

rawSongs.some(rawSong => {
  // console.log(rawSong);
  rawSong = rawSong.replace(/\f(.*\n)*.*Bangalore\n?/, ''); // Remove form feed, song book name, name of church
  const song = {};
  const lines = rawSong.split('\n');

  const keyMatcher = /\n*[ ]*key[ ]*:[ ]*\n*[ ]*(\w+)/i;
  const keyMatches = keyMatcher.exec(rawSong);
  song.key = keyMatches ? keyMatches[1] : '';

  const writersMatches = /\n(.*\|)/.exec(rawSong);
  const writers = writersMatches ? rawSong.slice(writersMatches.index) : lines[lines.length - 1];
  song.writers = writers.replace(/\n/g, ' ').trim();

  let lyricsStartIdx = /\n\w+\s+\d+\n/.exec(rawSong).index;
  let lyrics = rawSong.slice(lyricsStartIdx, -1 * song.writers.length); // Exclude the writers
  song.lyrics = lyrics.trim();

  let titleSection = rawSong.slice(0, lyricsStartIdx).split('-')[0]; // 1. Bless the lord - Key: G
  titleSection = titleSection.replace(/\n/g, ' ');
  const titleLineMatches = /^(\d+)\.(.*)/i.exec(titleSection);
  song.number = titleLineMatches[1].trim();
  song.title = titleLineMatches[2].trim();

  songs.push(song);
  // console.log(song);
});

let success = 0;

// songs = songs.slice(0, 2);
songs.forEach(song => {
  request.post({
    url: process.argv[2] + "/api/songs",
    json: true,
    body: song
  }, (err, resp, body) => {
    if (err) {
      return console.error(err);
    }
    success++;
    if (success === songs.length) {
      console.log('\nCompleted successfully!');
    }
  });
});
