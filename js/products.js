/* ============================================================
   APNA DRY FRUITS - settings and price list
   Edit this file to change prices, discounts or the WhatsApp number.
   mrp  = original price per kg (shown with a dash through it)
   off  = discount per kg   (150 for badam & kaju, 100 for the rest)
   Your price per kg = mrp - off
   ============================================================ */

window.SHOP = {
  name: "Apna Dry Fruits",
  whatsapp: "919640032945",          // country code + number, no + or spaces
  displayPhone: "+91 96400 32945",
  packs: [250, 500, 1000]            // pack sizes in grams
};

window.PRODUCTS = [
  { id: "badam",  cat: "nuts", name: "Badam (Almonds)", hindi: "बादाम", mrp: 1100, off: 150,
    img: "assets/products/badam.svg", note: "Crunchy almonds for soaking, snacking and sweets." },
  { id: "kaju",   cat: "nuts", name: "Kaju (Cashews)", hindi: "काजू", mrp: 1300, off: 150,
    img: "assets/products/kaju.svg", note: "Whole, creamy cashews for curries, kheer and gifting." },
  { id: "pista",  cat: "nuts", name: "Pista (Pistachios)", hindi: "पिस्ता", mrp: 1900, off: 100,
    img: "assets/products/pista.svg", note: "Crunchy pistachios with a rich, nutty taste." },
  { id: "akhrot", cat: "nuts", name: "Akhrot (Walnuts)", hindi: "अखरोट", mrp: 1000, off: 100,
    img: "assets/products/akhrot.svg", note: "Light walnut halves, good with breakfast and salads." },

  { id: "kishmish", cat: "dryfruits", name: "Kishmish (Raisins)", hindi: "किशमिश", mrp: 650, off: 100,
    img: "assets/products/kishmish.svg", note: "Sweet golden raisins for mithai, pulao and daily snacking." },
  { id: "anjeer", cat: "dryfruits", name: "Anjeer (Figs)", hindi: "अंजीर", mrp: 1500, off: 100,
    img: "assets/products/anjeer.svg", note: "Soft, chewy dried figs, naturally sweet." },
  { id: "khajur-medjool", cat: "dryfruits", name: "Khajur Medjool (Dates)", hindi: "खजूर मेडजूल", mrp: 1200, off: 100,
    img: "assets/products/khajur-medjool.svg", note: "Large, caramel-like dates. Treat yourself." },

  { id: "chia", cat: "seeds", name: "Chia Seeds", hindi: "चिया बीज", mrp: 550, off: 100,
    img: "assets/products/chia.svg", note: "Add to water, smoothies or overnight oats." },
  { id: "flax", cat: "seeds", name: "Flax Seeds (Alsi)", hindi: "अलसी", mrp: 300, off: 100,
    img: "assets/products/flax.svg", note: "Roast and grind, or sprinkle on curd and salads." },
  { id: "pumpkin", cat: "seeds", name: "Pumpkin Seeds", hindi: "कद्दू के बीज", mrp: 800, off: 100,
    img: "assets/products/pumpkin.svg", note: "Green, crunchy seeds. Good for trail mixes." },

  { id: "mixed", cat: "combos", name: "Mixed Dry Fruits", hindi: "मेवा मिक्स", mrp: 950, off: 100,
    img: "assets/products/mixed.svg", note: "Nuts, seeds and dried fruits mixed in one pack." }
];
