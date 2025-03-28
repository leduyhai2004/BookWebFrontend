class Evaluation{
    id : number;
    ratingMark ?: number;
    comment ?: string;
    user_id?: number;
    book_id?:number
    constructor(
        id : number,
        ratingMark ?: number,
        comment ?: string,
        user_id ?: number,
        book_id?:number
    ){
        this.id = id;
        this.ratingMark = ratingMark;
        this.comment = comment;
        this.user_id = user_id;
        this.book_id = book_id;
    }
}

export default Evaluation;