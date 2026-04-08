let currentImages = [];
let currentImageIndex = 0;

function normalizeYoutubeUrl(url) {
    if (!url) return "";

    if (url.includes("youtube.com/embed/")) {
        return url;
    }

    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);

    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }

    return url;
}

function loadChapter(chapter, element, event) {
    if (event) event.stopPropagation();

    const viewer = document.getElementById("chapterViewer");
    const downloadBtn = document.getElementById("downloadBtn");
    const fullscreenBtn = document.getElementById("fullscreenBtn");

    if (!viewer || !downloadBtn || !fullscreenBtn) return;

    if (chapter.type === "pdf") {
        fullscreenBtn.style.display = "flex";
        downloadBtn.style.display = "inline-flex";
        downloadBtn.href = chapter.file || "#";
        downloadBtn.setAttribute("download", "");

        const isMobile = window.innerWidth <= 768;
        const cleanFilePath = (chapter.file || "").replace("..", "");
        const fullFileUrl = window.location.origin + cleanFilePath;

        if (isMobile) {
            viewer.innerHTML = `
                <iframe
                    id="pdfViewer"
                    src="https://docs.google.com/gview?url=${encodeURIComponent(fullFileUrl)}&embedded=true"
                    title="Chapter PDF"
                    style="width:100%; height:100%; border:none;">
                </iframe>
            `;
        } else {
            viewer.innerHTML = `
                <iframe
                    id="pdfViewer"
                    src="${chapter.file}"
                    title="Chapter PDF">
                </iframe>
            `;
        }
    }

    else if (chapter.type === "images") {
        fullscreenBtn.style.display = "none";

        if (chapter.download) {
            downloadBtn.style.display = "inline-flex";
            downloadBtn.href = chapter.download;
            downloadBtn.setAttribute("download", "");
        } else {
            downloadBtn.style.display = "none";
        }

        currentImages = chapter.images || [];
        currentImageIndex = 0;

        viewer.innerHTML = `
            <div class="image-slider-fixed">
                <div class="image-top-content">
                    <h3 id="imageTitle"></h3>
                    <p id="imageDesc"></p>
                </div>

                <div class="image-display-area">
                    <button class="slider-btn prev" onclick="prevImage()" title="Previous">
                        <i class="fas fa-chevron-left"></i>
                    </button>

                    <img id="sliderImage" class="image-slide" src="" alt="chapter image" />

                    <button class="slider-btn next" onclick="nextImage()" title="Next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div class="slider-counter" id="sliderCounter"></div>
            </div>
        `;

        updateSlider();
    }

    else if (chapter.type === "video") {
        fullscreenBtn.style.display = "none";

        if (chapter.download) {
            downloadBtn.style.display = "inline-flex";
            downloadBtn.href = chapter.download;
            downloadBtn.setAttribute("download", "");
        } else {
            downloadBtn.style.display = "none";
        }

        const videoUrl = normalizeYoutubeUrl(chapter.video);

        if (videoUrl.includes("youtube")) {
            viewer.innerHTML = `
                <iframe
                    src="${videoUrl}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            `;
        } else {
            viewer.innerHTML = `
                <video class="chapter-video" controls>
                    <source src="${chapter.video}" type="video/mp4">
                    Your browser does not support video.
                </video>
            `;
        }
    }

    else if (chapter.type === "file") {
        fullscreenBtn.style.display = "none";
        downloadBtn.style.display = "inline-flex";
        downloadBtn.href = chapter.file || "#";
        downloadBtn.setAttribute("download", "");

        viewer.innerHTML = `
            <div class="empty-message">
                This file is available for download.
            </div>
        `;
    }

    else {
        fullscreenBtn.style.display = "none";
        downloadBtn.style.display = "none";

        viewer.innerHTML = `
            <div class="empty-message">
                No content available for this chapter yet.
            </div>
        `;
    }

    document.querySelectorAll(".item").forEach(item => item.classList.remove("active"));
    if (element) element.classList.add("active");

    const playlist = document.getElementById("playlist-container");
    const menuBtn = document.querySelector(".mobile-menu-btn");

    if (playlist) playlist.classList.remove("show");
    if (menuBtn) menuBtn.classList.remove("hidden");
}

function updateSlider() {
    const img = document.getElementById("sliderImage");
    const title = document.getElementById("imageTitle");
    const desc = document.getElementById("imageDesc");
    const counter = document.getElementById("sliderCounter");

    if (!img || !currentImages.length) return;

    const current = currentImages[currentImageIndex];

    img.src = current.src || "";
    img.alt = current.title || "chapter image";
    title.textContent = current.title || "";
    desc.textContent = current.desc || "";
    counter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
}

function nextImage() {
    if (!currentImages.length) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateSlider();
}

function prevImage() {
    if (!currentImages.length) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateSlider();
}

function openFullscreen() {
    const viewer = document.getElementById("chapterViewer");
    if (!viewer) return;

    if (viewer.requestFullscreen) {
        viewer.requestFullscreen();
    } else if (viewer.webkitRequestFullscreen) {
        viewer.webkitRequestFullscreen();
    } else if (viewer.msRequestFullscreen) {
        viewer.msRequestFullscreen();
    }
}

function togglePlaylist(event) {
    if (event) event.stopPropagation();

    const playlist = document.getElementById("playlist-container");
    const menuBtn = document.querySelector(".mobile-menu-btn");

    if (!playlist || !menuBtn) return;

    playlist.classList.toggle("show");

    if (playlist.classList.contains("show")) {
        menuBtn.classList.add("hidden");
    } else {
        menuBtn.classList.remove("hidden");
    }
}

document.addEventListener("click", function (event) {
    const playlist = document.getElementById("playlist-container");
    const menuBtn = document.querySelector(".mobile-menu-btn");

    if (!playlist || !menuBtn) return;

    if (
        playlist.classList.contains("show") &&
        !playlist.contains(event.target) &&
        !menuBtn.contains(event.target)
    ) {
        playlist.classList.remove("show");
        menuBtn.classList.remove("hidden");
    }
});

async function loadWordpressChapters() {
    const container = document.getElementById("playlistItems");
    if (!container) return;

    try {
        const res = await fetch("../data/wordpress.json");
        if (!res.ok) throw new Error("Failed to load wordpress.json");

        const data = await res.json();
        const chapters = data.chapters || [];

        container.innerHTML = "";

        if (!chapters.length) {
            container.innerHTML = `<div class="item active">No chapters available</div>`;
            return;
        }

        chapters.forEach((chapter, index) => {
            const item = document.createElement("div");
            item.className = index === 0 ? "item active" : "item";
            item.textContent = chapter.title || `Chapter ${index + 1}`;

            item.addEventListener("click", function (event) {
                loadChapter(chapter, item, event);
            });

            container.appendChild(item);
        });

        loadChapter(chapters[0], container.firstElementChild);

    } catch (error) {
        console.error("Error loading WordPress chapters:", error);
        container.innerHTML = `<div class="item active">Failed to load chapters</div>`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadWordpressChapters();
});