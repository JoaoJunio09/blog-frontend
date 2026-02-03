import { PostService } from '../../services/postService.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { Exceptions } from '../../exceptions/exceptions.js';

const loadMoreButton = document.getElementById('load-more-posts-button');
const closeModalWithEmptyListMessageButton = document.getElementById('close-modal-button');
const articlesGrid = document.querySelector('.articles-grid');

async function loadPosts() {
	try {
		const posts = await PostService.findAllPosts(MediaTypes.JSON);
		if (posts.length === 0) {
			throw new TheListIsEmptyException("The list of posts is empty.");
		}

		generatestPostCard(posts);
		loadMoreButton.style.display = 'none';

		// Logic to append posts to the UI
	}
	catch (e) {
		if (e instanceof Exceptions.ServerConnectionException) openErrorModalOnConnectionToServer();
		if (e instanceof Exceptions.TheListIsEmptyException) openModalWithEmptyListMessage();
		else openErrorModalOnConnectionToServer();
	}
}

loadMoreButton.addEventListener('click', async () => {
	try { loadPosts(); }
	catch (e) {
		if (e instanceof Exceptions.LoadPostsException) console.log("Failed to load posts:", e.message);
	}
});

articlesGrid.addEventListener('click', async (e) => {
	const readMoreButton = e.target.closest('.read-more-posts-button');
	if (!readMoreButton) return;

	e.preventDefault();

	const card = readMoreButton.closest('article');

	const postIdAndTitle = card.dataset.postIdAndTitle;
	const [postId, postTitle] = postIdAndTitle.split('/');

	console.log("Selected Post ID:", postId);
	console.log("Selected Post Title:", postTitle);
			
	localStorage.setItem('selectedPostId', postId);
	localStorage.setItem('selectedPostTitle', postTitle);

	window.location.href = 'post.html';
});

function generatestPostCard(posts) {
	try {
		const articlesGrid = document.querySelector('.articles-grid');
		posts.forEach(article => {
			const articleElement = document.createElement('article');
			articleElement.classList.add('card', 'reveal-up');

			const articleIsNew = checkIfTheArticleIsNew(article.date);

			articleElement.innerHTML = `
				${articleIsNew ? '<span class="badge">NOVO</span>' : ''}
				<h3>${article.title}</h3>
				<p>${article.subTitle}</p>
				<a href="post.html" class="read-more-posts-button">Ler mais</a>
			`;

			articleElement.setAttribute('data-post-id-and-title', `${article.id}/${article.title.replace(/\s+/g, '-').toLowerCase()}`);

			articlesGrid.appendChild(articleElement);
		});
	}
	catch (error) {
		throw new Error('Error generating post cards: ' + error.message);
	}
}

const modal = document.getElementById('error-modal-overlay');
const closeBtn = document.getElementById('close-modal');

function checkIfTheArticleIsNew(articleDate) {
	const dataPublished = new Date(articleDate);
	let dateDifference = new Date().getTime() - dataPublished.getTime();
	return dateDifference <= (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
}

function openModalWithEmptyListMessage() {
	const modal = document.getElementById('modal-list-is-empty');
	modal.classList.add('show-modal-list-is-empty');
}

function closeModalWithEmptyListMessage() {
	const modal = document.getElementById('modal-list-is-empty');
	modal.classList.remove('show-modal-list-is-empty');
}

function openErrorModalOnConnectionToServer() {
  modal.classList.add('active');
}

closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

closeModalWithEmptyListMessageButton.addEventListener('click', closeModalWithEmptyListMessage);