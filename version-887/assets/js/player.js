import { H as Hls } from "./hls-vendor-bbsaiqh1.js";

const hlsMap = new WeakMap();

export function initMoviePlayer(options) {
    const video = document.getElementById(options.videoId);
    const overlay = document.getElementById(options.overlayId);
    const playUrl = options.playUrl;
    if (!video || !overlay || !playUrl) {
        return;
    }

    let ready = false;

    const playVideo = () => {
        const attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(() => {
                overlay.classList.remove("is-hidden");
            });
        }
    };

    const prepare = () => {
        if (ready) {
            return;
        }
        ready = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = playUrl;
            video.load();
            return;
        }
        if (Hls.isSupported()) {
            const hls = new Hls({
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(playUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, playVideo);
            hlsMap.set(video, hls);
            return;
        }
        video.src = playUrl;
        video.load();
    };

    const activate = () => {
        overlay.classList.add("is-hidden");
        prepare();
        if (video.readyState >= 1) {
            playVideo();
        } else {
            video.addEventListener("loadedmetadata", playVideo, { once: true });
            window.setTimeout(playVideo, 700);
        }
    };

    overlay.addEventListener("click", activate);
    video.addEventListener("click", () => {
        if (video.paused) {
            activate();
        }
    });
    video.addEventListener("play", () => overlay.classList.add("is-hidden"));
    video.addEventListener("ended", () => overlay.classList.remove("is-hidden"));
}
