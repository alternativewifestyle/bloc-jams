var setSong = function(songNumber) {
  if (currentSoundFile) {
       currentSoundFile.stop();
   }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  // #1
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        // #2
        formats: [ 'mp3' ],
        preload: true
    });
    setVolume(currentVolume);

};
var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]')
};

var createSongRow = function(songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
        + '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '<td class="song-item-title">' + songName + '</td>'
        + '<td class="song-item-duration">' + songLength + '</td>'
      +'</tr>'
  ;

  var $row = $(template);

  var clickHandler = function() {

          var songNumber = parseInt($(this).attr('data-song-number'));

          if (currentlyPlayingSongNumber !== null) {
              // Revert to song number for currently playing song because user started playing new song.
              var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

              currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
              currentlyPlayingCell.html(currentlyPlayingSongNumber);
          }

           if (currentlyPlayingSongNumber !== songNumber) {
               // Switch from Play -> Pause button to indicate new song is playing.
               setSong(songNumber);
              currentSoundFile.play();
               $(this).html(pauseButtonTemplate);
               setSong(currentAlbum.songs[songNumber - 1]);
               updatePlayerBarSong();
           } else if (currentlyPlayingSongNumber === songNumber) {

              if (currentSoundFile.isPaused()) {
                  $(this).html(pauseButtonTemplate);
                 $('.main-controls .play-pause').html(playerBarPauseButton);
                  currentSoundFile.play();
              } else {
                  $(this).html(playButtonTemplate);
                  $('.main-controls .play-pause').html(playerBarPlayButton);
                  currentSoundFile.pause();
              }

           }

       };

  var onHover = function(event) {
    var songNumberElement = $(this).find('.song-item-number');
    var songNumber = songNumberElement.attr('data-song-number');

    if(songNumber !== currentlyPlayingSongNumber) {
      songNumberElement.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberElement = $(this).find('.song-item-number');
    var songNumber = songNumberElement.attr('data-song-number');

    if(songNumber !== currentlyPlayingSongNumber) {
      songNumberElement.html(songNumber);
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);

  return $row;
};

var setCurrentAlbum = function(album) {

    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo= $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.text('src', album.albumArtUrl);

    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration)
      $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  $('.main-controls .play-pause').html(playerBarPauseButton);
  $('.song-name').text(currentSongFromAlbum.title);
  $('.artist-song-mobile').text(currentAlbum.songs[currentlyPlayingSongNumber - 1].title + " - " + currentAlbum.artist);
  $('.artist-name').text(currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {

    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();

    setSong(currentAlbum.songs[currentSongIndex]);

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();

    setSong(currentAlbum.songs[currentSongIndex]);

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;


var $previousButton = $('.main-controls .previous');
var $playButton = $('.main-controls .play-pause');
var $nextButton = $('.main-controls .next');

var togglePlayFromPlayerBar = function() {
 	var $currentSong = getSongNumberCell(currentlyPlayingSongNumber);
 	if(currentSoundFile) {
 		if(currentSoundFile.isPaused()) {
 			$currentSong.html(pauseButtonTemplate);
 			$(this).html(playerBarPauseButton);
 			currentSoundFile.play();
 		} else {
 			$currentSong.html(playButtonTemplate);
 			$(this).html(playerBarPlayButton);
 			currentSoundFile.pause();
 		}
 	}
 };


$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playButton.click(togglePlayFromPlayerBar);
});
