document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const postsData = [
        {
            title: "Fresh Picks: 10 New Anime Series Launching in 2025",
            author: "Marko Jovanovic",
            date: "July 1, 2025",
            image: "img/Alya.jpg",
            route: "/first" // Unique route per post
        },
        {
            title: "Top 5 Must-Watch Anime of the Season",
            author: "Sakura Tanaka",
            date: "June 25, 2025",
            image: "img/Alya.jpg",
            route: "/top" // Unique route per post
        }
    ];

    // Render each post
    postsData.forEach(post => {
        const postElement = document.createElement('a');
        postElement.className = 'post-item';
        postElement.setAttribute('data-route', post.route); // SPA navigation
        postElement.href="post/first.html"

        postElement.innerHTML = `
            <div class="post-content">
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="post-text">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-meta">by ${post.author} | ${post.date}</p>
                </div>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });
});