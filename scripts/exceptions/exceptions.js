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

class BannerOrThumbnailIsNullException extends Error {
	constructor(message) {
		super(message);
		this.name = "BannerOrThumbnailIsNullException";
	}
}

class TheDataIsEmptyOsNull extends Error {
	constructor(message) {
		super(message);
		this.name = "TheDataIsEmptyOsNull";
	}
}

export const Exceptions = {
	TheListIsEmptyException,
	LoadPostsException,
	ServerConnectionException,
	BannerOrThumbnailIsNullException,
	TheDataIsEmptyOsNull,
};