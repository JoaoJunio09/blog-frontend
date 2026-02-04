export function rendererComment(comment, list) {
	const template = document.getElementById('template-comment-card');

	const card = template.content.cloneNode(true);

	card.querySelector('.user-name').textContent = comment.userName;
	card.querySelector('.comment-date').textContent = new Date(comment.date).toLocaleDateString();
	card.querySelector('.content').textContent = comment.content;
	list.appendChild(card);
}