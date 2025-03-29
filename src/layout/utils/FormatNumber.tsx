import { isUndefined } from "util";

function FormatNumber(x : number | undefined){
    if(x===undefined){
        return 0;
    }
    if(Number.isNaN(x)){
        return 0;
    }else{
        return x.toLocaleString("vi-VN")
    }
}
export default FormatNumber;