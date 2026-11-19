/* =========================================================
   Ecobazar - app.js
   Frontend logic: products, cart, wishlist, shop filters,
   product details, checkout and form validation.

   BACKEND NOTE
   ------------
   PRODUCTS below is static demo data. When your backend is ready,
   replace it with: fetch('/api/products').then(r => r.json())
   Cart/wishlist/orders use localStorage; swap the Store.* calls
   with API requests (POST /api/cart, POST /api/orders, ...).
   ========================================================= */

const CURRENCY = "$";
const FREE_SHIPPING_MIN = 50;
const SHIPPING_FEE = 5;
const COUPONS = { ECO10: 0.1, GREEN20: 0.2 };

const CATEGORIES = [
  { slug: "fruits", name: "Fresh Fruit", emoji: "🍎" },
  { slug: "vegetables", name: "Fresh Vegetables", emoji: "🥦" },
  { slug: "meat-fish", name: "Meat & Fish", emoji: "🐟" },
  { slug: "beverages", name: "Beverages", emoji: "🥤" },
  { slug: "cooking", name: "Cooking Essentials", emoji: "🫒" },
  { slug: "snacks", name: "Snacks & Bakery", emoji: "🍪" },
];

const PRODUCTS = [
  { id: 1, name: "Green Apple", cat: "fruits", price: 14.99, old: 20.99, rating: 4, badge: "sale", stock: 120, img: "green-apple", unit: "1 kg" },
  { id: 2, name: "Surjapur Mango", cat: "fruits", price: 14.99, old: null, rating: 4, badge: null, stock: 90, img: "mango", unit: "1 kg" },
  { id: 3, name: "Red Tomatoes", cat: "vegetables", price: 14.99, old: null, rating: 4, badge: null, stock: 200, img: "tomato", unit: "1 kg" },
  { id: 4, name: "Fresh Cauliflower", cat: "vegetables", price: 14.99, old: null, rating: 4, badge: null, stock: 60, img: "cauliflower", unit: "1 piece" },
  { id: 5, name: "Green Lettuce", cat: "vegetables", price: 9.0, old: null, rating: 4, badge: null, stock: 80, img: "lettuce", unit: "1 piece" },
  { id: 6, name: "Green Capsicum", cat: "vegetables", price: 14.99, old: null, rating: 4, badge: null, stock: 70, img: "capsicum", unit: "500 g" },
  { id: 7, name: "Green Chilli", cat: "vegetables", price: 14.99, old: null, rating: 4, badge: null, stock: 110, img: "green-chilli", unit: "500 g" },
  { id: 8, name: "Eggplant", cat: "vegetables", price: 34.0, old: null, rating: 4, badge: null, stock: 40, img: "eggplant", unit: "1 kg" },
  { id: 9, name: "Fresh Indian Malta", cat: "fruits", price: 20.0, old: null, rating: 4, badge: null, stock: 90, img: "orange", unit: "1 kg" },
  { id: 10, name: "Chinese Cabbage", cat: "vegetables", price: 12.0, old: null, rating: 4, badge: null, stock: 75, img: "cabbage", unit: "1 piece" },
  { id: 11, name: "Fresh Broccoli", cat: "vegetables", price: 12.0, old: null, rating: 5, badge: "new", stock: 60, img: "broccoli", unit: "1 piece" },
  { id: 12, name: "Fresh Red Chili", cat: "vegetables", price: 9.0, old: null, rating: 4, badge: null, stock: 80, img: "chili", unit: "500 g" },
  { id: 13, name: "Fresh Strawberry", cat: "fruits", price: 18.0, old: 22.0, rating: 5, badge: "sale", stock: 40, img: "strawberry", unit: "500 g" },
  { id: 14, name: "Fresh Carrot", cat: "vegetables", price: 6.5, old: null, rating: 4, badge: null, stock: 150, img: "carrot", unit: "1 kg" },
  { id: 15, name: "Sweet Corn", cat: "vegetables", price: 7.0, old: null, rating: 3.5, badge: "new", stock: 0, img: "corn", unit: "2 pieces" },
  { id: 16, name: "Rohu Fish", cat: "meat-fish", price: 15.0, old: 18.0, rating: 4.5, badge: "sale", stock: 35, img: "fish", unit: "1 kg" },
  { id: 17, name: "Fresh Chicken", cat: "meat-fish", price: 13.5, old: null, rating: 4, badge: null, stock: 50, img: "chicken", unit: "1 kg" },
  { id: 18, name: "Orange Juice", cat: "beverages", price: 5.5, old: null, rating: 4, badge: null, stock: 100, img: "juice", unit: "1 litre" },
  { id: 19, name: "Fresh Milk", cat: "beverages", price: 3.8, old: null, rating: 4.5, badge: null, stock: 140, img: "milk", unit: "1 litre" },
  { id: 20, name: "Olive Oil", cat: "cooking", price: 19.0, old: 24.0, rating: 5, badge: "sale", stock: 45, img: "olive-oil", unit: "500 ml" },
  { id: 21, name: "Fresh Eggs", cat: "cooking", price: 4.2, old: null, rating: 4.5, badge: null, stock: 220, img: "eggs", unit: "12 pieces" },
  { id: 22, name: "Chocolate Cookies", cat: "snacks", price: 6.0, old: null, rating: 4, badge: "new", stock: 75, img: "cookies", unit: "300 g" },
  { id: 23, name: "Whole Wheat Bread", cat: "snacks", price: 3.2, old: null, rating: 4, badge: null, stock: 65, img: "bread", unit: "1 loaf" },
  { id: 24, name: "Fresh Banana", cat: "fruits", price: 4.5, old: 6.0, rating: 4.5, badge: "sale", stock: 180, img: "banana", unit: "1 dozen" },
  { id: 25, name: "Fresh Watermelon", cat: "fruits", price: 10.0, old: null, rating: 4, badge: null, stock: 30, img: "watermelon", unit: "1 piece" },
];

