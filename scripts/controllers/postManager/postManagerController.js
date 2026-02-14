import { PostService } from '../../services/postService.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { loadTemplate } from '../../utils/templateLoader.js';
import { rendererTBodyPostsManager } from '../../renderers/rendererTBodyPostsManager.js';

let dom = {
	page: {
		size: null,
		totalElements: null,
		totalPages: null,
		currenPageNumber: null,
		listLength: null
	}
};

document.addEventListener('DOMContentLoaded', async () => {
	lucide.createIcons();
	await loadTemplate('../../../templates/tbody-posts-manager.html');

	// TO-DO -> enquanto a página carrega, eu preciso exibir um modal de 'carregando', para esperar todos os dados 
	// serem obtidos do backend
	loading();
	await fillInTheInformationOnThePreviewPanel();

	initializeDomAndButtons();
	
});

async function fillInTheInformationOnThePreviewPanel() {
	const list = await PostService.findAllPosts(MediaTypes.JSON, { page: 0, size: 12, direction: 'asc' });
	const posts = list._embedded.postDTOList;

	rendererTBodyPostsManager(posts, document.querySelector("#body-table-posts-manager"));
	dom.page = {
		size: list.page.size,
		totalElements: list.page.totalElements,
		totalPages: list.page.totalPages,
		currenPageNumber: list.page.number,
		listLength: posts.length
	};
	updatePaginationControl();

	if (window.lucide) {
    lucide.createIcons();
  }

	// TO-DO 1: Depois das informações gerais preenchidas no painel, deve-se preencher os Cards de 
	// todos os posts (Preenchendo os cards de todos os posts, automaticamente as suas informações pessoais
	// também serão preenchidas - [postInformations]).
}

function initializeDomAndButtons() {
	dom = {
		previewPanel: {
			totalArticles: document.querySelector("#total-articles"),
			views: document.querySelector("#views"),
			totalLikes: document.querySelector("#likes"),
			drafts: document.querySelector("#drafts")
		},
		postActions: {
			btnsToShare: document.querySelectorAll(".btn-share"),
			btnsEdit: document.querySelectorAll(".btn-edit"),
			btnsRemove: document.querySelectorAll(".btn-remove")
		},
		// postInformation: {
		// 	status: document.querySelectorAll(".status"),
		// 	viewsInfoForPost: document.querySelectorAll(".views-info"),
		// 	likesInfoForPost: document.querySelectorAll(".likes-info"),
		// 	date: document.querySelectorAll(".date"),
		// 	days: document.querySelectorAll(".days"),
		// }
	}

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

function updatePaginationControl() {
	const currentPage = document.querySelector("#current-page");
	const totalPages = document.querySelector("#total-pages");
	const postsLength = document.querySelector("#posts-length");
	const totalElements = document.querySelector("#total-elements");

	currentPage.textContent = dom.page.currenPageNumber + 1;
	totalPages.textContent = dom.page.totalPages;
	postsLength.textContent = dom.page.listLength;
	totalElements.textContent = dom.page.totalElements;

	if (dom.page.totalPages > 2) {
		console.log("A mais de 1 página");
	}
}

function loading() {
	console.log("[Obtendo Dados do Service] -> Carregando");
}