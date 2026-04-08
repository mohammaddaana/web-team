const sections = document.querySelectorAll("section, footer");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
});

const overlay = document.querySelector(".hero-overlay");

window.addEventListener("scroll", () => {
    if (!overlay) return;

    let darkness = window.scrollY / window.innerHeight;
    if (darkness > 1) darkness = 1;

    overlay.style.background = `rgba(0, 0, 0, ${0.2 + darkness * 0.6})`;
});

const animatedElements = document.querySelectorAll(".section-title, .work-card");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.15
});

animatedElements.forEach(el => observer.observe(el));

/* =========================
   TEAM
========================= */

async function loadTeamMembers() {
    const teamContainer = document.getElementById("teamContainer");
    if (!teamContainer) return;

    try {
        const response = await fetch("data/team.json");
        if (!response.ok) throw new Error("Failed to load team.json");

        const data = await response.json();
        const members = data.members || [];

        teamContainer.innerHTML = "";

        if (members.length === 0) {
            teamContainer.innerHTML = `<p>No team members yet</p>`;
            return;
        }

        members.forEach(member => {
            const card = document.createElement("div");
            card.className = "work-card show";

            card.innerHTML = `
                <img src="${member.image}" alt="${member.name}" loading="lazy" />
                <div class="work-content">
                    <h3 class="section-title show">${member.name}</h3>
                    <p class="section-title show">${member.role}</p>
                </div>
                <div class="card-hover">
                    <h3>${member.name}</h3>
                    <p>${member.department}</p>
                    <div class="social-icons">
                        ${member.instagram ? `<a href="${member.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ""}
                        ${member.linkedin ? `<a href="${member.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ""}
                        ${member.github ? `<a href="${member.github}" target="_blank"><i class="fab fa-github"></i></a>` : ""}
                    </div>
                </div>
            `;

            teamContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading team members:", error);
    }
}

/* =========================
   VIDEO COURSES
========================= */

function getYoutubeVideoId(url) {
    if (!url) return "";

    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;
    const match = url.match(regExp);

    return match ? match[1] : "";
}

function getYoutubeEmbedUrl(url) {
    const videoId = getYoutubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function changeVideo(videoUrl, clickedElement = null) {
    const iframe = document.getElementById("main-video");
    if (!iframe) return;

    const embedUrl = getYoutubeEmbedUrl(videoUrl);
    iframe.src = embedUrl;

    document.querySelectorAll("#playlistItems .item").forEach(item => {
        item.classList.remove("active");
    });

    if (clickedElement) {
        clickedElement.classList.add("active");
    }

    const playlist = document.getElementById("playlist-container");
    const menuBtn = document.querySelector(".mobile-menu-btn");

    if (playlist) playlist.classList.remove("show");
    if (menuBtn) menuBtn.classList.remove("hidden");
}

function renderPlaylist(videos) {
    const playlistItems = document.getElementById("playlistItems");
    if (!playlistItems) return;

    if (!videos || !videos.length) {
        playlistItems.innerHTML = `<div class="item active">No videos available</div>`;
        return;
    }

    playlistItems.innerHTML = "";

    videos.forEach((video, index) => {
        const item = document.createElement("div");
        item.className = index === 0 ? "item active" : "item";
        item.textContent = video.title || `Video ${index + 1}`;

        item.addEventListener("click", function () {
            changeVideo(video.link, item);
        });

        playlistItems.appendChild(item);
    });

    changeVideo(videos[0].link, playlistItems.firstElementChild);
}

async function loadCourseVideos() {
    const playlistItems = document.getElementById("playlistItems");
    const iframe = document.getElementById("main-video");
    const courseName = document.body.dataset.course;

    if (!playlistItems || !iframe || !courseName) return;

    try {
        const response = await fetch(`../data/${courseName}.json`);
        if (!response.ok) throw new Error(`Failed to load ${courseName}.json`);

        const data = await response.json();
        renderPlaylist(data.videos || []);
    } catch (error) {
        console.error("Error loading course videos:", error);
        playlistItems.innerHTML = `<div class="item active">Failed to load videos</div>`;
        iframe.src = "";
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

document.addEventListener("DOMContentLoaded", () => {
    loadCourseVideos();
    loadTeamMembers();
});