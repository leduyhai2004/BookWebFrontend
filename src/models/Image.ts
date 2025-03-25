class Image{
    id : number;
    name ?: string;
    isIcon ?: boolean;
    link ?: string;
    dataImage ?: string;
    constructor(
        id : number,
        name ?: string,
        isIcon ?: boolean,
        link ?: string,
        dataImage ?: string,
    ){
        this.id = id;
        this.name = name;
        this.isIcon = isIcon;
        this.link = link;
        this.dataImage = dataImage;
    }
}

export default Image;