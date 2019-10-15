var faker =require("faker");
for (var i = 0; i < 11 ;i++) {

    console.log( " Product's Name is "+ faker.commerce.productName() + " and its price is " + faker.commerce.price())
    
}
