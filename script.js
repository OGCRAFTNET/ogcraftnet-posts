document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const uploadSection = document.getElementById('uploadSection');
    const reelsSection = document.getElementById('reelsSection');
    const communitySection = document.getElementById('communitySection');
    const loginForm = document.getElementById('loginForm');
    const postForm = document.getElementById('postForm');
    const postContent = document.getElementById('postContent');
    const mediaInput = document.getElementById('mediaInput');
    const postList = document.getElementById('post-list');
    const communityList = document.getElementById('community-list');
    const logoutLink = document.getElementById('logout');
    const loadingBar = document.getElementById('loadingBar');

    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let communityPosts = JSON.parse(localStorage.getItem('communityPosts')) || [];

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        loginSection.style.display = 'none';
        uploadSection.style.display = 'block';
        document.getElementById('uploadTab').click();
        logoutLink.style.display = 'block';
    });

    // Logout
    logoutLink.addEventListener('click', () => {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        loginSection.style.display = 'block';
        uploadSection.style.display = 'none';
        logoutLink.style.display = 'none';
    });

    // Tab-Navigation
    document.getElementById('uploadTab').addEventListener('click', () => {
        uploadSection.style.display = 'block';
        reelsSection.style.display = 'none';
        communitySection.style.display = 'none';
    });

    document.getElementById('reelsTab').addEventListener('click', () => {
        uploadSection.style.display = 'none';
        reelsSection.style.display = 'block';
        communitySection.style.display = 'none';
        displayReels();
    });

    document.getElementById('communityTab').addEventListener('click', () => {
        uploadSection.style.display = 'none';
        reelsSection.style.display = 'none';
        communitySection.style.display = 'block';
        displayCommunityPosts();
    });

    // Handle Posten
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const content = postContent.value.trim();
        const mediaFile = mediaInput.files[0];

        loadingBar.style.display = 'block';

        setTimeout(() => {
            const post = { content, mediaURL: null, type: null };

            if (mediaFile) {
                post.mediaURL = URL.createObjectURL(mediaFile);
                post.type = mediaFile.type;
            }

            if (post.type === "video/mp4") {
                posts.push(post);
                localStorage.setItem('posts', JSON.stringify(posts));
            } else if (post.type === "audio/mp3" || content) {
                communityPosts.push(post);
                localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
            }

            postContent.value = '';
            mediaInput.value = '';
            loadingBar.style.display = 'none';

            if (post.type === "video/mp4") {
                displayReels();
            } else if (post.type === "audio/mp3" || content) {
                displayCommunityPosts();
            }
        }, 2000);
    });

    function displayReels() {
        postList.innerHTML = '';
        posts.forEach((post, index) => {
            const newPost = document.createElement('div');
            newPost.classList.add('post');
            newPost.innerHTML = `
                <p><strong>${localStorage.getItem('username')}</strong></p>
                <video controls>
                    <source src="${post.mediaURL}" type="video/mp4">
                    Dein Browser unterstützt das Video-Tag nicht.
                </video>
                <p>${post.content}</p>
                <button class="delete-button" data-index="${index}">Löschen</button>
            `;
            postList.appendChild(newPost);
        });
        attachDeleteListeners();
    }

    function displayCommunityPosts() {
        communityList.innerHTML = '';
        communityPosts.forEach((post, index) => {
            const newPost = document.createElement('div');
            newPost.classList.add('post');
            if (post.mediaURL) {
                newPost.innerHTML = `
                    <p><strong>${localStorage.getItem('username')}</strong></p>
                    <audio controls>
                        <source src="${post.mediaURL}" type="audio/mp3">
                        Dein Browser unterstützt das Audio-Tag nicht.
                    </audio>
                    <p>${post.content}</p>
                    <button class="delete-button" data-index="${index}">Löschen</button>
                `;
            } else {
                newPost.innerHTML = `
                    <p><strong>${localStorage.getItem('username')}</strong></p>
                    <p>${post.content}</p>
                    <button class="delete-button" data-index="${index}">Löschen</button>
                `;
            }
            communityList.appendChild(newPost);
        });
        attachDeleteListeners();
    }

    function attachDeleteListeners() {
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (postList.contains(e.target.parentElement)) {
                    posts.splice(index, 1);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    displayReels();
                } else {
                    communityPosts.splice(index, 1);
                    localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
                    displayCommunityPosts();
                }
            });
        });
    }
});
