(function () {
  "use strict";

  var SHOP = window.SHOP, PRODUCTS = window.PRODUCTS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var money = function (n) { return "₹" + Math.round(n).toLocaleString("en-IN"); };
  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  function gramsLabel(g) {
    return g >= 1000 ? (g / 1000).toString().replace(/\.0+$/, "") + " kg" : g + " g";
  }
  // price helpers (g = grams)
  function sale(p, g) { return Math.round((p.mrp - p.off) * g / 1000); }
  function orig(p, g) { return Math.round(p.mrp * g / 1000); }

  /* ---------- product cards ---------- */
  var grid = $("#productGrid");
  var DEFAULT_PACK = 500;

  function cardHTML(p) {
    var packs = SHOP.packs.map(function (g) {
      return '<label><input type="radio" name="pk-' + p.id + '" value="' + g + '"' +
        (g === DEFAULT_PACK ? " checked" : "") + '><span>' + gramsLabel(g) + "</span></label>";
    }).join("");
    return '<article class="card" data-id="' + p.id + '" data-cat="' + p.cat + '">' +
      '<div class="card-img"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy" width="400" height="400">' +
      '<span class="badge">₹' + p.off + " off/kg</span></div>" +
      '<div class="card-body">' +
      "<h3>" + p.name + '<span class="hindi">' + p.hindi + "</span></h3>" +
      '<p class="note">' + p.note + "</p>" +
      '<div class="packs" role="radiogroup" aria-label="Pack size for ' + p.name + '">' + packs + "</div>" +
      '<div class="price"><span class="now"></span><span class="was"></span>' +
      '<span class="save"></span><span class="perkg"></span></div>' +
      '<div class="card-actions">' +
      '<button class="btn btn-add" data-act="add">Add to cart</button>' +
      '<button class="btn btn-direct" data-act="direct" aria-label="Order ' + p.name + ' on WhatsApp">WhatsApp</button>' +
      "</div></div></article>";
  }

  function selectedGrams(card) {
    return parseInt($('input[type="radio"]:checked', card).value, 10);
  }

  function refreshCard(card) {
    var p = byId[card.dataset.id], g = selectedGrams(card);
    $(".now", card).textContent = money(sale(p, g));
    $(".was", card).textContent = money(orig(p, g));
    $(".save", card).textContent = "You save " + money(orig(p, g) - sale(p, g));
    $(".perkg", card).textContent = money(p.mrp - p.off) + " per kg";
  }

  grid.innerHTML = PRODUCTS.map(cardHTML).join("");
  Array.prototype.forEach.call(grid.children, refreshCard);

  grid.addEventListener("change", function (e) {
    var card = e.target.closest(".card");
    if (card) refreshCard(card);
  });

  grid.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-act]");
    if (!btn) return;
    var card = btn.closest(".card"), p = byId[card.dataset.id], g = selectedGrams(card);
    if (btn.dataset.act === "add") {
      addToCart(p.id, g, 1);
      toast(p.name + " (" + gramsLabel(g) + ") added to cart");
    } else {
      var msg = "Hello Apna Dry Fruits, I want to order:\n\n" +
        p.name + " - " + gramsLabel(g) + " = " + money(sale(p, g)) +
        " (original " + money(orig(p, g)) + ")\n\nPlease confirm the total and delivery.";
      openWa(msg);
    }
  });

  /* ---------- category chips ---------- */
  $("#chips").addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    Array.prototype.forEach.call(this.children, function (c) {
      var on = c === chip;
      c.classList.toggle("active", on);
      c.setAttribute("aria-selected", on);
    });
    var cat = chip.dataset.cat;
    Array.prototype.forEach.call(grid.children, function (card) {
      card.hidden = !(cat === "all" || card.dataset.cat === cat);
    });
  });

  /* ---------- price list table ---------- */
  $("#priceRows").innerHTML = PRODUCTS.map(function (p) {
    return "<tr><td><strong>" + p.name + "</strong></td><td>" + p.hindi + "</td>" +
      '<td class="num"><s>' + money(p.mrp) + '</s></td>' +
      '<td class="num sv">- ' + money(p.off) + "</td>" +
      '<td class="num yours">' + money(p.mrp - p.off) + "</td></tr>";
  }).join("");

  /* ---------- cart ---------- */
  var cart = [];
  var KEY = "apna-dry-fruits-cart";
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (err) { cart = []; }
  cart = cart.filter(function (i) { return byId[i.id] && i.g > 0 && i.q > 0; });

  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (err) { /* ignore */ } }

  function addToCart(id, g, q) {
    var found = cart.filter(function (i) { return i.id === id && i.g === g; })[0];
    if (found) found.q += q; else cart.push({ id: id, g: g, q: q });
    renderCart();
  }

  function totals() {
    var t = 0, o = 0, n = 0;
    cart.forEach(function (i) {
      var p = byId[i.id];
      t += sale(p, i.g) * i.q; o += orig(p, i.g) * i.q; n += i.q;
    });
    return { total: t, orig: o, save: o - t, count: n };
  }

  function renderCart() {
    var body = $("#cartBody"), foot = $("#cartFoot");
    if (!cart.length) {
      body.innerHTML = '<p class="empty">Your cart is empty.<br>Add something from the shop.</p>';
      foot.hidden = true;
    } else {
      foot.hidden = false;
      body.innerHTML = cart.map(function (i, idx) {
        var p = byId[i.id];
        return '<div class="line-item"><img src="' + p.img + '" alt="">' +
          "<div><h4>" + p.name + '</h4><div class="sub">' + gramsLabel(i.g) + " pack</div>" +
          '<div class="qty"><button data-q="-1" data-i="' + idx + '" aria-label="Decrease">&minus;</button>' +
          "<span>" + i.q + '</span><button data-q="1" data-i="' + idx + '" aria-label="Increase">+</button></div>' +
          '<div><button class="rm" data-rm="' + idx + '">Remove</button></div></div>' +
          '<div class="amt">' + money(sale(p, i.g) * i.q) + "<s>" + money(orig(p, i.g) * i.q) + "</s></div></div>";
      }).join("");
    }
    var t = totals();
    $("#sOrig").textContent = money(t.orig);
    $("#sSave").textContent = money(t.save);
    $("#sTotal").textContent = money(t.total);
    $("#cartCount").textContent = t.count;
    save();
  }

  $("#cartBody").addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]"), rm = e.target.closest("[data-rm]");
    if (q) {
      var it = cart[+q.dataset.i];
      it.q += +q.dataset.q;
      if (it.q < 1) cart.splice(+q.dataset.i, 1);
      renderCart();
    } else if (rm) {
      cart.splice(+rm.dataset.rm, 1);
      renderCart();
    }
  });

  /* drawer open/close */
  var drawer = $("#drawer"), overlay = $("#overlay"), lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    $("#closeCart").focus();
  }
  function closeCart() {
    overlay.hidden = true;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if (lastFocus) lastFocus.focus();
  }
  $("#openCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeCart();
  });

  /* ---------- WhatsApp ---------- */
  function openWa(text) {
    var url = "https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent(text);
    var w = window.open(url, "_blank");
    if (!w) window.location.href = url;
  }

  $("#sendWa").addEventListener("click", function () {
    var name = $("#cName").value.trim(), addr = $("#cAddr").value.trim(), err = $("#cErr");
    if (!cart.length) { err.textContent = "Your cart is empty."; return; }
    if (!name || !addr) { err.textContent = "Please enter your name and delivery address."; return; }
    err.textContent = "";
    var t = totals();
    var lines = cart.map(function (i, n) {
      var p = byId[i.id];
      return (n + 1) + ". " + p.name + " - " + gramsLabel(i.g) + " x " + i.q + " = " + money(sale(p, i.g) * i.q);
    });
    var msg = "Hello Apna Dry Fruits, I want to place an order:\n\n" + lines.join("\n") +
      "\n\nOriginal total: " + money(t.orig) +
      "\nYou save: " + money(t.save) +
      "\nTotal to pay: " + money(t.total) +
      "\n\nName: " + name + "\nAddress: " + addr +
      "\n\nPlease confirm payment and delivery.";
    openWa(msg);
  });

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(text) {
    var el = $("#toast");
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  /* ---------- monthly budget ---------- */
  // grams per person per month (about 30 g a day in total)
  var MIX = [
    { id: "badam", g: 250 }, { id: "kaju", g: 150 }, { id: "akhrot", g: 150 },
    { id: "kishmish", g: 100 }, { id: "anjeer", g: 100 }, { id: "makhana", g: 100 },
    { id: "pista", g: 50 }
  ];
  var fam = $("#fam");

  function renderBudget() {
    var n = +fam.value, total = 0, o = 0;
    $("#famOut").textContent = n;
    var rows = MIX.map(function (m) {
      var p = byId[m.id], g = m.g * n, c = sale(p, g);
      total += c; o += orig(p, g);
      return "<tr><td>" + p.name + '</td><td class="num">' + gramsLabel(g) + '</td><td class="num">' + money(c) + "</td></tr>";
    }).join("");
    $("#budgetRows").innerHTML = rows +
      '<tr class="foot"><td><strong>Total</strong></td><td class="num">' + gramsLabel(n * 900) +
      '</td><td class="num"><strong>' + money(total) + "</strong></td></tr>";
    $("#bTotal").textContent = money(total);
    $("#bOrig").textContent = money(o);
    $("#bSave").textContent = money(o - total);
  }
  fam.addEventListener("input", renderBudget);

  $("#addBudget").addEventListener("click", function () {
    var n = +fam.value;
    MIX.forEach(function (m) { addToCart(m.id, m.g * n, 1); });
    toast("Monthly pack for " + n + " added to cart");
    openCart();
  });

  /* ---------- init ---------- */
  $("#yr").textContent = new Date().getFullYear();
  renderBudget();
  renderCart();
})();
