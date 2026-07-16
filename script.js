const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const money = (value) => `$${Number(value).toFixed(2)}`;
const state = {
  basePrice: 49,
  purchase: "one-time",
  shade: "2N Natural Radiance",
  size: "3.4oz",
  quantity: 0,
};
const storeCart = window.WestmoreCart;
let pairingBrushAdded = false;

const shadeResults = {
  "1N Light Radiance": "assets/Results_-_1N_Update_1.jpg",
  "1C Cool Radiance": "assets/Results_-_1C.jpg",
  "2W Warm Radiance": "assets/Results_-_2W_1.jpg",
  "2N Natural Radiance": "assets/Results_-_2N_1.jpg",
  "3N Sunlit Radiance": "assets/Results_-_3N.jpg",
  "3W Golden Radiance": "assets/Results_-_3W_1.jpg",
  "4W Tan Radiance": "assets/Results_-_4W.jpg",
  "4C Bronze Radiance": "assets/Results_-_4C_1.jpg",
  "5W Deep Radiance": "assets/Results_-_5W_1.jpg",
  "6N Rich Radiance": "assets/Results_-_6N.jpg",
};

const mainImage = $("#main-product-image");
const galleryThumbs = $$(".gallery-thumb");
let galleryIndex = galleryThumbs.findIndex((thumb) => thumb.classList.contains("active"));

$("#gallery-total").textContent = String(galleryThumbs.length);

function selectGallery(index) {
  galleryIndex = (index + galleryThumbs.length) % galleryThumbs.length;
  const thumb = galleryThumbs[galleryIndex];
  galleryThumbs.forEach((item) => item.classList.toggle("active", item === thumb));
  mainImage.style.opacity = ".45";
  window.setTimeout(() => {
    mainImage.src = thumb.dataset.image;
    mainImage.alt = thumb.dataset.alt;
    mainImage.style.opacity = "1";
  }, 100);
  $("#gallery-current").textContent = String(galleryIndex + 1);
}

galleryThumbs.forEach((thumb, index) => thumb.addEventListener("click", () => selectGallery(index)));
$(".gallery-prev").addEventListener("click", () => selectGallery(galleryIndex - 1));
$(".gallery-next").addEventListener("click", () => selectGallery(galleryIndex + 1));

function currentPrice() {
  return state.basePrice;
}

function updatePricing() {
  $("#display-price").textContent = money(currentPrice());
  $("#button-price").textContent = money(currentPrice() + ($("#add-brush").checked && !pairingBrushAdded ? 49 : 0));
}

$$('input[name="shade"]').forEach((input) => {
  input.addEventListener("change", () => {
    state.shade = input.value;
    $("#shade-name").textContent = input.value;

    const resultThumb = $('[data-gallery-role="shade-result"]');
    const heroThumb = $('[data-gallery-role="shade-hero"]');
    const resultImage = shadeResults[input.value];

    resultThumb.dataset.image = resultImage;
    resultThumb.dataset.alt = `${input.value} before and after result`;
    $("img", resultThumb).src = resultImage;
    resultThumb.setAttribute("aria-label", `View ${input.value} result`);

    heroThumb.dataset.image = input.dataset.hero;
    heroThumb.dataset.alt = `Body Coverage Perfector in ${input.value}`;
    $("img", heroThumb).src = input.dataset.hero;

    mainImage.src = input.dataset.hero;
    mainImage.alt = `Body Coverage Perfector in ${input.value}`;
    galleryThumbs.forEach((thumb) => thumb.classList.toggle("active", thumb === heroThumb));
    galleryIndex = galleryThumbs.indexOf(heroThumb);
    $("#gallery-current").textContent = String(galleryIndex + 1);
  });
});

$$('input[name="size"]').forEach((input) => {
  input.addEventListener("change", () => {
    state.size = input.value;
    state.basePrice = Number(input.dataset.price);
    $("#size-name").textContent = input.value;
    updatePricing();
  });
});

$$('input[name="purchase"]').forEach((input) => {
  input.addEventListener("change", () => {
    state.purchase = input.value;
    $$(".purchase-card").forEach((card) => card.classList.toggle("selected", card.contains(input)));
    updatePricing();
  });
});

