import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { PostService } from '../../services/postService.js';
import { loadTemplate } from '../../utils/templateLoader.js';
import { rendererPost } from '../../renderers/postRenderer.js';
import { rendererNextPosts } from '../../renderers/rendererNextPosts.js';
import { rendererCommentsSection } from '../../renderers/rendererCommentsSection.js';
import { rendererMascotInteractFocus } from '../../renderers/rendererMascotInteractFocus.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadTemplate('../../../templates/post-content.html');
  await loadTemplate('../../../templates/next-posts.html');
  await loadTemplate('../../../templates/mascot-interact-focus.html');
  await loadTemplate('../../../templates/comments-section.html');
  await loadTemplate('../../../templates/comment-card.html');

	await loadPost();
});

async function loadPost() {
	try {
		const postId = localStorage.getItem('postId');
		const postTitle = localStorage.getItem('postTitle');

		const post = await PostService.findByIdPost(postId, MediaTypes.JSON);
    displayPost(post);

		document.title = postTitle + " | HelloDev Blog";
	}
	catch (e) {
		console.error("Error loading post:", e);
	}
}

function displayPost(post) {
	try {
	  const htmlContent = marked.parse(post.content);
    const articleBody = document.querySelector('.article-body');

		fillInTheBannerAndTitleAndAuthor(post);
		rendererPost(htmlContent, articleBody);
    rendererNextPosts(post, articleBody);
    rendererMascotInteractFocus(articleBody);
    rendererCommentsSection(post, articleBody);
		generateIndex();
	}
	catch (e) {
		console.error("Error displaying post:", e);
	}
}

function fillInTheBannerAndTitleAndAuthor(post) {
  const titleElement = document.getElementById('title');
	const authorInfoElement = document.querySelector('.author-info span');
  const banner = document.querySelector(".hero-card-banner");
	titleElement.textContent = post.title;
	authorInfoElement.textContent = `Autor, João Junio • ${new Date(post.date).toLocaleDateString()}`;
  banner.src = post.bannerUrl;
}

function generateIndex() {
    const article = document.querySelector('.article-body');
    const indexRoot = document.querySelector('.index-box ul');

    indexRoot.innerHTML = '';

    let currentSectionLi = null;

    article.querySelectorAll('h1,h2,h3').forEach(heading => {
      const id = heading.textContent
        .toLowerCase()
        .replace(/[^\w]+/g, '-');

      heading.id = id;

      if (heading.tagName === 'H1' || heading.tagName === 'H2') {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
        indexRoot.appendChild(li);
        currentSectionLi = li;
      }

      if (heading.tagName === 'H3' && currentSectionLi) {
        let subList = currentSectionLi.querySelector('.sub-index');

        if (!subList) {
          subList = document.createElement('ul');
          subList.classList.add('sub-index');
          currentSectionLi.appendChild(subList);
        }

        const subLi = document.createElement('li');
        subLi.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
        subList.appendChild(subLi);
      }
  });
}