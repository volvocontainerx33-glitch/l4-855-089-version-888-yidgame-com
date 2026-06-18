function initMoviePlayer(videoUrl) {
  var video = document.getElementById("movie-video");
  var cover = document.getElementById("play-cover");
  if (!video || !cover || !videoUrl) {
    return;
  }
  var attached = false;
  var hls = null;
  function tryPlay() {
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }
  function attach() {
    if (attached) {
      return;
    }
    attached = true;
    video.setAttribute("controls", "controls");
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", tryPlay, { once: true });
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true });
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MEDIA_ATTACHED, function () {
        hls.loadSource(videoUrl);
      });
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        tryPlay();
      });
      return;
    }
    video.src = videoUrl;
    video.addEventListener("loadedmetadata", tryPlay, { once: true });
  }
  function start() {
    cover.classList.add("is-hidden");
    attach();
    tryPlay();
  }
  cover.addEventListener("click", start);
  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });
  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
