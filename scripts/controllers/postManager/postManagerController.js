import { PostService } from '../../services/postService.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { loadTemplate } from '../../utils/templateLoader.js';
import { rendererTBodyPostsManager } from '../../renderers/rendererTBodyPostsManager.js';
import { rendererLoading } from '../../renderers/loadingRenderer.js';
import { PostStatus } from '../../models/enums/postStatus.js';

let dom = {
	button_next_page: document.querySelector("#button-next-page"),
	button_previous_page: document.querySelector("#button-previous-page"),
	filter: {
		filterStatus: document.querySelector("#filter-status"),
		filterCategory: document.querySelector("#filter-category"),
	},
	page: {
		size: null,
		totalElements: null,
		totalPages: null,
		currentPageNumber: 0, // sempre inicializa como 0 (ZERO)
		listLength: null
	},
	previewPanel: {
		totalArticles: document.querySelector("#total-articles"),
		views: document.querySelector("#views"),
		totalLikes: document.querySelector("#likes"),
		drafts: document.querySelector("#drafts")
	},
	postActions: {},
	postInformation: {
		currentPageNumberControl: document.querySelector("#current-page-control"),
	},
};

let paginationControlVariables = {
	filteringPosts: {
		status: false,
		type: null,
	}
};

document.addEventListener('DOMContentLoaded', async () => {
	lucide.createIcons();
	await loadTemplate('../../../templates/tbody-posts-manager.html');
	await loadTemplate('../../../templates/loading.html');

	//loading();

	try {
		await fillInTheInformationOnThePreviewPanel();
		initializeDomAndButtons();
	}
	catch (e) {

	}
	finally {
		//closeLoading();
	}
});

dom.filter.filterStatus.addEventListener('change', async (event) => {
	const selectedStatus = event.target.value;
	let list = null;

	if (selectedStatus === "Publicado") {
		list = await PostService.findAllPostsPageableByStatus(MediaTypes.JSON, {page: 0, size: 4, direction: 'asc'}, PostStatus.PUBLISHED);
		paginationControlVariables.filteringPosts.status = true;
		paginationControlVariables.filteringPosts.type = PostStatus.PUBLISHED;
	} 
	else if (selectedStatus === "Rascunho") {
		list = await PostService.findAllPostsPageableByStatus(MediaTypes.JSON, {page: 0, size: 4, direction: 'asc'}, PostStatus.DRAFT);
		paginationControlVariables.filteringPosts.status = true;
		paginationControlVariables.filteringPosts.type = PostStatus.DRAFT;
	}
	else {
		list = await PostService.findAllPostsPageable(MediaTypes.JSON, {page: 0, size: 4, direction: 'asc'});
		paginationControlVariables.filteringPosts.status = false;
		paginationControlVariables.filteringPosts.type = null;
	}
	
	await renderPostsAndUpdatePaginationControl(list, true);
})

dom.button_next_page.addEventListener('click', async () => {
	const list = await fetchPosts(dom.page.currentPageNumber + 1);
	await renderPostsAndUpdatePaginationControl(list, true);
});

dom.button_previous_page.addEventListener('click', async () => {	
	const list = await fetchPosts(dom.page.currentPageNumber - 1);
	await renderPostsAndUpdatePaginationControl(list, true);
});

async function fetchPosts(page) {
	if (paginationControlVariables.filteringPosts.status) {
		return await PostService.findAllPostsPageableByStatus(
			MediaTypes.JSON, 
			{ page: dom.page.currentPageNumber + 1, size: 4, direction: 'asc' }, 
			paginationControlVariables.filteringPosts.type
		);
	}

	return await PostService.findAllPostsPageable(
		MediaTypes.JSON, 
		{ page: dom.page.currentPageNumber + 1, size: 4, direction: 'asc' }
	);
}

