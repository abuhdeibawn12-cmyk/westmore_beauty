const homeSelect = (selector, scope = document) => scope.querySelector(selector);
const homeSelectAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const homeMobileNav = homeSelect(".mobile-nav");

function setHomeMenu(open) {
  homeMobileNav.hidden = !open;
  homeSelect(".menu-button").setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("no-scroll", open);
}

homeSelect(".menu-button").addEventListener("click", () => setHomeMenu(true));
homeSelect(".mobile-nav-close").addEventListener("click", () => setHomeMenu(false));
homeSelectAll(".mobile-nav a").forEach((link) => link.addEventListener("click", () => setHomeMenu(false)));

const comparison = homeSelect(".home-comparison");
homeSelect("#comparison-range").addEventListener("input", (event) => {
  comparison.style.setProperty("--comparison", `${event.currentTarget.value}%`);
});

const reelCards = homeSelectAll(".reel-card");

function setReelState(card, playing) {
  const playButton = homeSelect(".reel-play", card);
  card.classList.toggle("is-playing", playing);
  playButton.setAttribute("aria-label", playing ? "Pause video" : "Play video");
}

function setReelMuteState(card) {
  const video = homeSelect("video", card);
  const muteButton = homeSelect(".reel-mute", card);
  muteButton.classList.toggle("is-muted", video.muted);
  muteButton.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
}

function activateReel(card) {
  reelCards.forEach((otherCard) => otherCard.classList.toggle("is-active", otherCard === card));
  window.requestAnimationFrame(() => card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }));
}

function toggleReel(card) {
  const video = homeSelect("video", card);
  activateReel(card);
  if (video.paused) {
    reelCards.forEach((otherCard) => {
      if (otherCard === card) return;
      const otherVideo = homeSelect("video", otherCard);
      otherVideo.pause();
      setReelState(otherCard, false);
    });
    if (!card.dataset.soundChosen) {
      video.muted = false;
      video.volume = 1;
      setReelMuteState(card);
    }
    video.play().then(() => setReelState(card, true)).catch(() => setReelState(card, false));
  } else {
    video.pause();
    setReelState(card, false);
  }
}

reelCards.forEach((card) => {
  const video = homeSelect("video", card);
  const playButton = homeSelect(".reel-play", card);
  const muteButton = homeSelect(".reel-mute", card);

  video.addEventListener("click", () => toggleReel(card));
  playButton.addEventListener("click", () => toggleReel(card));
  video.addEventListener("pause", () => setReelState(card, false));
  video.addEventListener("play", () => setReelState(card, true));
  muteButton.addEventListener("click", () => {
    video.muted = !video.muted;
    video.volume = 1;
    card.dataset.soundChosen = "true";
    setReelMuteState(card);
  });
});

const homeSearch = homeSelect(".home-search");
const homeSearchInput = homeSelect("#home-search-input");
const homeSearchProducts = homeSelectAll(".home-search-product");
const homeSearchEmpty = homeSelect(".home-search-empty");

function filterHomeSearch() {
  const query = homeSearchInput.value.trim().toLowerCase();
  let visibleProducts = 0;
  homeSearchProducts.forEach((product) => {
    const visible = !query || product.dataset.searchTerms.includes(query);
    product.hidden = !visible;
    if (visible) visibleProducts += 1;
  });
  homeSearchEmpty.hidden = visibleProducts > 0;
}

function setHomeSearch(open) {
  homeSearch.hidden = !open;
  document.body.classList.toggle("no-scroll", open);
  if (open) {
    homeSearchInput.value = "";
    filterHomeSearch();
    homeSearchInput.focus();
  }
}

homeSelect(".home-search-button").addEventListener("click", () => setHomeSearch(true));
homeSelect(".home-search-close").addEventListener("click", () => setHomeSearch(false));
homeSearch.addEventListener("click", (event) => {
  if (event.target === homeSearch) setHomeSearch(false);
});
homeSearchInput.addEventListener("input", filterHomeSearch);
homeSelect(".home-search form").addEventListener("submit", (event) => {
  event.preventDefault();
  filterHomeSearch();
});

const homeStoreCart = window.WestmoreCart;
const homeCart = homeSelect(".cart-drawer");
const homeBackdrop = homeSelect(".drawer-backdrop");
function setHomeCart(open) {
  homeCart.classList.toggle("open", open);
  homeCart.setAttribute("aria-hidden", String(!open));
  homeBackdrop.hidden = !open;
  document.body.classList.toggle("no-scroll", open);
  if (open) homeSelect(".drawer-close").focus();
}

homeSelect(".cart-button").addEventListener("click", () => setHomeCart(true));
homeSelect(".drawer-close").addEventListener("click", () => setHomeCart(false));
homeBackdrop.addEventListener("click", () => setHomeCart(false));
homeStoreCart.subscribe(() => homeStoreCart.renderGenericCart());
homeStoreCart.renderGenericCart();

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  setHomeMenu(false);
  setHomeSearch(false);
  setHomeCart(false);
});

const homeToast = homeSelect(".toast");
let homeToastTimer;
function showHomeToast(message) {
  homeToast.textContent = message;
  homeToast.classList.add("show");
  window.clearTimeout(homeToastTimer);
  homeToastTimer = window.setTimeout(() => homeToast.classList.remove("show"), 2600);
}

homeSelectAll('a[href="#"]').forEach((link) => link.addEventListener("click", (event) => event.preventDefault()));
