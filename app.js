const user = {
    name: prompt("Adınız nedir?"),
    age: parseInt(prompt("Yaşınız kaç?")),
    job: prompt("Mesleğiniz nedir?")
};

console.log("Kullanıcı Bilgileri:", user);

let cart = [];

function addProductToCart() {
    while (true) {
        let productName = prompt("Sepete eklemek istediğiniz ürünün adını girin (Çıkış için 'q'):");
        if (productName.toLowerCase() === 'q') break;
        
        let productPrice = parseFloat(prompt(`"${productName}" ürünü için fiyat girin:`));
        if (isNaN(productPrice) || productPrice <= 0) {
            console.log("Geçerli bir fiyat giriniz!");
            continue;
        }

        cart.push({ product: productName, price: productPrice });
        console.log(`${productName} ürünü sepete eklendi. Fiyat: ${productPrice} TL`);
    }
}

function listCart() {
    console.log("Sepetiniz:", cart);
    let totalPrice = cart.reduce((total, item) => total + item.price, 0);
    console.log("Toplam Fiyat:", totalPrice, "TL");
}

function removeProductFromCart() {
    let productName = prompt("Çıkarmak istediğiniz ürünün adını girin:");
    let index = cart.findIndex(item => item.product.toLowerCase() === productName.toLowerCase());
    
    if (index !== -1) {
        cart.splice(index, 1);
        console.log(`${productName} ürünü sepetten çıkarıldı.`);
    } else {
        console.log("Bu ürün sepetinizde bulunamadı.");
    }
}

addProductToCart();
listCart();

if (cart.length > 0) {
    let removeOption = prompt("Sepetten ürün çıkarmak ister misiniz? (evet/hayır)");
    if (removeOption.toLowerCase() === "evet") {
        removeProductFromCart();
        listCart();
    }
}