const POSTS = [
  { id: 1, title: "Curabitur porttitor orci eget neque accumsan venenatis.", excerpt: "Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.", cat: "Food", day: "23", mon: "Jan", by: "Admin", comments: 65, emoji: "🍊", bg: "linear-gradient(135deg,#1e88e5,#f9a825)" },
  { id: 2, title: "Why seasonal fruits are better for your health", excerpt: "Seasonal fruits taste better, cost less and carry more nutrients. Here is how to pick the best ones.", cat: "Health", day: "23", mon: "Jan", by: "Admin", comments: 42, emoji: "🥭", bg: "linear-gradient(135deg,#ffd54f,#ffb300)" },
  { id: 3, title: "Easy 20 minute dinners using only fresh produce", excerpt: "Busy week? These quick recipes keep dinner healthy, colorful and stress free.", cat: "Recipes", day: "23", mon: "Jan", by: "Admin", comments: 31, emoji: "🥗", bg: "linear-gradient(135deg,#263238,#4a148c)" },
  { id: 4, title: "How we source directly from local farmers", excerpt: "Meet the farmers behind your groceries and learn how we keep every delivery fresh.", cat: "Our Story", day: "18", mon: "Jan", by: "Admin", comments: 18, emoji: "🚜", bg: "linear-gradient(135deg,#66bb6a,#2e7d32)" },
  { id: 5, title: "Organic vs regular: what actually matters?", excerpt: "A simple guide to labels, pesticides and where spending a little extra is truly worth it.", cat: "Health", day: "12", mon: "Jan", by: "Admin", comments: 27, emoji: "🌱", bg: "linear-gradient(135deg,#a5d6a7,#43a047)" },
  { id: 6, title: "Healthy snacks the whole family will love", excerpt: "From crunchy veggie sticks to fruit bowls, snacks that kids and adults both enjoy.", cat: "Recipes", day: "05", mon: "Jan", by: "Admin", comments: 12, emoji: "🍪", bg: "linear-gradient(135deg,#ffab91,#e64a19)" },
];

