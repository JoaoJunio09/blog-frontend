import { PostService } from '../../services/postService.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { loadTemplate } from '../../utils/templateLoader.js';
import { rendererTBodyPostsManager } from '../../renderers/rendererTBodyPostsManager.js';

let dom = {};

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
	const posts = await PostService.findAllPosts(MediaTypes.JSON);
	rendererTBodyPostsManager(posts, document.querySelector("#body-table-posts-manager"));

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

function loading() {
	console.log("[Obtendo Dados do Service] -> Carregando");
}