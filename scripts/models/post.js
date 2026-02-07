export class Post {
	title;
	subTitle;
	description;
	content;
	date;
	userDTO

	constructor(title, subTitle, description, content, date, userDTO) {
		this.title = title;
		this.subTitle = subTitle;
		this.description = description;
		this.content = content;
		this.date = date;
		this.userDTO = userDTO
	}
}