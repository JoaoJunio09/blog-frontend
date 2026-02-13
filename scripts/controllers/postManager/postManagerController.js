import { PostService } from '../../services/postService.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';

const dom = {
	previewPanel: {
		totalArticles: document.querySelector("#total-articles"),
		views: document.querySelector("#views"),
		totalLikes: document.querySelector("#likes"),
		drafts: document.querySelector("#drafts")
	},
	postActions: {
		btnToShare: document.querySelector("#btn-share"),
		btnEdit: document.querySelector("#btn-edit"),
		btnRemove: document.querySelector("#btn-remove")
	},
	postInformation: {
		status: document.querySelector("#status"),
		viewsInfoForPost: document.querySelector("#views-info"),
		likesInfoForPost: document.querySelector("#likes-info"),
		date: document.querySelector("#date"),
		days: document.querySelector("#days"),
	}
};

document.addEventListener('DOMContentLoaded', async () => {
	// TO-DO -> enquanto a página carrega, eu preciso exibir um modal de 'carregando', para esperar todos os dados 
	// serem obtidos do backend
	loading();
	await fillInTheInformationOnThePreviewPanel();
});

dom.postActions.btnToShare.addEventListener('click', () => {

});

dom.postActions.btnEdit.addEventListener('click', () => {

});

dom.postActions.btnRemove.addEventListener('click', () => {

});

async function fillInTheInformationOnThePreviewPanel() {
	const posts = await PostService.findAllPosts(MediaTypes.JSON);

	console.log(dom.previewPanel.totalArticles.textContent);

	// TO-DO 1: Depois das informações gerais preenchidas no painel, deve-se preencher os Cards de 
	// todos os posts (Preenchendo os cards de todos os posts, automaticamente as suas informações pessoais
	// também serão preenchidas - [postInformations]).
}

function loading() {
	console.log("[Obtendo Dados do Service] -> Carregando");
}