$("#add-brush").addEventListener("change", () => {
  const brushLine = storeCart.getItems().find((item) => item.key === "blend-blur-body-brush|Gold");
  if ($("#add-brush").checked) {
    storeCart.add({
      key: "blend-blur-body-brush|Gold",
      name: "Blend & Blur Body Brush",
      detail: "Gold",
      image: "assets/brush/gold-hero.webp",
      url: "brush.html",
      price: 49,
    });
    pairingBrushAdded = true;
    setDrawer(true);
    showToast("Blend & Blur Body Brush added to your bag");
  } else if (pairingBrushAdded && brushLine) {
    storeCart.setQuantity(brushLine.key, brushLine.quantity - 1);
    pairingBrushAdded = false;
  }
  updatePricing();
});

const clinicalTrack = $(".clinical-track");
const clinicalSlides = $$(".clinical-slide");
const clinicalDots = $$(".clinical-dots button");
let clinicalIndex = 0;
let clinicalPointerStart = null;

function selectClinical(index) {
  clinicalIndex = (index + clinicalSlides.length) % clinicalSlides.length;
  clinicalTrack.style.transform = `translateX(-${clinicalIndex * 100}%)`;
  clinicalDots.forEach((dot, dotIndex) => {
    const active = dotIndex === clinicalIndex;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-selected", String(active));
  });
}

clinicalDots.forEach((dot, index) => dot.addEventListener("click", () => selectClinical(index)));
$(".clinical-prev").addEventListener("click", () => selectClinical(clinicalIndex - 1));
$(".clinical-next").addEventListener("click", () => selectClinical(clinicalIndex + 1));
$(".clinical-slider").addEventListener("pointerdown", (event) => {
  clinicalPointerStart = event.clientX;
});
$(".clinical-slider").addEventListener("pointerup", (event) => {
  if (clinicalPointerStart === null) return;
  const distance = event.clientX - clinicalPointerStart;
  if (Math.abs(distance) > 45) selectClinical(clinicalIndex + (distance < 0 ? 1 : -1));
  clinicalPointerStart = null;
});

const drawer = $(".cart-drawer");
const backdrop = $(".drawer-backdrop");

function setDrawer(open) {
  drawer.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  backdrop.hidden = !open;
  document.body.classList.toggle("no-scroll", open);
  if (open) $(".drawer-close").focus();
}

function updateCart() {
  const lineTotal = currentPrice() * Math.max(state.quantity, 1) + ($("#add-brush").checked ? 49 : 0);
  $(".cart-count").textContent = String(state.quantity);
  $(".cart-count").classList.toggle("visible", state.quantity > 0);
  $(".cart-count").setAttribute("aria-label", `${state.quantity} items`);
  $(".drawer-count").textContent = `(${state.quantity})`;
  $(".drawer-empty").hidden = state.quantity > 0;
  $(".drawer-line").hidden = state.quantity === 0;
  $(".drawer-footer").hidden = state.quantity === 0;
  $("#drawer-image").src = $('input[name="shade"]:checked').dataset.hero;
  $("#drawer-shade").textContent = state.shade;
  $("#drawer-size").textContent = state.size;
  $("#drawer-plan").textContent = state.purchase === "subscription" ? `Subscribe & Save 20% · ${$("#delivery-frequency").value}` : "One-time purchase";
  $(".quantity span").textContent = String(state.quantity);
  $("#drawer-price").textContent = money(lineTotal);
  $("#drawer-subtotal").textContent = money(lineTotal);
}

function renderCart() {
  storeCart.renderGenericCart();
}
storeCart.subscribe(renderCart);

$(".add-to-bag").addEventListener("click", () => {
  const plan = state.purchase === "subscription"
    ? `Subscribe & Save 20% · ${$("#delivery-frequency").value}`
    : "One-time purchase";
  storeCart.add({
    key: `body-coverage-perfector|${state.shade}|${state.size}|${state.purchase}`,
    name: "Body Coverage Perfector",
    detail: `${state.shade} / ${state.size} · ${plan}`,
    image: $('input[name="shade"]:checked').dataset.hero,
    url: "index.html",
    price: currentPrice(),
  });
  if ($("#add-brush").checked && !pairingBrushAdded) {
    storeCart.add({
      key: "blend-blur-body-brush|Gold",
      name: "Blend & Blur Body Brush",
      detail: "Gold",
      image: "assets/brush/gold-hero.webp",
      url: "brush.html",
      price: 49,
    });
  }
  setDrawer(true);
});
$(".cart-button").addEventListener("click", () => setDrawer(true));
$(".drawer-close").addEventListener("click", () => setDrawer(false));
backdrop.addEventListener("click", () => setDrawer(false));

