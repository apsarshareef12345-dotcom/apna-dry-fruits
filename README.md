# Apna Dry Fruits - website

A fast, static shop website. No build step, no server needed.

- Customers pick a pack size, add to cart, and press **Send order on WhatsApp**.
- The order message (items, quantity, original total, savings, total, name, address) opens in WhatsApp addressed to **+91 96400 32945**.
- Original prices are shown with a dash through them. Discount: **Rs 150/kg on Badam and Kaju, Rs 100/kg on everything else**.

## Put it on GitHub (free hosting with GitHub Pages)

1. Create a new repository on GitHub, for example `apna-dry-fruits`.
2. Upload all the files from this folder (index.html, css, js, assets, favicon.svg, .nojekyll).
3. In the repository go to **Settings > Pages**.
4. Under "Build and deployment", choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save.
5. After a minute your site is live at `https://YOUR-USERNAME.github.io/apna-dry-fruits/`.

## Change prices, discounts or the WhatsApp number

Open `js/products.js`:

- `whatsapp` - number with country code, no + or spaces (currently 919640032945).
- `mrp` - original price per kg (shown with a dash through it).
- `off` - discount per kg. Your price per kg = mrp - off.

The WhatsApp links in `index.html` (hero, bottom banner, footer, floating button) also contain the number. Search for `919640032945` and replace it if you ever change numbers.

## Change images

Product pictures are illustrations in `assets/products/` (SVG). To use real photos, add a JPG or WebP file there and change the `img` path in `js/products.js`.

## Notes

- Fonts (Bricolage Grotesque and Figtree) load from Google Fonts. If offline, the site falls back to system fonts.
- The prices in `products.js` are sample values. Please set your real prices before going live.