/* ---------------------- helpers ---------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = (n) => CURRENCY + Number(n).toFixed(2);
const imgPath = (p) => `assets/images/products/${p.img}.svg`;
const getProduct = (id) => PRODUCTS.find((p) => p.id === Number(id));
const catName = (slug) => (CATEGORIES.find((c) => c.slug === slug) || {}).name || slug;
const params = new URLSearchParams(location.search);

const Store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
};
const Cart = {
  items: () => Store.get("eb_cart", []),
  save: (v) => Store.set("eb_cart", v),
};
const Wish = {
  items: () => Store.get("eb_wish", []),
  save: (v) => Store.set("eb_wish", v),
  has: (id) => Wish.items().includes(Number(id)),
};

function stars(r) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (r >= i) html += '<i class="bi bi-star-fill"></i>';
    else if (r >= i - 0.5) html += '<i class="bi bi-star-half"></i>';
    else html += '<i class="bi bi-star-fill off"></i>';
  }
  return `<span class="stars">${html}</span>`;
}

function toast(msg, type = "ok") {
  let wrap = $(".eb-toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "eb-toast-wrap";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = "eb-toast " + (type === "error" ? "error" : "");
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

/* ---------------------- cart logic ---------------------- */
function addToCart(id, qty = 1) {
  const p = getProduct(id);
  if (!p || p.stock <= 0) return toast("Sorry, this item is out of stock", "error");
  const cart = Cart.items();
  const line = cart.find((l) => l.id === p.id);
  if (line) line.qty = Math.min(line.qty + qty, p.stock);
  else cart.push({ id: p.id, qty: Math.min(qty, p.stock) });
  Cart.save(cart);
  refreshBadges();
  toast(`${p.name} added to cart`);
}
function removeFromCart(id) {
  Cart.save(Cart.items().filter((l) => l.id !== Number(id)));
  refreshBadges();
}
function setQty(id, qty) {
  const p = getProduct(id);
  const cart = Cart.items();
  const line = cart.find((l) => l.id === Number(id));
  if (!line) return;
  line.qty = Math.max(1, Math.min(qty, p.stock));
  Cart.save(cart);
  refreshBadges();
}
function cartTotals() {
  const lines = Cart.items().map((l) => ({ ...l, p: getProduct(l.id) })).filter((l) => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const rate = COUPONS[Store.get("eb_coupon", "")] || 0;
  const discount = subtotal * rate;
  const shipping = subtotal === 0 || subtotal - discount >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  return { lines, subtotal, discount, shipping, total: subtotal - discount + shipping, count: lines.reduce((s, l) => s + l.qty, 0) };
}
function toggleWish(id) {
  let list = Wish.items();
  const n = Number(id);
  if (list.includes(n)) { list = list.filter((x) => x !== n); toast("Removed from wishlist"); }
  else { list.push(n); toast("Added to wishlist"); }
  Wish.save(list);
  refreshBadges();
  $$(`[data-wish="${n}"]`).forEach((b) => {
    b.classList.toggle("wished", Wish.has(n));
    const i = $("i", b);
    if (i) i.className = Wish.has(n) ? "bi bi-heart-fill" : "bi bi-heart";
  });
}
function refreshBadges() {
  const t = cartTotals();
  $$(".cart-count").forEach((e) => (e.textContent = t.count));
  $$(".cart-total").forEach((e) => (e.textContent = money(t.subtotal)));
  $$(".wish-count").forEach((e) => (e.textContent = Wish.items().length));
}

/* ---------------------- product card ---------------------- */
function productCard(p) {
  const out = p.stock <= 0;
  const badge = out ? '<span class="badge-tag badge-out">Out of stock</span>'
    : p.badge === "sale" ? `<span class="badge-tag badge-sale">Sale ${Math.round((1 - p.price / p.old) * 100)}%</span>`
    : p.badge === "new" ? '<span class="badge-tag badge-new">New</span>' : "";
  const wished = Wish.has(p.id);
  return `
  <div class="p-card">
    ${badge}
    <div class="quick">
      <button type="button" data-wish="${p.id}" class="${wished ? "wished" : ""}" aria-label="Wishlist"><i class="bi ${wished ? "bi-heart-fill" : "bi-heart"}"></i></button>
      <a href="product-details.html?id=${p.id}" aria-label="View"><i class="bi bi-eye"></i></a>
    </div>
    <a class="thumb" href="product-details.html?id=${p.id}"><img src="${imgPath(p)}" alt="${p.name}" loading="lazy"></a>
    <div class="p-body">
      <div>
        <a class="p-name" href="product-details.html?id=${p.id}">${p.name}</a>
        <div class="price">${money(p.price)}${p.old ? `<span class="old">${money(p.old)}</span>` : ""}</div>
        ${stars(p.rating)}
      </div>
      <button class="add-btn" type="button" data-add="${p.id}" ${out ? "disabled" : ""} aria-label="Add to cart"><i class="bi bi-bag-plus"></i></button>
    </div>
  </div>`;
}
function renderProducts(target, list, colClass = "col-6 col-md-4 col-lg-3") {
  const el = typeof target === "string" ? $(target) : target;
  if (!el) return;
  el.innerHTML = list.map((p) => `<div class="${colClass}">${productCard(p)}</div>`).join("");
}

function renderGrid(target, list) {
  const el = typeof target === "string" ? $(target) : target;
  if (el) el.innerHTML = list.map(productCard).join("");
}

/* ---------------------- global click handlers ---------------------- */
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) { addToCart(add.dataset.add, 1); return; }
  const wish = e.target.closest("[data-wish]");
  if (wish) { toggleWish(wish.dataset.wish); onWishChange(); }
});
function onWishChange() {
  if (document.body.dataset.page === "wishlist") initWishlist();
}