const quantityButtons = $$(".quantity button");
quantityButtons[0]?.addEventListener("click", () => {
  state.quantity = Math.max(0, state.quantity - 1);
  updateCart();
});
quantityButtons[1]?.addEventListener("click", () => {
  state.quantity += 1;
  updateCart();
});

const mobileNav = $(".mobile-nav");
function setMenu(open) {
  mobileNav.hidden = !open;
  $(".menu-button").setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("no-scroll", open);
}
$(".menu-button").addEventListener("click", () => setMenu(true));
$(".mobile-nav-close").addEventListener("click", () => setMenu(false));
$$('.mobile-nav a').forEach((link) => link.addEventListener("click", () => setMenu(false)));

const shadeModal = $(".shade-modal");
function setShadeModal(open) {
  shadeModal.hidden = !open;
  document.body.classList.toggle("no-scroll", open);
}
$(".shade-finder").addEventListener("click", () => setShadeModal(true));
$(".shade-modal-close").addEventListener("click", () => setShadeModal(false));
shadeModal.addEventListener("click", (event) => { if (event.target === shadeModal) setShadeModal(false); });
$$('.shade-quiz button').forEach((button) => {
  button.addEventListener("click", () => {
    const recommendation = button.dataset.recommend;
    $(".shade-result").textContent = `We recommend starting with ${recommendation}.`;
    const match = $(`input[name="shade"][value="${button.dataset.recommend}"]`);
    match.checked = true;
    match.dispatchEvent(new Event("change", { bubbles: true }));
    setShadeModal(false);
    showToast(`${recommendation} selected`);
  });
});

const quickModals = $$(".quick-view-modal");

function setQuickModal(name, open) {
  quickModals.forEach((modal) => {
    const shouldOpen = open && modal.dataset.quickModal === name;
    modal.hidden = !shouldOpen;
    if (shouldOpen) $(".quick-view-close", modal).focus();
  });
  document.body.classList.toggle("no-scroll", open);
}

$$('[data-quick-view]').forEach((button) => {
  button.addEventListener("click", () => setQuickModal(button.dataset.quickView, true));
});

$$('.quick-view-close').forEach((button) => {
  button.addEventListener("click", () => setQuickModal(null, false));
});

quickModals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) setQuickModal(null, false);
  });
});

$$('input[name="set-shade"]').forEach((input) => {
  input.addEventListener("change", () => {
    $("#set-shade-name").textContent = input.value;
  });
});

$$('[data-brush-color]:not(:disabled)').forEach((button) => {
  button.addEventListener("click", () => {
    $$('[data-brush-color]').forEach((option) => {
      const selected = option === button;
      option.classList.toggle("selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    $("#brush-color-name").textContent = button.dataset.brushColor;
  });
});

$$('[data-add-product]').forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.addProduct;
    const selection = product === "Body Essentials Set"
      ? $('input[name="set-shade"]:checked').value
      : $("#brush-color-name").textContent;
    if (product === "Body Essentials Set") {
      storeCart.add({
        key: `body-essentials-set|${selection}`,
        name: product,
        detail: selection,
        image: "assets/BCKit_OnTan_1.jpg",
        url: "index.html#pair-heading",
        price: 84,
      });
    } else {
      storeCart.add({
        key: `blend-blur-body-brush|${selection}`,
        name: product,
        detail: selection,
        image: "assets/brush/gold-hero.webp",
        url: "brush.html",
        price: 49,
      });
    }
    setQuickModal(null, false);
    setDrawer(true);
    showToast(`${product} · ${selection} added to your bag`);
  });
});

