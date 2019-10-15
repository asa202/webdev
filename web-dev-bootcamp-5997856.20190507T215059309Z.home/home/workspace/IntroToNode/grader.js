function average(scores ){
    var avg=0;
    for(var i=0 ;i < scores.length ;i++){
        avg=avg+scores[i];
    }
    avg=avg/scores.length;
    return Math.round(avg);
}
var scores = [90, 98 ,89 ,100, 100, 86, 94];
console.log(average(scores));