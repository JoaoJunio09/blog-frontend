import { rendererComment } from '../renderers/rendererComment.js';

const listCommentsMock = [
	{
		userName: "Lucas Almeida",
		date: new Date(),
		content: "Muito bom este artigo sobre Spring, aprendi muito!!"
	},
	{
		userName: "Jota Jota",
		date: new Date(),
		content: "Me ajudou muito a fazer Deploy, parabéns pelo conteúdo, vou recomendar a todos!"
	},
	{
		userName: "Laura dev",
		date: new Date(),
		content: "Estou iniciando na área de programação, e este post me ajudou muito a entender como funciona o backend."
	},
	{
		userName: "Gabriel",
		date: new Date(),
		content: "Conteúdo muito bom!"
	},
];

export function rendererCommentsSection(post, articleBody) {
	const template = document.getElementById('template-comments-section');
	const commentsSection = template.content.cloneNode(true);

	const list = commentsSection.querySelector('.comments-list');
	listCommentsMock.forEach(comment => {
		rendererComment(comment, list);
	});
	articleBody.appendChild(commentsSection);
	return commentsSection;
}