const featuredReviews = [
  {
    author: "Rosemarie M.",
    country: "U.S.",
    rating: 5,
    title: "I love this product because",
    body: "I love this product because it covers my sun spots. Both in my arms & legs. It doesn't transfer on my clothes, and lasts until you wash it off! Finally, I like having a color choice so you can blend into your favorite season. Telling my friends about it. Thank you.",
    date: "2025-07-14",
  },
  {
    author: "Jill F.",
    country: "U.S.",
    rating: 5,
    title: "The results on my skin",
    body: "The results on my skin after putting it on look amazing! Perfect coverage!",
    date: "2025-06-09",
  },
  {
    author: "Sandy",
    country: "U.S.",
    rating: 5,
    title: "Really works!!",
    body: "The first body perfector that actually does not come off when you sweat. You can even take a shower with it on and it stays until you scrub it off. Follow the directions and apply it quickly because it dries fast.",
    date: "2025-06-08",
  },
  {
    author: "Roseanne B.",
    country: "U.S.",
    rating: 5,
    title: "I love this stuff!",
    body: "I love this stuff. The coverage is perfect and you can layer it if you need to. The value is great.",
    date: "2025-06-08",
  },
  {
    author: "Brenda K.",
    country: "U.S.",
    rating: 5,
    title: "I have used it for years",
    body: "I have used it for years to cover broken blood vessels on my feet and ankles. It covers beautifully. I also use it on the back of my hands to hide imperfections. I cannot imagine not having it in my beauty collection.",
    date: "2025-06-08",
  },
];

const reviewAuthors = [
  "Melissa R.", "Jo P.", "Emily S.", "Barbara C.", "Donna L.",
  "Carolyn H.", "Janet A.", "Michele T.", "Susan D.", "Tina B.",
  "Cynthia W.", "Laura G.", "Patricia N.", "Diane K.", "Karen M.",
  "Deborah F.", "Linda V.", "Sharon E.", "Nancy J.", "Christine P.",
  "Denise R.", "Mary C.", "Teresa H.", "Angela S.", "Catherine B.",
  "Monica L.", "Judith W.", "Renee D.", "Valerie T.", "Gail A.",
  "Robin M.", "Sandra K.", "Elaine F.", "Gloria N.", "Julie G.",
  "Annette C.", "Paula V.", "Lori H.", "Kathy E.", "Beverly P.",
  "Tammy R.", "Yvonne J.", "Alicia D.", "Nina S.", "Marcia L.",
];

const reviewStories = [
  ["Confidence in a tube", "This gives my legs a smooth, natural-looking finish and helps me feel confident wearing dresses again."],
  ["Beautiful natural finish", "It evens everything out without looking heavy. The shade blends beautifully and still looks like my skin."],
  ["Great coverage", "A small amount covers the discoloration on my legs. I build it in thin layers and the result lasts all day."],
  ["Does not transfer", "I followed the application directions, let it dry, and it stayed off my clothes. I am very impressed."],
  ["Perfect for summer", "This has become a summer essential. My legs look smooth and radiant, never sparkly or artificial."],
  ["Covers veins beautifully", "The coverage softens the look of veins and uneven color while leaving a flexible, comfortable finish."],
  ["A little goes a long way", "The formula spreads farther than I expected. Using the body brush gives me the most even result."],
  ["Stays put all day", "I wore it through a warm outdoor event and the finish still looked fresh when I got home."],
  ["Easy to blend", "It blends quickly with my hands or the brush. The color looks even and does not settle into dry areas."],
  ["My new favorite", "I have tried several body foundations and this one gives me the best balance of coverage and a skin-like finish."],
  ["Lovely radiance", "The subtle radiance makes my skin look healthy. It is polished enough for events but natural enough for every day."],
  ["Works on scars", "It noticeably softens the appearance of an old scar. Two light layers give me the coverage I want."],
  ["Good shade match", "The shade guide helped me choose correctly. Once blended, the color transitions naturally into my skin."],
  ["Long-lasting result", "After it dries, it wears very well. Soap and a washcloth remove it easily at the end of the day."],
  ["Nice formula", "The texture is lightweight and comfortable. I would prefer a little more time to blend before it sets."],
  ["Helpful for special occasions", "It photographs beautifully and gave my shoulders and legs an even finish for a wedding."],
  ["Buildable coverage", "One layer is sheer and natural; a second layer gives more coverage exactly where I need it."],
  ["Needs careful application", "The finish is good, but preparation matters. Exfoliating and working in small sections made a big difference."],
  ["Color was too warm", "The product wears well, although the shade I chose was warmer than expected. I will exchange for a cooler tone."],
  ["Not for me", "I liked the coverage but found the formula set too quickly for my preferred application style."],
];

const generatedReviews = reviewAuthors.map((author, index) => {
  const story = reviewStories[index % reviewStories.length];
  const rating = index < 30 ? 5 : index < 39 ? 4 : index < 42 ? 3 : index < 44 ? 2 : 1;
  const date = new Date(Date.UTC(2025, 5, 7 - index)).toISOString().slice(0, 10);
  return { author, country: index % 12 === 7 ? "CA" : "U.S.", rating, title: story[0], body: story[1], date };
});

