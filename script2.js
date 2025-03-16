// Ürün bilgileri listesi
const products = [
    { id: 1, name: 'Laptop', price: 15000, stock: 5 },
    { id: 2, name: 'Telefon', price: 8000, stock: 10 },
    { id: 3, name: 'Tablet', price: 5000, stock: 8 },
    { id: 4, name: 'Kulaklık', price: 1000, stock: 15 },
    { id: 5, name: 'Mouse', price: 500, stock: 20 }
];

class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.discountApplied = false;
    }

    // Ürün ekleme metodu
    addItem(productId, quantity = 1) {
        try {
            // Ürünü ID'sine göre buluyoruz
            const product = products.find(p => p.id === productId);

            // Ürün bulunamazsa hata fırlatıyoruz
            if (!product) {
                throw new Error('Ürün bulunamadı!');
            }

            // Debug: 
            // Eski kodda "if (product.stock <= quantity)" idi. 
            // Bu durumda stok, eklemek istenen miktara eşit olduğunda bile hata veriyordu.
            // Doğru kontrol: stok eklenmek istenen miktardan azsa hata fırlatılmalı.
            if (product.stock < quantity) {
                throw new Error('Yetersiz stok!');
            }

            // Eğer aynı ürün zaten sepette varsa, miktarı artır; yoksa yeni bir giriş oluştur.
            const existingItem = this.items.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({
                    productId,
                    name: product.name,
                    price: product.price,
                    quantity
                });
            }

            // Toplam tutarı hesapla ve UI'ı güncelle
            this.calculateTotal();
            this.updateUI();

        } catch (error) {
            console.error('Ürün ekleme hatası:', error);
            this.showError(error.message);
        }
    }

    // Ürün silme metodu
    removeItem(productId) {
        try {
            // Silinecek ürünün index'ini buluyoruz
            const itemIndex = this.items.findIndex(item => item.productId === productId);

            if (itemIndex === -1) {
                throw new Error('Ürün sepette bulunamadı!');
            }

            // Sepetten silinecek ürünü alıyoruz
            const item = this.items[itemIndex];
            const product = products.find(p => p.id === productId);

            // Debug:
            // Eski kodda stok güncellemesinde sabit 1 ekleniyordu.
            // Silinen ürünün sepetteki miktarı kadar stoğa geri eklenmesi gerekiyor.
            if (product) {
                product.stock += item.quantity; // item.quantity kadar eklenmeli
            }

            // Ürünü sepetten kaldırıyoruz
            this.items.splice(itemIndex, 1);

            // Toplamı yeniden hesapla ve UI'ı güncelle
            this.calculateTotal();
            this.updateUI();

        } catch (error) {
            console.error('Ürün silme hatası:', error);
            this.showError(error.message);
        }
    }

    // Toplam tutarı hesaplama metodu
    calculateTotal() {
        // Debug:
        // Eski versiyonda sadece item.price ekleniyordu, fakat miktar (quantity) çarpımı unutulmuştu.
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Eğer indirim uygulanmışsa, toplam üzerinden %10 indirim yapıyoruz.
        // Debug:
        // Eski kodda toplamın %10'u alınmıştı, fakat %10 indirim için toplamın %90'ı alınmalıdır.
        if (this.discountApplied && this.total > 0) {
            this.total = this.total * 0.9; // %10 indirim => toplam * 0.9
        }
    }

    // İndirim kodu uygulama metodu
    applyDiscount(code) {
        // Sadece doğru kod girildiğinde indirim uygulanır.
        if (code === 'INDIRIM10' && !this.discountApplied) {
            this.discountApplied = true;
            this.calculateTotal();
            this.updateUI();
            this.showMessage('İndirim uygulandı!');
        } else {
            this.showError('Geçersiz indirim kodu!');
        }
    }

    // UI güncelleme metodu
    updateUI() {
        const cartElement = document.getElementById('cart');
        const totalElement = document.getElementById('total');

        if (cartElement && totalElement) {
            // Sepetteki ürünleri listeleyip, her ürün için detayları gösteriyoruz.
            cartElement.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>${item.quantity} adet</span>
                    <span>${item.price * item.quantity} TL</span>
                    <button onclick="cart.removeItem(${item.productId})">Sil</button>
                </div>
            `).join('');

            // Toplam fiyatı gösteriyoruz.
            totalElement.textContent = `Toplam: ${this.total} TL`;
        }
    }

    // Hata mesajlarını ekranda gösteren metod
    showError(message) {
        const errorElement = document.getElementById('error');
        if (errorElement) {
            // Her hata mesajı alt alta ekleniyor.
            errorElement.textContent += message + '\n';
        }
    }

    // Bilgilendirme mesajı gösterme metodu
    showMessage(message) {
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = message;
            // 3 saniye sonra mesaj temizleniyor.
            setTimeout(() => {
                messageElement.textContent = '';
            }, 3000);
        }
    }
}

class App {
    constructor() {
        // Global olarak ShoppingCart ve App nesnelerini tanımlıyoruz.
        window.cart = new ShoppingCart();
        this.initializeEventListeners();
    }

    // DOM hazır olduğunda ürünleri render etmek ve event listener'ları kurmak için kullanılıyor.
    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.renderProducts();
            this.setupEventHandlers();
        });
    }

    // Ürünleri sayfada listeleyen metot
    renderProducts() {
        const productsElement = document.getElementById('products');
        if (productsElement) {
            productsElement.innerHTML = products.map(product => `
                <div class="product-card">
                    <h3>${product.name}</h3>
                    <p>Fiyat: ${product.price}.00 TL</p>
                    <p>Stok: ${product.stock}</p>
                    <button onclick="app.addToCart(${product.id})"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        Sepete Ekle
                    </button>
                </div>
            `).join('');
        }
    }

    // Event handler'ları kuran metot
    setupEventHandlers() {
        // İndirim formu submit edildiğinde indirim kodunu uygular.
        const discountForm = document.getElementById('discount-form');
        if (discountForm) {
            discountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const codeInput = document.getElementById('discount-code');
                if (codeInput) {
                    window.cart.applyDiscount(codeInput.value);
                }
            });
        }

        // Stok güncellemesi olduğunda ürün listesini yeniden render eder.
        document.addEventListener('stockUpdate', () => {
            this.renderProducts();
        });
    }

    // Sepete ürün ekleme metodu
    addToCart(productId) {
        window.cart.addItem(productId, undefined);
        // Ürün eklendikten sonra stok bilgisinin güncellenmesi için custom event tetikleniyor.
        document.dispatchEvent(new Event('stockUpdate'));
    }
}

// Uygulamayı başlatıyoruz
const app = new App();
window.app = app;
