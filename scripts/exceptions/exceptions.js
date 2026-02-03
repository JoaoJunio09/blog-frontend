class TheListIsEmptyException extends Error {
	constructor(message) {
		super(message);
		this.name = "TheListIsEmptyException";
	}
}

class LoadPostsException extends Error {
	constructor(message) {
		super(message);
		this.name = "LoadPostsException";
	}
}

class ServerConnectionException extends Error {
	constructor(message) {
		super(message);
		this.name = "ServerConnectionException";
	}
}

export const Exceptions = {
	TheListIsEmptyException,
	LoadPostsException,
	ServerConnectionException
};