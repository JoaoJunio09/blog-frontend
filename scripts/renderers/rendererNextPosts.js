export function rendererNextPosts(posts, articleBody) {
	const template = document.getElementById('template-next-posts');
	const readNextSection = template.content.cloneNode(true);
	const cardsRow = readNextSection.querySelector(".cards-row");

	posts.forEach(post => {
		let html = `
			<div class="mini-card" data-id="${post.id}" data-title="${post.title}">
				<div class="card-icon blue"></div>
				<span class="title-next-post">${post.title}</span>
			</div>
		`;

		cardsRow.innerHTML += html;
	});

	articleBody.appendChild(readNextSection);
	return articleBody;
}