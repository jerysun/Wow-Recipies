export default class Likes {
    constructor() {
        this.readStorage();
    }

    addLike(id, title, author, img) {
        const like = { id: id, title: title, author: author, img: img };
        this.likes.push(like);

        // persist data in localStorage
        this.persistData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // persist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = localStorage.getItem('likes');
        this.likes = storage !== null ? JSON.parse(storage) : [];
    }
}


