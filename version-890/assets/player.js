(function () {
  function setupMoviePlayer(videoId, source) {
    var video = document.getElementById(videoId);
    var cover = document.querySelector('[data-player-target="' + videoId + '"]');
    var loaded = false;
    var hls = null;

    if (!video) {
      return;
    }

    function loadSource() {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function startPlayback() {
      loadSource();

      if (cover) {
        cover.classList.add('is-hidden');
      }

      video.controls = true;
      var result = video.play();

      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
}());
