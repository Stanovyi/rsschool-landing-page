const productsList = document.querySelector(".products");
const tabs = document.querySelectorAll(".tab");
const loadMoreBtn = document.querySelector(".load-more");
const modal = document.querySelector(".modal");
const modalBackdrop = document.querySelector(".modal-backdrop");
const modalClose = document.querySelector(".modal-close");
const modalBody = document.querySelector(".modal-body");

let products = [];
let activeCategory = "coffee";
let showAll = false;

function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function getImagePath(product, index) {
  const number = index + 1;

  if (product.category === "coffee") {
    return "./assets/images/coffee-" + number + ".jpg";
  }

  if (product.category === "tea") {
    return "./assets/images/tea-" + number + ".png";
  }

  return "./assets/images/dessert-" + number + ".png";
}

function getCategoryProducts() {
  return products.filter(function (item) {
    return item.category === activeCategory;
  });
}

function createCard(product, index) {
  const li = document.createElement("li");
  li.className = "card";
  li.dataset.index = String(products.indexOf(product));

  li.innerHTML =
    '<img class="card-img" src="' +
    getImagePath(product, index) +
    '" alt="' +
    product.name +
    '">' +
    '<div class="card-body">' +
    '<h2 class="card-heading">' +
    product.name +
    "</h2>" +
    "<p>" +
    product.description +
    "</p>" +
    '<p class="card-price">$' +
    product.price +
    "</p>" +
    "</div>";

  li.addEventListener("click", function () {
    openModal(product, index);
  });

  return li;
}

function renderCards() {
  if (!productsList) {
    return;
  }

  const categoryProducts = getCategoryProducts();
  const limit = isMobile() && !showAll ? 4 : categoryProducts.length;

  productsList.innerHTML = "";

  categoryProducts.forEach(function (product, index) {
    if (index < limit) {
      productsList.appendChild(createCard(product, index));
    }
  });

  updateLoadMore(categoryProducts.length, limit);
}

function updateLoadMore(total, shown) {
  if (!loadMoreBtn) {
    return;
  }

  if (isMobile() && shown < total) {
    loadMoreBtn.classList.add("is-visible");
  } else {
    loadMoreBtn.classList.remove("is-visible");
  }
}

function setActiveTab(category) {
  activeCategory = category;
  showAll = false;

  tabs.forEach(function (tab) {
    const isActive = tab.dataset.category === category;

    if (isActive) {
      tab.classList.add("tab-active");
      tab.setAttribute("aria-selected", "true");
      tab.removeAttribute("tabindex");
    } else {
      tab.classList.remove("tab-active");
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
    }
  });

  renderCards();
}

function formatPrice(value) {
  return value.toFixed(2);
}

function getTotalPrice(product, sizeKey, selectedAdditives) {
  let total = parseFloat(product.price);
  total += parseFloat(product.sizes[sizeKey]["add-price"]);

  selectedAdditives.forEach(function (index) {
    total += parseFloat(product.additives[index]["add-price"]);
  });

  return formatPrice(total);
}

function openModal(product, categoryIndex) {
  if (!modal || !modalBody) {
    return;
  }

  let selectedSize = "s";
  const selectedAdditives = [];
  const sizeKeys = Object.keys(product.sizes);

  function updatePrice() {
    const priceEl = modalBody.querySelector(".modal-price-value");
    if (priceEl) {
      priceEl.textContent = "$" + getTotalPrice(product, selectedSize, selectedAdditives);
    }
  }

  let sizesHtml = "";
  sizeKeys.forEach(function (key, i) {
    const size = product.sizes[key];
    const activeClass = key === selectedSize ? " modal-option-active" : "";
    sizesHtml +=
      '<button class="modal-option' +
      activeClass +
      '" type="button" data-size="' +
      key +
      '">' +
      '<span class="modal-option-mark">' +
      key.toUpperCase() +
      "</span>" +
      "<span>" +
      size.size +
      "</span>" +
      "</button>";
  });

  let additivesHtml = "";
  product.additives.forEach(function (additive, i) {
    additivesHtml +=
      '<button class="modal-option" type="button" data-additive="' +
      i +
      '">' +
      '<span class="modal-option-mark">' +
      (i + 1) +
      "</span>" +
      "<span>" +
      additive.name +
      "</span>" +
      "</button>";
  });

  modalBody.innerHTML =
    '<img class="modal-img" src="' +
    getImagePath(product, categoryIndex) +
    '" alt="' +
    product.name +
    '">' +
    '<div class="modal-info">' +
    "<div>" +
    '<h2 class="modal-title">' +
    product.name +
    "</h2>" +
    '<p class="modal-description">' +
    product.description +
    "</p>" +
    "</div>" +
    '<div class="modal-group">' +
    '<p class="modal-label">Size</p>' +
    '<div class="modal-options">' +
    sizesHtml +
    "</div>" +
    "</div>" +
    '<div class="modal-group">' +
    '<p class="modal-label">Additives</p>' +
    '<div class="modal-options">' +
    additivesHtml +
    "</div>" +
    "</div>" +
    '<p class="modal-total">Total: <span class="modal-price-value">$' +
    getTotalPrice(product, selectedSize, selectedAdditives) +
    "</span></p>" +
    '<p class="modal-note">The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>' +
    "</div>";

  modalBody.querySelectorAll("[data-size]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectedSize = btn.dataset.size;

      modalBody.querySelectorAll("[data-size]").forEach(function (item) {
        item.classList.remove("modal-option-active");
      });
      btn.classList.add("modal-option-active");
      updatePrice();
    });
  });

  modalBody.querySelectorAll("[data-additive]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const index = Number(btn.dataset.additive);
      const position = selectedAdditives.indexOf(index);

      if (position === -1) {
        selectedAdditives.push(index);
        btn.classList.add("modal-option-active");
      } else {
        selectedAdditives.splice(position, 1);
        btn.classList.remove("modal-option-active");
      }

      updatePrice();
    });
  });

  modal.classList.add("modal-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open-body");
}

function closeModal() {
  if (!modal) {
    return;
  }

  modal.classList.remove("modal-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open-body");
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    setActiveTab(tab.dataset.category);
  });
});

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", function () {
    showAll = true;
    renderCards();
  });
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", closeModal);
}

if (modal) {
  const modalWindow = modal.querySelector(".modal-window");

  if (modalWindow) {
    modalWindow.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal && modal.classList.contains("modal-open")) {
    closeModal();
  }
});

let lastIsMobile = isMobile();

window.addEventListener("resize", function () {
  const mobileNow = isMobile();

  if (mobileNow !== lastIsMobile) {
    showAll = false;
    lastIsMobile = mobileNow;
  }

  renderCards();
});

fetch("./products.json")
  .then(function (response) {
    if (!response.ok) {
      throw new Error("products.json not found");
    }
    return response.json();
  })
  .then(function (data) {
    products = data;
    setActiveTab("coffee");
  })
  .catch(function (error) {
    console.error("Failed to load products", error);
  });
