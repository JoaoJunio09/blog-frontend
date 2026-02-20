import { PostService } from '../../services/postService.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { Exceptions } from '../../exceptions/exceptions.js';
import { showToast } from '../../utils/toast.js';

const loadMoreButton = document.getElementById('load-more-posts-button');
const closeModalWithEmptyListMessageButton = document.getElementById('close-modal-button');
const articlesGrid = document.querySelector('.articles-grid');
const modal = document.getElementById('error-modal-overlay');
const closeBtn = document.getElementById('close-modal');

const currentPage = 0;

document.addEventListener('DOMContentLoaded', async () => {
	try { loadPosts(currentPage); }
	catch (e) {
		if (e instanceof Exceptions.LoadPostsException) showToast({message: 'Falha ao carregar mais Artigos', type: 'error'});
	}
});

loadMoreButton.addEventListener('click', async () => {
	try { loadPosts(currentPage+1); }
	catch (e) {
		if (e instanceof Exceptions.LoadPostsException) showToast({message: 'Falha ao carregar mais Artigos', type: 'error'});
	}
});

articlesGrid.addEventListener('click', async (e) => {
	const readMoreButton = e.target.closest('.read-more-posts-button');
	if (!readMoreButton) return;

	e.preventDefault();

	const card = readMoreButton.closest('article');

	const postIdAndTitle = card.dataset.postIdAndTitle;
	const [postId, postTitle] = postIdAndTitle.split('/');
			
	localStorage.setItem('postId', postId);
	localStorage.setItem('postTitle', postTitle);

	window.location.href = 'post.html';
});

async function loadPosts(page) {
	try {
		const posts = await PostService.findAllPostsPageable(MediaTypes.JSON, {page: page, size: 6, direction: 'asc'});
		if (posts.length === 0) {
			throw new TheListIsEmptyException("The list of posts is empty.");
		}

		if (page === 1) loadMoreButton.style.display = 'none';
		generatestPostCard(posts._embedded.postDTOList);
	}
	catch (e) {
		if (e instanceof Exceptions.ServerConnectionException) openErrorModalOnConnectionToServer();
		if (e instanceof Exceptions.TheListIsEmptyException) openModalWithEmptyListMessage();
		else showToast({message: 'Erro ao carregar Artigos', type: 'error'});
	}
}

function generatestPostCard(posts) {
	try {
		const articlesGrid = document.querySelector('.articles-grid');
		posts.forEach(article => {
			const element = document.createElement('div');

			const articleIsNew = checkIfTheArticleIsNew(article.date);
			const articleElement = `
				<article class="card reveal-up" data-post-id-and-title="${article.id}/${article.title.replace(/\s+/g, '-').toLowerCase()}">
					${articleIsNew ? '<span class="badge">NOVO</span>' : ''}
					<h3>${article.title}</h3>
					<p>${article.subTitle}</p>
					<a href="post.html" class="read-more-posts-button">Explorar conteúdo</a>
				</article>
			`;
			element.innerHTML = articleElement;

			articlesGrid.appendChild(element);
			return true;
		});
	}
	catch (error) {
		throw new Error('Error generating post cards: ' + error.message);
	}
}

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