/* ---------------------- page: home ---------------------- */
function initHome() {
  // Product tabs (All / Vegetable / Fruit / Meat & Fish)
  const tabs = $$("#prodTabs [data-tab]");
  const draw = (tab) => {
    const list = tab === "all" ? PRODUCTS.slice(0, 8) : PRODUCTS.filter((p) => p.cat === tab).slice(0, 8);
    $("#popularGrid").innerHTML = list.map(productCard).join("");
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
  };
  tabs.forEach((t) => t.addEventListener("click", () => draw(t.dataset.tab)));
  draw("all");

  $("#featGrid").innerHTML = [1, 9, 10, 5, 8].map(getProduct).map(productCard).join("");
  $("#blogGrid").innerHTML = POSTS.slice(0, 3).map(blogCard).join("");

  // Deal countdown (resets 3 days after the first visit / when it ends)
  let end = Store.get("eb_deal_end", 0);
  if (!end || end < Date.now()) { end = Date.now() + 3 * 24 * 3600 * 1000; Store.set("eb_deal_end", end); }
  const tick = () => {
    let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400;
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60); s -= m * 60;
    [["cdD", d], ["cdH", h], ["cdM", m], ["cdS", s]].forEach(([id, v]) => { const el = $("#" + id); if (el) el.textContent = String(v).padStart(2, "0"); });
  };
  tick(); setInterval(tick, 1000);
}
function blogCard(b) {
  const [d0, m0] = (b.date || "").split(" ");
  const day = b.day || d0 || "", mon = b.mon || m0 || "";
  const excerpt = b.excerpt || "Fresh ideas, tips and stories from the Ecobazar kitchen and farm.";
  return `
  <div class="col-md-6 col-lg-4">
    <article class="news-card">
      <div class="pic" style="background:${b.bg}">${b.emoji}<div class="date">${day}<small>${mon}</small></div></div>
      <h5><a href="blog.html">${b.title}</a></h5>
      <p>${excerpt}</p>
      <a class="read" href="blog.html">Read More <i class="bi bi-arrow-right"></i></a>
    </article>
  </div>`;
}

