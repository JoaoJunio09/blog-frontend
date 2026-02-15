import { PostService } from '../../services/postService.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { loadTemplate } from '../../utils/templateLoader.js';
import { rendererTBodyPostsManager } from '../../renderers/rendererTBodyPostsManager.js';

let dom = {
	button_next_page: document.querySelector("#button-next-page"),
	button_previous_page: document.querySelector("#button-previous-page"),
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
	postInformation: {},
};

document.addEventListener('DOMContentLoaded', async () => {
	lucide.createIcons();
	await loadTemplate('../../../templates/tbody-posts-manager.html');

	// TO-DO -> enquanto a página carrega, eu preciso exibir um modal de 'carregando', para esperar todos os dados 
	// serem obtidos do backend
	await fillInTheInformationOnThePreviewPanel();

	initializeDomAndButtons();
});

dom.button_next_page.addEventListener('click', async () => {
	const currentPageNumber = dom.page.currentPageNumber + 1;
	renderPostsAndUpdatePaginationControl(currentPageNumber, true);
});

dom.button_previous_page.addEventListener('click', async () => {
	const currentPageNumber = dom.page.currentPageNumber - 1;
	renderPostsAndUpdatePaginationControl(currentPageNumber, true);
});

async function fillInTheInformationOnThePreviewPanel() {
	renderPostsAndUpdatePaginationControl(dom.page.currentPageNumber, false);

	if (window.lucide) {
    lucide.createIcons();
  }
}

async function renderPostsAndUpdatePaginationControl(currentPageNumber, update) {
	const list = await PostService.findAllPosts(MediaTypes.JSON, { page: currentPageNumber, size: 4, direction: 'asc' });
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
	dom.postInformation.currentPageNumberControl = document.querySelector("#current-page-control");

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