const sections = document.querySelectorAll("section, footer");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

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

    let darkness = window.scrollY / window.innerHeight;

    if (darkness > 1) darkness = 1;

    overlay.style.background = `rgba(0, 0, 0, ${0.2 + darkness * 0.6})`;
});

const animatedElements = document.querySelectorAll(
    ".section-title, .work-card"
);

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

animatedElements.forEach(el => observer.observe(el));


//mohammad dana
//mohammad dana
//mohammad dana
//mohammad dana
//mohammad dana

function changeVideo(videoId) {

    document.getElementById('main-video').src = "https://www.youtube.com/embed/" + videoId;
    
    const items = document.querySelectorAll('.item');
    items.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
}
// 1. دالة تغيير الفيديو وإغلاق القائمة فوراً
function changeVideo(videoId, element, event) {
    // منع انتقال الضغطة لأي عناصر أخرى (مهم جداً)
    if (event) event.stopPropagation();

    // تغيير مصدر الفيديو
    const mainVideo = document.getElementById('main-video');
    mainVideo.src = "https://www.youtube.com/embed/" + videoId;
    
    // تحديث العنصر النشط
    document.querySelectorAll('.item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    // إغلاق القائمة بشكل صريح وحازم
    const playlist = document.getElementById('playlist-container');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    playlist.classList.remove('show');
    menuBtn.classList.remove('hidden');
    
    console.log("تم تغيير الفيديو وإغلاق القائمة"); // للتأكد في الـ Console
}

// 2. دالة فتح/إغلاق القائمة عبر الزر
function togglePlaylist(event) {
    if (event) event.stopPropagation();
    const playlist = document.getElementById('playlist-container');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    playlist.classList.toggle('show');

    if (playlist.classList.contains('show')) {
        menuBtn.classList.add('hidden');
    } else {
        menuBtn.classList.remove('hidden');
    }
}

// 3. إغلاق القائمة عند النقر في أي مكان فارغ (باستثناء القائمة والزر)
document.addEventListener('click', function(event) {
    const playlist = document.getElementById('playlist-container');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (playlist.classList.contains('show') && 
        !playlist.contains(event.target) && 
        !menuBtn.contains(event.target)) {
        
        playlist.classList.remove('show');
        menuBtn.classList.remove('hidden');
    }
});


document.addEventListener("DOMContentLoaded", () => {
    // شغّل الكورسات فقط إذا كانت الدالة موجودة
    if (typeof loadCourseVideos === "function") {
        loadCourseVideos();
    }

    loadTeamMembers();
});

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