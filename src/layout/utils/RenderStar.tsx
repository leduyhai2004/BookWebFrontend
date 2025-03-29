import { Star, StarFill, StarHalf } from "react-bootstrap-icons";

const renderRating = (rating : number)=>{
    console.log(rating,"retingsss")
    const stars = [];
    const  roundNumber=(number:number)=> {
        const floorValue = Math.floor(number);
        const decimalPart = number - floorValue;
        if (decimalPart >= 0.3 && decimalPart <= 0.6) {
            return floorValue + 0.5; // Round to .5 if between .3 and .6
        } else if (decimalPart > 0.6) {
            return floorValue + 1; // Round up to the next whole number if > .6
        } else {
            return floorValue; // Otherwise, round down
        }
    }
    rating = roundNumber(rating);

for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
        stars.push(<StarFill key={i} className="text-warning" />);
    } else if (i - rating === 0.5) {
        stars.push(<StarHalf key={i} className="text-warning" />);
    } else {
        stars.push(<Star key={i} className="text-secondary" />);
    }
}
    return stars;
}
export default renderRating;