/* ---------------------- page: shop ---------------------- */
const shopState = { cats: [], max: 50, minRating: 0, q: "", sort: "default", page: 1, perPage: 9 };
function initShop() {
  const urlCat = params.get("cat");
  if (urlCat) shopState.cats = [urlCat];
  shopState.q = params.get("q") || "";
  if ($("#shopSearch")) $("#shopSearch").value = shopState.q;

  $("#catFilters").innerHTML = CATEGORIES.map((c) => {
    const n = PRODUCTS.filter((p) => p.cat === c.slug).length;
    return `<div class="form-check"><input class="form-check-input" type="checkbox" id="cf-${c.slug}" value="${c.slug}" ${shopState.cats.includes(c.slug) ? "checked" : ""}>
      <label class="form-check-label" for="cf-${c.slug}"><span>${c.name}</span><small>(${n})</small></label></div>`;
  }).join("");

  $$("#catFilters input").forEach((i) => i.addEventListener("change", () => {
    shopState.cats = $$("#catFilters input:checked").map((x) => x.value);
    shopState.page = 1; renderShop();
  }));
  $("#priceRange").addEventListener("input", (e) => {
    shopState.max = Number(e.target.value); $("#priceLabel").textContent = money(shopState.max);
    shopState.page = 1; renderShop();
  });
  $$("input[name=rating]").forEach((r) => r.addEventListener("change", () => {
    shopState.minRating = Number(r.value); shopState.page = 1; renderShop();
  }));
  $("#sortBy").addEventListener("change", (e) => { shopState.sort = e.target.value; renderShop(); });
  $("#shopSearchForm").addEventListener("submit", (e) => {
    e.preventDefault(); shopState.q = $("#shopSearch").value.trim(); shopState.page = 1; renderShop();
  });
  $("#clearFilters").addEventListener("click", () => {
    shopState.cats = []; shopState.max = 50; shopState.minRating = 0; shopState.q = ""; shopState.page = 1;
    $$("#catFilters input").forEach((i) => (i.checked = false));
    $("#priceRange").value = 50; $("#priceLabel").textContent = money(50);
    $("#rating-all").checked = true; $("#shopSearch").value = "";
    renderShop();
  });
  $("#priceRange").value = shopState.max; $("#priceLabel").textContent = money(shopState.max);
  renderShop();
}
function renderShop() {
  let list = PRODUCTS.filter((p) =>
    (!shopState.cats.length || shopState.cats.includes(p.cat)) &&
    p.price <= shopState.max && p.rating >= shopState.minRating &&
    (!shopState.q || p.name.toLowerCase().includes(shopState.q.toLowerCase())));
  const sorters = {
    "price-asc": (a, b) => a.price - b.price, "price-desc": (a, b) => b.price - a.price,
    "rating": (a, b) => b.rating - a.rating, "name": (a, b) => a.name.localeCompare(b.name),
  };
  if (sorters[shopState.sort]) list.sort(sorters[shopState.sort]);

  const pages = Math.max(1, Math.ceil(list.length / shopState.perPage));
  shopState.page = Math.min(shopState.page, pages);
  const slice = list.slice((shopState.page - 1) * shopState.perPage, shopState.page * shopState.perPage);
  $("#resultCount").innerHTML = `<strong>${list.length}</strong> product${list.length === 1 ? "" : "s"} found`;

  if (!list.length) {
    $("#shopGrid").innerHTML = '<div class="col-12"><div class="empty-state"><i class="bi bi-search"></i><h5>No products found</h5><p>Try changing the filters or search keyword.</p></div></div>';
  } else renderProducts("#shopGrid", slice, "col-6 col-md-4");

  let pg = "";
  if (pages > 1) {
    pg += `<li class="page-item ${shopState.page === 1 ? "disabled" : ""}"><a class="page-link" href="#" data-pg="${shopState.page - 1}"><i class="bi bi-chevron-left"></i></a></li>`;
    for (let i = 1; i <= pages; i++) pg += `<li class="page-item ${i === shopState.page ? "active" : ""}"><a class="page-link" href="#" data-pg="${i}">${i}</a></li>`;
    pg += `<li class="page-item ${shopState.page === pages ? "disabled" : ""}"><a class="page-link" href="#" data-pg="${shopState.page + 1}"><i class="bi bi-chevron-right"></i></a></li>`;
  }
  $("#pagination").innerHTML = pg;
  $$("#pagination [data-pg]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault(); shopState.page = Number(a.dataset.pg); renderShop(); window.scrollTo({ top: 200, behavior: "smooth" });
  }));
}

/* ---------------------- page: product details ---------------------- */
function initProduct() {
  const p = getProduct(params.get("id")) || PRODUCTS[0];
  document.title = `${p.name} - Ecobazar`;
  $("#pdCrumb").textContent = p.name;
  $("#pdTitle").textContent = p.name;
  $("#pdCat").textContent = catName(p.cat);
  $("#pdUnit").textContent = p.unit;
  $("#pdSku").textContent = "EB-" + String(p.id).padStart(4, "0");
  $("#pdRating").innerHTML = stars(p.rating) + ` <small class="text-muted ms-1">(${Math.round(p.rating * 18)} reviews)</small>`;
  $("#pdPrice").innerHTML = `${money(p.price)}${p.old ? `<span class="old">${money(p.old)}</span>` : ""}`;
  const stock = $("#pdStock");
  stock.textContent = p.stock > 0 ? "In Stock" : "Out of Stock";
  stock.classList.toggle("out", p.stock <= 0);
  $$(".pd-img").forEach((img) => { img.src = imgPath(p); img.alt = p.name; });
  $("#pdDesc").textContent = `Our ${p.name.toLowerCase()} is carefully selected from trusted local farms and delivered fresh to your door. Packed with natural goodness, it is perfect for everyday cooking and healthy eating. Store in a cool, dry place and enjoy at its best within a few days of delivery.`;

  const qty = $("#pdQty");
  $("#qtyMinus").onclick = () => (qty.value = Math.max(1, Number(qty.value) - 1));
  $("#qtyPlus").onclick = () => (qty.value = Math.min(p.stock || 1, Number(qty.value) + 1));
  $("#pdAdd").onclick = () => addToCart(p.id, Number(qty.value) || 1);
  $("#pdAdd").disabled = p.stock <= 0;
  const wb = $("#pdWish");
  wb.dataset.wish = p.id;
  if (Wish.has(p.id)) { wb.classList.add("wished"); $("i", wb).className = "bi bi-heart-fill"; }

  renderProducts("#relatedGrid", PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).concat(PRODUCTS.filter((x) => x.cat !== p.cat)).slice(0, 4));

  // Review form (demo)
  const rf = $("#reviewForm");
  if (rf) rf.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(rf)) return;
    toast("Thanks! Your review has been submitted.");
    rf.reset(); rf.classList.remove("was-validated");
  });
}