async function fillInTheInformationOnThePreviewPanel() {
	fillInGeneralInformationAboutThePosts();

	const list = await PostService.findAllPostsPageable(
		MediaTypes.JSON, 
		{ page: dom.page.currentPageNumber, size: 4, direction: 'asc' }
	);
	await renderPostsAndUpdatePaginationControl(list, false);

	if (window.lucide) {
    lucide.createIcons();
  }
}

async function fillInGeneralInformationAboutThePosts() {
	const posts = await PostService.findAllPosts(MediaTypes.JSON);

	const totalArticles = posts.length;
	const views = 0; // Implementar no backend service para contar visualizações através dos acessos a cada posts.
	const likes = 0; // LikeService.findAllLikesInPosts();
	const drafts = posts.filter(post => post.status === PostStatus.DRAFT).length;

	document.querySelector("#total-articles").textContent = totalArticles;
	document.querySelector("#views").textContent = views;
	document.querySelector("#likes").textContent = likes;
	document.querySelector("#drafts").textContent = drafts;
}

async function renderPostsAndUpdatePaginationControl(list, update) {
	const posts = list._embedded.postDTOList;
	rendererTBodyPostsManager(posts, document.querySelector("#body-table-posts-manager"), update);
	updatePaginationControl(list);
}

function updatePaginationControl(list) {
	updatePaginationData(list);

	const currentPage = document.querySelector("#current-page");
	const totalPages = document.querySelector("#total-pages");
	const postsLength = document.querySelector("#posts-length");
	const totalElements = document.querySelector("#total-elements");

	currentPage.textContent = dom.page.currentPageNumber + 1;
	totalPages.textContent = dom.page.totalPages;
	postsLength.textContent = dom.page.listLength;
	totalElements.textContent = dom.page.totalElements;

	dom.postInformation.currentPageNumberControl.textContent = currentPage.textContent;

	if (dom.page.currentPageNumber === 0) {
		dom.button_previous_page.style.display = 'none';
	}
	else {
		dom.button_previous_page.style.display = 'initial';
	}

	if (dom.page.totalPages > 1) {
		dom.button_next_page.style.display = 'initial';
	}

	if (dom.page.totalPages - dom.page.currentPageNumber === 1) {
		dom.button_next_page.style.display = 'none';
	}
}

function updatePaginationData(list) {
	dom.page.size = list.page.size;
	dom.page.totalElements = list.page.totalElements;
	dom.page.totalPages = list.page.totalPages;
	dom.page.currentPageNumber = list.page.number;
	dom.page.listLength = list._embedded.postDTOList.length;
}

function initializeDomAndButtons() {
	dom.postActions.btnsToShare = document.querySelectorAll(".btn-share");
	dom.postActions.btnsEdit = document.querySelectorAll(".btn-edit");
	dom.postActions.btnsRemove = document.querySelectorAll(".btn-remove");
	dom.postInformation.status = document.querySelectorAll(".status");
	dom.postInformation.viewsInfoForPost = document.querySelectorAll(".views-info");
	dom.postInformation.likesInfoForPost = document.querySelectorAll(".likes-info");
	dom.postInformation.date = document.querySelectorAll(".date");
	dom.postInformation.days = document.querySelectorAll(".days");

	dom.postActions.btnsToShare.forEach(btn => {
		btn.addEventListener('click', () => {
			console.log("clico");
		});
	});

	dom.postActions.btnsEdit.forEach(btn => {
		btn.addEventListener('click', () => {
			console.log("clico");
		});
	});

	dom.postActions.btnsRemove.forEach(btn => {
		btn.addEventListener('click', () => {
			console.log("clico");
		});
	});
}

function loading() {
	const loadingModal = rendererLoading();
	loadingModal.classList.add('active');
	document.body.classList.add('loading-active');
}

function closeLoading() {
	const loadingModal = document.getElementById("loading-modal");

	if (loadingModal) {
		loadingModal.classList.remove('active');
		loadingModal.remove();
	}
	
	document.body.classList.remove('loading-active');
}