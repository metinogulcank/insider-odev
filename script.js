document.addEventListener('DOMContentLoaded', () => {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const isFavorite = localStorage.getItem('friendsFavorite') === 'true';

    if(isFavorite) {
        favoriteBtn.classList.add('active');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> <span>Favorilerden Çıkar</span>';
    }

    favoriteBtn.addEventListener('click', () => {
        const isActive = favoriteBtn.classList.toggle('active');
        localStorage.setItem('friendsFavorite', isActive);
        
        if(isActive) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> <span>Favorilerden Çıkar</span>';
        } else {
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i> <span>Favorilere Ekle</span>';
        }
    });
});