/* ---------------------- page: cart ---------------------- */
function initCart() {
  const render = () => {
    const t = cartTotals();
    const body = $("#cartBody");
    if (!t.lines.length) {
      $("#cartWrap").innerHTML = '<div class="empty-state"><i class="bi bi-bag-x"></i><h4>Your cart is empty</h4><p>Looks like you have not added anything yet.</p><a href="shop.html" class="btn-eb">Start Shopping</a></div>';
      return;
    }
    body.innerHTML = t.lines.map((l) => `
      <tr>
        <td><div class="item"><img src="${imgPath(l.p)}" alt=""><div><a href="product-details.html?id=${l.p.id}">${l.p.name}</a><br><small class="text-muted">${l.p.unit}</small></div></div></td>
        <td>${money(l.p.price)}</td>
        <td><div class="qty"><button type="button" data-dec="${l.id}"><i class="bi bi-dash"></i></button><input value="${l.qty}" readonly><button type="button" data-inc="${l.id}"><i class="bi bi-plus"></i></button></div></td>
        <td class="fw-medium">${money(l.p.price * l.qty)}</td>
        <td><button class="remove-btn" data-rm="${l.id}" aria-label="Remove"><i class="bi bi-x"></i></button></td>
      </tr>`).join("");
    $("#sumSub").textContent = money(t.subtotal);
    $("#sumDisc").textContent = "-" + money(t.discount);
    $("#sumShip").textContent = t.shipping ? money(t.shipping) : "Free";
    $("#sumTotal").textContent = money(t.total);
    const code = Store.get("eb_coupon", "");
    $("#couponMsg").textContent = code ? `Coupon ${code} applied` : "";
  };
  $("#cartBody").addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), rm = e.target.closest("[data-rm]");
    const get = (id) => Cart.items().find((l) => l.id === Number(id));
    if (inc) setQty(inc.dataset.inc, get(inc.dataset.inc).qty + 1);
    if (dec) setQty(dec.dataset.dec, get(dec.dataset.dec).qty - 1);
    if (rm) { removeFromCart(rm.dataset.rm); toast("Item removed"); }
    render();
  });
  $("#couponForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = $("#couponInput").value.trim().toUpperCase();
    if (COUPONS[code]) { Store.set("eb_coupon", code); toast("Coupon applied!"); }
    else toast("Invalid coupon code", "error");
    render();
  });
  $("#clearCart").addEventListener("click", () => { Cart.save([]); refreshBadges(); render(); });
  render();
}

/* ---------------------- page: checkout ---------------------- */
function initCheckout() {
  const t = cartTotals();
  if (!t.lines.length) {
    $("#checkoutWrap").innerHTML = '<div class="empty-state"><i class="bi bi-bag-x"></i><h4>Nothing to checkout</h4><p>Add some products to your cart first.</p><a href="shop.html" class="btn-eb">Go to Shop</a></div>';
    return;
  }
  $("#orderItems").innerHTML = t.lines.map((l) => `
    <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
      <div class="d-flex align-items-center gap-2"><img src="${imgPath(l.p)}" width="44" height="44" alt="" class="bg-light rounded p-1"><span>${l.p.name} <small class="text-muted">x${l.qty}</small></span></div>
      <strong>${money(l.p.price * l.qty)}</strong>
    </div>`).join("");
  $("#coSub").textContent = money(t.subtotal);
  $("#coDisc").textContent = "-" + money(t.discount);
  $("#coShip").textContent = t.shipping ? money(t.shipping) : "Free";
  $("#coTotal").textContent = money(t.total);

  const form = $("#checkoutForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form)) return toast("Please fill in all required fields", "error");
    const data = Object.fromEntries(new FormData(form).entries());
    const order = { id: "EB" + Date.now().toString().slice(-8), date: new Date().toISOString(), customer: data, items: t.lines.map((l) => ({ id: l.id, name: l.p.name, qty: l.qty, price: l.p.price })), totals: { subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, total: t.total } };
    // BACKEND: replace with fetch('/api/orders', { method: 'POST', body: JSON.stringify(order) })
    const orders = Store.get("eb_orders", []); orders.push(order); Store.set("eb_orders", orders);
    Cart.save([]); localStorage.removeItem("eb_coupon"); refreshBadges();
    $("#orderNo").textContent = order.id;
    new bootstrap.Modal($("#successModal")).show();
  });
}

