import { PostService } from '../../services/postService.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';

const dom = {
	previewPanel: {
		totalArticles: document.querySelector("#total-articles"),
		views: document.querySelector("#views"),
		totalViews: document.querySelector("#views"),
		drafts: document.querySelector("#drafts")
	},
	postActions: {

	},
	postInformation: {

	}
};

async function fillInTheInformationOnThePreviewPanel() {
	const posts = await PostService.findAllPosts(MediaTypes.JSON);

	console.log(dom.previewPanel.totalArticles.textContent);
}

document.addEventListener('DOMContentLoaded', async () => {
	// TODO -> enquanto a página carrega, eu preciso exibir um modal de 'carregando', para esperar todos os dados 
	// serem obtidos do backend
	loading();
	await fillInTheInformationOnThePreviewPanel();
});

function loading() {
	console.log("[Obtendo Dados do Service] -> Carregando");
}