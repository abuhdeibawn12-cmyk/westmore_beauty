(() => {
  const nav = document.querySelector('.exclusive-nav');
  const menuButton = document.querySelector('.exclusive-menu');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
    nav.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const resultSlides = [...document.querySelectorAll('.exclusive-result-slides figure')];
  const resultDots = document.querySelector('.exclusive-result-dots');
  const resultConcern = document.querySelector('.exclusive-result-concern span');
  let resultIndex = 0;
  let resultTimer;

  const showResult = (index, restart = false) => {
    if (!resultSlides.length) return;
    resultIndex = (index + resultSlides.length) % resultSlides.length;
    resultSlides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === resultIndex));
    resultDots?.querySelectorAll('button').forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === resultIndex);
      dot.setAttribute('aria-selected', String(dotIndex === resultIndex));
    });
    if (resultConcern) resultConcern.textContent = resultSlides[resultIndex].dataset.concern || '';
    if (restart) {
      window.clearInterval(resultTimer);
      resultTimer = window.setInterval(() => showResult(resultIndex + 1), 3400);
    }
  };

  resultSlides.forEach((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-label', `Show ${slide.querySelector('figcaption')?.textContent || `result ${index + 1}`}`);
    button.addEventListener('click', () => showResult(index, true));
    resultDots?.append(button);
  });
  showResult(0);
  if (resultSlides.length > 1) resultTimer = window.setInterval(() => showResult(resultIndex + 1), 3400);

  const featuredImages = [...document.querySelectorAll('.exclusive-featured-gallery img')];
  let featuredIndex = 0;
  if (featuredImages.length > 1) {
    window.setInterval(() => {
      featuredImages[featuredIndex].classList.remove('is-active');
      featuredIndex = (featuredIndex + 1) % featuredImages.length;
      featuredImages[featuredIndex].classList.add('is-active');
    }, 2400);
  }

  const shadeButtons = [...document.querySelectorAll('.exclusive-shade-grid button')];
  const shadeLabel = document.querySelector('#exclusive-shade-label');
  const offerImages = [...document.querySelectorAll('.exclusive-offer-base, .exclusive-offer-second')];

  shadeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      shadeButtons.forEach((item) => {
        item.classList.remove('is-selected');
        item.removeAttribute('aria-pressed');
      });
      button.classList.add('is-selected');
      button.setAttribute('aria-pressed', 'true');
      const name = button.dataset.name || '';
      const image = button.dataset.image || '';
      if (shadeLabel) shadeLabel.textContent = name;
      offerImages.forEach((item, index) => {
        item.style.opacity = '0';
        window.setTimeout(() => {
          item.src = image;
          item.alt = index === 0 ? `Two Body Coverage Perfector products in ${name}` : '';
          item.style.opacity = '1';
        }, 130);
      });
    });
  });

  const quoteTrack = document.querySelector('.exclusive-quote-track');
  const scrollQuote = (direction) => {
    const card = quoteTrack?.querySelector('article');
    if (!quoteTrack || !card) return;
    quoteTrack.scrollBy({ left: (card.getBoundingClientRect().width + 24) * direction, behavior: 'smooth' });
  };
  document.querySelector('.exclusive-quote-prev')?.addEventListener('click', () => scrollQuote(-1));
  document.querySelector('.exclusive-quote-next')?.addEventListener('click', () => scrollQuote(1));

  const reviewerNames = [
    'Rosemarie M.', 'Jill F.', 'Sandy', 'Roseanne B.', 'Brenda K.', 'Maria D.', 'Debra L.', 'Catherine S.', 'Nancy H.', 'Linda P.',
    'Karen W.', 'Diane C.', 'Laura G.', 'Melissa T.', 'Barbara A.', 'Joan R.', 'Patricia N.', 'Susan E.', 'Helen V.', 'Denise B.',
    'Monica J.', 'Amy F.', 'Rachel C.', 'Donna M.', 'Theresa K.', 'Michelle P.', 'Carolyn S.', 'Sharon L.', 'Kimberly H.', 'Julie D.',
    'Christine R.', 'Angela T.', 'Janet W.', 'Robin E.', 'Sandra V.', 'Pamela N.', 'Frances B.', 'Nicole J.', 'Gloria F.', 'Evelyn C.',
    'Martha M.', 'Cheryl K.', 'Judith P.', 'Lori S.', 'Tina L.', 'Anne H.', 'Victoria D.', 'Renee R.', 'Beth T.', 'Katherine W.'
  ];
  const reviewTitles = ['I love this product because', 'The results on my skin', 'Really works!', 'I love this stuff', 'I have used it for years', 'Beautiful natural coverage', 'Finally feel confident', 'Stays on all day', 'Perfect for my legs', 'A true game changer'];
  const reviewBodies = [
    'It covers my sun spots on my arms and legs, does not transfer onto my clothes, and lasts until I wash it off.',
    'The results after putting it on look amazing. It gives me smooth, even coverage without feeling heavy.',
    'It stays on through heat and sweat when I follow the directions and let every layer dry completely.',
    'The coverage is perfect, looks like skin, and I can layer it only where I need more.',
    'I use it to cover broken blood vessels on my feet and ankles. It blends beautifully and looks natural.',
    'The shade melts into my skin and leaves a soft finish that still looks like me.',
    'I am comfortable wearing dresses again. The finish is even, luminous and very convincing.',
    'I wore it to an outdoor event and it remained smooth and transfer-resistant all day.',
    'It covers veins and discoloration so well without looking cakey. The body brush makes application easy.',
    'This is the first body makeup I have used that combines real coverage with a lightweight skin-like finish.'
  ];
  const reviewDates = ['07/14/26', '06/09/26', '06/08/26', '06/08/26', '06/08/26', '05/29/26', '05/23/26', '05/18/26', '05/12/26', '05/04/26'];
  const reviewList = document.querySelector('.exclusive-review-list');
  const pageNav = document.querySelector('.exclusive-review-pages');
  let activeReviewPage = 1;

  const renderReviewPage = (page) => {
    activeReviewPage = page;
    if (reviewList) {
      reviewList.innerHTML = '';
      for (let offset = 0; offset < 5; offset += 1) {
        const index = (page - 1) * 5 + offset;
        const row = document.createElement('article');
        row.className = 'exclusive-review-row';
        row.innerHTML = `<div class="reviewer"><b>${reviewerNames[index]} 🇺🇸</b><small>● Verified Buyer</small></div><div class="review-body"><span>★★★★★</span><h3>${reviewTitles[index % reviewTitles.length]}</h3><p>${reviewBodies[index % reviewBodies.length]}</p></div><time>${reviewDates[(page + offset - 2) % reviewDates.length]}</time>`;
        reviewList.append(row);
      }
    }
    pageNav?.querySelectorAll('button').forEach((button) => button.classList.toggle('is-active', Number(button.dataset.page) === page));
  };

  for (let page = 1; page <= 10; page += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.page = String(page);
    button.textContent = String(page);
    button.setAttribute('aria-label', `Review page ${page}`);
    button.addEventListener('click', () => {
      renderReviewPage(page);
      document.querySelector('#reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    pageNav?.append(button);
  }
  renderReviewPage(activeReviewPage);

  const addButton = document.querySelector('.exclusive-add-button');
  const addOnCheckbox = document.querySelector('.exclusive-addon-checkbox');
  const buyTotal = document.querySelector('.exclusive-buy-total');
  const cart = document.querySelector('.exclusive-cart');
  const cartOverlay = document.querySelector('.exclusive-cart-overlay');
  const cartItems = document.querySelector('.exclusive-cart-items');
  const cartEmpty = document.querySelector('.exclusive-cart-empty');
  const cartSubtotal = document.querySelector('.exclusive-cart-subtotal');
  const cartCount = document.querySelector('.exclusive-cart-count');
  const cartToggle = document.querySelector('.exclusive-cart-toggle');
  const cartClose = document.querySelector('.exclusive-cart-close');
  const continueButton = document.querySelector('.exclusive-continue');
  const checkoutButton = document.querySelector('.exclusive-checkout');
  const toast = document.querySelector('.exclusive-toast');
  const sharedCart = window.WestmoreCart;
  let toastTimer;
  let basket = Object.fromEntries(sharedCart.getItems().map((item) => [item.key, item]));

  const money = (value) => `$${value.toFixed(2)}`;
  const saveBasket = () => {
    const saved = sharedCart.getItems();
    saved.forEach((item) => {
      if (!basket[item.key]) sharedCart.remove(item.key);
    });
    Object.entries(basket).forEach(([key, item]) => {
      const existing = sharedCart.getItems().find((savedItem) => savedItem.key === key);
      if (existing) sharedCart.setQuantity(key, item.quantity);
      else sharedCart.add({ ...item, key }, item.quantity);
    });
  };
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3000);
  };

  const openCart = () => {
    cart?.classList.add('is-open');
    cartOverlay?.classList.add('is-open');
    cart?.setAttribute('aria-hidden', 'false');
    cartToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('cart-open');
    window.setTimeout(() => cartClose?.focus(), 220);
  };

  const closeCart = () => {
    cart?.classList.remove('is-open');
    cartOverlay?.classList.remove('is-open');
    cart?.setAttribute('aria-hidden', 'true');
    cartToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('cart-open');
  };

  const renderBasket = () => {
    const entries = Object.entries(basket).filter(([, item]) => item.quantity > 0);
    const itemCount = entries.reduce((sum, [, item]) => sum + item.quantity, 0);
    const subtotal = entries.reduce((sum, [, item]) => sum + item.price * item.quantity, 0);
    if (cartCount) cartCount.textContent = String(itemCount);
    if (cartSubtotal) cartSubtotal.textContent = money(subtotal);
    cart?.classList.toggle('has-items', entries.length > 0);
    if (cartEmpty) cartEmpty.hidden = entries.length > 0;
    if (checkoutButton) checkoutButton.disabled = entries.length === 0;
    if (cartItems) {
      cartItems.innerHTML = '';
      entries.forEach(([key, item]) => {
        const article = document.createElement('article');
        article.className = 'exclusive-cart-item';
        article.dataset.key = key;
        article.innerHTML = `<img src="${item.image}" alt=""><div><h3>${item.name}</h3><p>${item.detail}</p><span class="exclusive-cart-item-price">${money(item.price * item.quantity)}</span><div class="exclusive-cart-quantity"><button type="button" data-action="decrease" aria-label="Decrease ${item.name} quantity">−</button><span>${item.quantity}</span><button type="button" data-action="increase" aria-label="Increase ${item.name} quantity">+</button></div></div><button class="exclusive-cart-item-remove" type="button" data-action="remove">Remove</button>`;
        if (item.url) {
          const image = article.querySelector(':scope > img');
          const imageLink = document.createElement('a');
          imageLink.href = item.url;
          imageLink.setAttribute('aria-label', `View ${item.name}`);
          image.replaceWith(imageLink);
          imageLink.append(image);
          const heading = article.querySelector('h3');
          const nameLink = document.createElement('a');
          nameLink.href = item.url;
          nameLink.textContent = item.name;
          heading.replaceChildren(nameLink);
        }
        cartItems.append(article);
      });
    }
    saveBasket();
  };

  const updateBuyTotal = () => {
    if (buyTotal) buyTotal.textContent = money(59 + (addOnCheckbox?.checked ? 39 : 0));
  };

  addOnCheckbox?.addEventListener('change', updateBuyTotal);
  updateBuyTotal();
  renderBasket();

  addButton?.addEventListener('click', () => {
    const shade = shadeLabel?.textContent || '2N Natural Radiance';
    const selectedShade = shadeButtons.find((button) => button.classList.contains('is-selected'));
    basket.offer = {
      name: 'Body Coverage Perfector Exclusive Offer',
      detail: `Two 3.4 oz products · ${shade}`,
      image: selectedShade?.dataset.image || 'assets/Product_On_Tan_-_BOB_Award_-_2N.jpg',
      url: 'exclusive-offer.html#offer',
      price: 59,
      quantity: (basket.offer?.quantity || 0) + 1
    };
    if (addOnCheckbox?.checked) {
      basket.brush = {
        name: 'Blend & Blur Body Brush',
        detail: 'Discounted add-on',
        image: 'assets/brush_05_product-hero-tan_700172b4-301b-424c-8cae-3739234126dd.webp',
        url: 'brush.html',
        price: 39,
        quantity: (basket.brush?.quantity || 0) + 1
      };
    }
    renderBasket();
    openCart();
    showToast('Your exclusive offer has been added to the basket.');
  });

  cartToggle?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  continueButton?.addEventListener('click', closeCart);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cart?.classList.contains('is-open')) closeCart();
  });

  cartItems?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    const itemElement = button?.closest('.exclusive-cart-item');
    const key = itemElement?.dataset.key;
    if (!button || !key || !basket[key]) return;
    const action = button.dataset.action;
    if (action === 'increase') basket[key].quantity += 1;
    if (action === 'decrease') basket[key].quantity -= 1;
    if (action === 'remove' || basket[key].quantity <= 0) delete basket[key];
    renderBasket();
  });

  checkoutButton?.addEventListener('click', () => {
    if (!Object.keys(basket).length) return;
    showToast('Checkout is ready for business testing.');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));
})();