/* ---------------------- page: wishlist ---------------------- */
function initWishlist() {
  const items = Wish.items().map(getProduct).filter(Boolean);
  const body = $("#wishBody");
  if (!items.length) {
    $("#wishWrap").innerHTML = '<div class="empty-state"><i class="bi bi-heart"></i><h4>Your wishlist is empty</h4><p>Save items you love and find them here later.</p><a href="shop.html" class="btn-eb">Browse Products</a></div>';
    return;
  }
  body.innerHTML = items.map((p) => `
    <tr>
      <td><div class="item"><img src="${imgPath(p)}" alt=""><a href="product-details.html?id=${p.id}">${p.name}</a></div></td>
      <td>${money(p.price)}${p.old ? ` <small class="text-muted text-decoration-line-through">${money(p.old)}</small>` : ""}</td>
      <td><span class="stock-pill ${p.stock > 0 ? "" : "out"}">${p.stock > 0 ? "In Stock" : "Out of Stock"}</span></td>
      <td><button class="btn-eb btn-eb-sm" data-add="${p.id}" ${p.stock > 0 ? "" : "disabled"}>Add to Cart</button></td>
      <td><button class="remove-btn" data-wish="${p.id}" aria-label="Remove"><i class="bi bi-x"></i></button></td>
    </tr>`).join("");
}

/* ---------------------- page: blog ---------------------- */
function initBlog() { $("#blogList").innerHTML = POSTS.map(blogCard).join(""); }

/* ---------------------- forms ---------------------- */
function validateForm(form) {
  form.classList.add("was-validated");
  const pw = $("input[name=password]", form), cpw = $("input[name=confirm_password]", form);
  if (pw && cpw) cpw.setCustomValidity(pw.value !== cpw.value ? "Passwords do not match" : "");
  return form.checkValidity();
}
function initAuth() {
  const login = $("#loginForm"), reg = $("#registerForm");
  if (login) login.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(login)) return;
    // BACKEND: POST /api/auth/login
    toast("Login form is valid. Connect it to your backend API.");
  });
  if (reg) reg.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(reg)) return;
    // BACKEND: POST /api/auth/register
    toast("Registration form is valid. Connect it to your backend API.");
  });
  $$(".pw-wrap .toggle").forEach((b) => b.addEventListener("click", () => {
    const input = $("input", b.parentElement);
    input.type = input.type === "password" ? "text" : "password";
    $("i", b).className = input.type === "password" ? "bi bi-eye" : "bi bi-eye-slash";
  }));
}
function initContact() {
  const f = $("#contactForm");
  if (!f) return;
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(f)) return;
    // BACKEND: POST /api/contact
    toast("Message sent! We will get back to you soon.");
    f.reset(); f.classList.remove("was-validated");
  });
}

/* ---------------------- global init ---------------------- */
document.addEventListener("DOMContentLoaded", () => {
  refreshBadges();

  // header search -> shop page
  $$(".js-header-search").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = $("input", f).value.trim();
    location.href = "shop.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  }));

  // newsletter
  $$(".js-newsletter").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("input", f);
    if (!input.checkValidity() || !input.value) return toast("Please enter a valid email", "error");
    toast("Thanks for subscribing!"); f.reset();
  }));

  // back to top
  const top = $(".back-top");
  if (top) {
    window.addEventListener("scroll", () => top.classList.toggle("show", window.scrollY > 400));
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  const page = document.body.dataset.page;
  const pages = { home: initHome, shop: initShop, product: initProduct, cart: initCart, checkout: initCheckout, wishlist: initWishlist, blog: initBlog, login: initAuth, register: initAuth, contact: initContact };
  if (pages[page]) pages[page]();
});
