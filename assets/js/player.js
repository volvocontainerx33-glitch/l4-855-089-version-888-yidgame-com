(function() {
  function attachStream(video, streamUrl) {
    if (video.dataset.ready === "true") {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      video._hlsInstance = hls;
    } else {
      video.src = streamUrl;
    }

    video.dataset.ready = "true";
  }

  window.initMoviePlayer = function(streamUrl) {
    var root = document.querySelector("[data-player-root]");
    if (!root) {
      return;
    }

    var video = root.querySelector("video");
    var overlay = root.querySelector("[data-play-overlay]");
    if (!video || !overlay) {
      return;
    }

    function start() {
      attachStream(video, streamUrl);
      overlay.classList.add("is-hidden");
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function() {
          overlay.classList.remove("is-hidden");
        });
      }
    }

    overlay.addEventListener("click", start);
    video.addEventListener("click", function() {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });
    video.addEventListener("play", function() {
      overlay.classList.add("is-hidden");
    });
  };
})();
