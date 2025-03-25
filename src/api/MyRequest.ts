import React from "react";

export async function MyRequest(duongDan : string) {
    // truy van den duong dan
    const response = await fetch(duongDan);
    if(!response.ok){
        throw new Error(`Can not access ${duongDan}`)
    }
    // neu ok
    return response.json();
}
