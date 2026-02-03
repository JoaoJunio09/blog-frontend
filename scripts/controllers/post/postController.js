import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { PostService } from '../../services/postService.js';

const mockMarkdown = `
# Dominando Spring Boot: Do Zero ao Deploy 

---

Spring Boot é hoje uma das ferramentas mais utilizadas no desenvolvimento backend com Java. Ele simplifica drasticamente a criação de aplicações robustas, seguras e escaláveis, permitindo que o desenvolvedor foque no que realmente importa: a regra de negócio.

Neste artigo, vamos percorrer desde os conceitos fundamentais até práticas mais avançadas, entendendo o porquê das decisões, e não apenas copiando código.

# O que é Spring Boot

Spring Boot é um projeto do ecossistema Spring que tem como principal objetivo reduzir a complexidade de configuração de aplicações Java.

#### Ele nasce para resolver três grandes problemas do Spring tradicional:

1. Excesso de configuração manual

2. Dependência forte de XML

3. Curva de aprendizado inicial elevada

Com Spring Boot, conseguimos criar uma aplicação funcional em minutos.

### Spring vs Spring Boot

É comum confundir os dois, mas eles não são a mesma coisa.

Spring Framework: fornece a base (IoC, DI, AOP, MVC)

Spring Boot: camada de produtividade em cima do Spring

Spring Boot não substitui o Spring, ele o organiza e automatiza.

# Arquitetura básica de uma aplicação Spring Boot

Uma aplicação Spring Boot segue uma arquitetura muito bem definida, normalmente inspirada em camadas.

### Camadas principais

 - Controller

 - Service

 - Repository

 - Model (Entidades)

 - Configurações

Essa separação não é apenas estética — ela garante baixo acoplamento e alta coesão.

### Fluxo de uma requisição

 - O cliente faz uma requisição HTTP

 - O Controller recebe a requisição

 - O Service aplica a regra de negócio

 - O Repository acessa o banco

 - A resposta retorna ao cliente

Esse fluxo é previsível, testável e fácil de manter.

# Criando um projeto Spring Boot

A forma mais comum de iniciar um projeto é usando o Spring Initializr.

### Dependências comuns

 - Spring Web

 - Spring Data JPA

 - Spring Security

 - Validation

 - PostgreSQL ou MySQL Driver

Escolher bem as dependências evita retrabalho no futuro.

### Controllers no Spring Boot

Controllers são responsáveis por expor endpoints REST.

#### Criando um Controller REST
\`\`\`
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }
}
\`\`\`

Aqui vemos:

 - Uso de anotações

 - Mapeamento claro

 - Retorno explícito de status HTTP

### Camada de Service

A camada de Service concentra toda a regra de negócio.

*Por que não colocar lógica no Controller?*

Porque o Controller:

 - deve ser fino

 - não deve conhecer detalhes internos

 - apenas orquestra chamadas

#### Exemplo de Service

\`\`\`
@Service
public class PostService {

    public PostDTO findById(Long id) {
        Post post = repository.findById(id)
            .orElseThrow(() -> new NotFoundException("Post não encontrado"));
        return mapper.toDTO(post);
    }
}
\`\`\`

Aqui garantimos:

 - regras centralizadas

 - código testável

 - reutilização

# Spring Data JPA e persistência

O Spring Data JPA abstrai completamente o acesso ao banco de dados.

Repository simples:

\`\`\`
public interface PostRepository extends JpaRepository<Post, Long> {
}
\`\`\`

Sem SQL explícito, sem boilerplate, sem dor.

### Relacionamentos

 - @OneToMany

 - @ManyToOne

 - @ManyToMany

A escolha correta do relacionamento impacta diretamente na performance e clareza do modelo.

# Segurança com Spring Security e JWT

Segurança não é opcional em aplicações modernas.

### Por que JWT?

 *1. Stateless*

 *2. Escalável*

 *3. Ideal para APIs REST*

 *4. Fluxo básico*

 *5. Usuário faz login*

 *6. Backend gera um JWT*

 *7. Frontend envia o token em cada requisição*

 *8. Backend valida o token*

 *9. Sem sessão, sem estado no servidor.*

 *10. Tratamento de exceções*

 *11 .Uma aplicação profissional não retorna stacktrace para o cliente.*

#### Controller Advice
\`\`\`
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiError(ex.getMessage()));
    }
}
\`\`\`

Isso garante:

 - respostas padronizadas

 - segurança

 - clareza para o frontend

# Boas práticas no Spring Boot

Algumas regras simples fazem muita diferença:

1. Controllers finos
2. Services ricos
3. Entidades sem lógica complexa
4. DTOs para comunicação externa
5. Validação com Bean Validation
6. Logs bem posicionados
7. Código limpo não é luxo, é necessidade.

# Deploy de uma aplicação Spring Boot
Após finalizar o desenvolvimento, é hora de colocar a aplicação no ar.

#### Build do projeto

\`\`\`
mvn clean package
\`\`\`

Isso gera um .jar executável.

#### Execução

\`\`\`
java -jar app.jar
\`\`\`

A aplicação sobe com tudo embutido:

Tomcat

Configurações

Dependências

# Conclusão

### Spring Boot não é apenas um framework, é uma forma de pensar arquitetura backend.

Quando bem utilizado, ele permite:

 - código limpo

 - fácil manutenção

 - escalabilidade real

 - segurança consistente

* Dominar Spring Boot é um passo fundamental para qualquer desenvolvedor backend Java que deseja atuar em projetos profissionais. *
`;

document.addEventListener('DOMContentLoaded', async () => {
	await loadPost();
});

async function loadPost() {
	try {
		const postId = localStorage.getItem('selectedPostId');
		const postTitle = localStorage.getItem('selectedPostTitle');


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

		const htmlContent = marked.parse(mockMarkdown);

		const articleBody = document.querySelector('.article-body');

		const titleElement = document.getElementById('title');
		const authorInfoElement = document.querySelector('.author-info span');
		titleElement.textContent = post.title;
		authorInfoElement.textContent = `Autor João Junio • ${new Date(post.date).toLocaleDateString()}`;
		articleBody.innerHTML = htmlContent;
		generateIndex();

		displayNextPost([], articleBody)
	}
	catch (e) {
		console.error("Error displaying post:", e);
	}
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



function displayNextPost(posts, articleBody) {
	try {
		const nextPostHtml = `
		<br><br>
			<section class="read-next">
        <h3>Leia a Seguir</h3>
          <div class="cards-row">
            <div class="mini-card">
              <div class="card-icon blue"></div>
              <span>Primetrios Passos com Java</span>
            </div>
            <div class="mini-card">
              <div class="card-icon dark"></div>
              <span>Introdução ao Spring Boot</span>
            </div>
            <div class="mini-card">
              <div class="card-icon dark"></div>
              <span>Boas Práticas de Código Limpo</span>
            </div>
          </div>
      </section>
		`

		articleBody.insertAdjacentHTML('beforeend', nextPostHtml);
	}
	catch (e) {
		throw e;
	}
}