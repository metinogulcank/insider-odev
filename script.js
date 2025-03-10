$(document).ready(function() {
    const $slider = $('#productList');
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    cartData.forEach(item => {
      addCartItemToDOM(item);
    });

    $.get('https://fakestoreapi.com/products', function(products) {
      const templateHtml = $('#product-template').html();

      products.forEach(product => {
        const $card = $(templateHtml);
        $card.find('.product-title').text(product.title);
        $card.find('.product-price').text(`$${product.price}`);
        $card.find('.product-image').attr('src', product.image);
        $card.attr('data-id', product.id);

        $slider.append($card);
      });

      $slider.slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1
      });
    });

    $('#productList').on('click', '.addToCart', function() {
      const $card = $(this).closest('.product-card');
      const item = {
        id: $card.data('id'),
        title: $card.find('.product-title').text(),
        price: $card.find('.product-price').text(),
        image: $card.find('.product-image').attr('src')
      };

      cartData.push(item);
      localStorage.setItem('cart', JSON.stringify(cartData));
      addCartItemToDOM(item);
    });

    $('#clearCart').click(function() {
      cartData = [];
      localStorage.removeItem('cart');
      $('#cartItems').empty();
      $(this).effect('shake', { times: 2 }, 300);
    });

    $('#search').on('input', function() {
      const searchTerm = $(this).val().toLowerCase();

      $slider.slick('slickUnfilter');

      if (searchTerm) {
        $slider.slick('slickFilter', function(index, element) {
          const title = $(element).find('.product-title').text().toLowerCase();
          return title.includes(searchTerm);
        });
      }
    });

    $(document).on('click', '.showDetail', function() {
      const $card = $(this).closest('.product-card');
      const title = $card.find('.product-title').text();
      const price = $card.find('.product-price').text();
      $.fancybox.open(`
        <div style="padding:20px;max-width:400px;">
          <h2>${title}</h2>
          <p>Fiyat: ${price}</p>
        </div>
      `);
    });

    function addCartItemToDOM(item) {
      const $cartItem = $(`
        <div class="cart-item">
          <img src="${item.image}" alt="">
          <div>
            <h4>${item.title}</h4>
            <p>${item.price}</p>
          </div>
        </div>
      `);
      $('#cartItems').append($cartItem);
    }
  });