const customerReviews = [...featuredReviews, ...generatedReviews];
const reviewsPerPage = 5;
let reviewPage = 1;

function sortedReviews() {
  const sort = $("#review-sort").value;
  return [...customerReviews].sort((a, b) => {
    if (sort === "lowest") return a.rating - b.rating || new Date(b.date) - new Date(a.date);
    if (sort === "newest") return new Date(b.date) - new Date(a.date);
    if (sort === "oldest") return new Date(a.date) - new Date(b.date);
    return b.rating - a.rating || new Date(b.date) - new Date(a.date);
  });
}

function reviewPageItems(totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (reviewPage <= 4) return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  if (reviewPage >= totalPages - 3) return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, "ellipsis-start", reviewPage - 1, reviewPage, reviewPage + 1, "ellipsis-end", totalPages];
}

function renderReviewPagination(totalPages) {
  const pagination = $(".review-pagination");
  pagination.innerHTML = "";

  const addButton = (label, page, options = {}) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.disabled = Boolean(options.disabled);
    button.classList.toggle("active", Boolean(options.active));
    if (options.active) button.setAttribute("aria-current", "page");
    button.setAttribute("aria-label", options.ariaLabel || `Go to review page ${page}`);
    button.addEventListener("click", () => {
      reviewPage = page;
      renderReviews();
      $(".review-toolbar").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    pagination.append(button);
  };

  addButton("‹", Math.max(1, reviewPage - 1), { disabled: reviewPage === 1, ariaLabel: "Previous review page" });
  reviewPageItems(totalPages).forEach((item) => {
    if (String(item).startsWith("ellipsis")) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "review-page-ellipsis";
      ellipsis.textContent = "…";
      ellipsis.setAttribute("aria-hidden", "true");
      pagination.append(ellipsis);
      return;
    }
    addButton(String(item), item, { active: item === reviewPage });
  });
  addButton("›", Math.min(totalPages, reviewPage + 1), { disabled: reviewPage === totalPages, ariaLabel: "Next review page" });
}

function renderReviews() {
  const reviews = sortedReviews();
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  reviewPage = Math.min(reviewPage, totalPages);
  const pageReviews = reviews.slice((reviewPage - 1) * reviewsPerPage, reviewPage * reviewsPerPage);

  $("#review-list").innerHTML = pageReviews.map((review) => {
    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
    const date = new Intl.DateTimeFormat("en-US", { year: "2-digit", month: "2-digit", day: "2-digit", timeZone: "UTC" }).format(new Date(`${review.date}T00:00:00Z`));
    return `<article class="review-row">
      <div class="review-author"><p>${review.author} <small>${review.country}</small></p><span class="verified-buyer">Verified Buyer</span></div>
      <div class="review-copy"><div class="review-heading"><span class="stars" aria-label="${review.rating} out of 5 stars">${stars}</span><h3>${review.title}</h3></div><p>${review.body}</p></div>
      <time class="review-date" datetime="${review.date}">${date}</time>
    </article>`;
  }).join("");

  renderReviewPagination(totalPages);
}

$("#review-sort").addEventListener("change", () => {
  reviewPage = 1;
  renderReviews();
});

renderReviews();

const customersDrawer = $(".customers-say-drawer");
const customersBackdrop = $(".customers-say-backdrop");

function setCustomersSay(open) {
  customersDrawer.classList.toggle("open", open);
  customersDrawer.setAttribute("aria-hidden", String(!open));
  customersBackdrop.hidden = !open;
  document.body.classList.toggle("no-scroll", open);
  if (open) $(".customers-say-close").focus();
}

$$('[data-review-product]').forEach((button) => {
  button.addEventListener("click", () => {
    setQuickModal(null, false);
    setCustomersSay(true);
  });
});

$(".customers-say-close").addEventListener("click", () => setCustomersSay(false));
customersBackdrop.addEventListener("click", () => setCustomersSay(false));

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  setDrawer(false);
  setMenu(false);
  setShadeModal(false);
  setQuickModal(null, false);
  setCustomersSay(false);
});

const toast = $(".toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

$$('a[href="#"]').forEach((link) => link.addEventListener("click", (event) => event.preventDefault()));
updatePricing();
renderCart();
