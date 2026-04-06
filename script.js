// ================= NAV SCROLL =================
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

// ================= ANIMATION =================
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

// ================= COURSE SYSTEM =================
document.addEventListener("DOMContentLoaded", () => {
    loadCourseVideos();
});

async function loadCourseVideos() {
    const playlist = document.getElementById("playlistItems");
    const mainVideo = document.getElementById("main-video");

    if (!playlist || !mainVideo) return;

    try {
        const file = playlist.dataset.file;

        const res = await fetch(file);
        const data = await res.json();

        playlist.innerHTML = "";

        data.videos.forEach((video, index) => {
            const item = document.createElement("div");
            item.className = "item";
            item.textContent = video.title;

            item.onclick = function (event) {
                changeVideo(video.link, item, event);
            };

            if (index === 0) {
                item.classList.add("active");
                mainVideo.src = video.link;
            }

            playlist.appendChild(item);
        });

    } catch (err) {
        console.error("Error:", err);
    }
}

// ================= CHANGE VIDEO =================
function changeVideo(link, element, event) {
    if (event) event.stopPropagation();

    const mainVideo = document.getElementById("main-video");
    mainVideo.src = link;

    document.querySelectorAll(".item").forEach(i => i.classList.remove("active"));
    element.classList.add("active");

    const playlist = document.getElementById("playlist-container");
    const btn = document.querySelector(".mobile-menu-btn");

    playlist.classList.remove("show");
    btn.classList.remove("hidden");
}

// ================= MENU =================
function togglePlaylist(event) {
    if (event) event.stopPropagation();

    const playlist = document.getElementById("playlist-container");
    const btn = document.querySelector(".mobile-menu-btn");

    playlist.classList.toggle("show");

    if (playlist.classList.contains("show")) {
        btn.classList.add("hidden");
    } else {
        btn.classList.remove("hidden");
    }
}

document.addEventListener("click", function (e) {
    const playlist = document.getElementById("playlist-container");
    const btn = document.querySelector(".mobile-menu-btn");

    if (
        playlist.classList.contains("show") &&
        !playlist.contains(e.target) &&
        !btn.contains(e.target)
    ) {
        playlist.classList.remove("show");
        btn.classList.remove("hidden");
    }
});