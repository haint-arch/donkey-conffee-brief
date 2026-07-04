/* Donkey Coffee Roastery — lightweight i18n (EN default / VI) */
(function () {
  "use strict";

  var LANGS = ["en", "vi"];
  var DEFAULT_LANG = "en";
  var STORE_KEY = "donkeyLang";

  function getLang() {
    var l = null;
    try { l = localStorage.getItem(STORE_KEY); } catch (e) {}
    return LANGS.indexOf(l) >= 0 ? l : DEFAULT_LANG;
  }

  var DICT = {
    en: {
      /* ---- document titles / meta ---- */
      "title.home": "Donkey Coffee Roastery — Specialty coffee for those on the move",
      "desc.home": "Donkey Coffee Roastery — a small specialty coffee roastery by the Red River, Hanoi. Small-batch, honest, for nature lovers.",
      "title.collection": "Specialty coffee — Donkey Coffee Roastery",
      "desc.collection": "A collection of small-batch specialty coffee from Donkey Coffee Roastery.",
      "title.product": "Product — Donkey Coffee Roastery",
      "desc.product": "Single-origin specialty coffee from Donkey Coffee Roastery.",
      "title.notes": "Field Notes — Donkey Coffee Roastery",
      "desc.notes": "Origin stories, brewing know-how and life around the cup at Donkey Coffee Roastery.",
      "title.note": "Field Notes — Donkey Coffee Roastery",
      "desc.note": "A Field Notes article from Donkey Coffee Roastery.",
      "title.about": "Story — Donkey Coffee Roastery",
      "desc.about": "Donkey Coffee Roastery — a roastery in the city, raw and honest. Our story, space and people.",

      /* ---- header / nav ---- */
      "nav.coffee": "Coffee",
      "nav.story": "Story",
      "nav.notes": "Field Notes",
      "nav.search": "Search",
      "nav.cart": "Cart",
      "nav.openMenu": "Open menu",
      "nav.closeMenu": "Close menu",

      /* ---- homepage ---- */
      "home.carouselAria": "Donkey space photos",
      "home.navAria": "Main navigation",
      "home.footerAria": "Footer links",
      "home.shop": "Shop",
      "home.story": "Story",
      "home.event": "Event",
      "home.more": "More",
      "home.sub.beans": "Donkey Beans",
      "home.sub.selection": "Donkey Selection",
      "home.sub.kombucha": "Kombucha",
      "home.sub.merch": "Merch",
      "home.sub.aboutDonkey": "About Donkey",
      "home.sub.journey": "Our Journey",
      "home.sub.notes": "Field Notes",
      "home.sub.cupping": "Cupping & Workshop",
      "home.sub.camping": "River Camping",
      "home.sub.popup": "Pop-up Market",
      "home.sub.visit": "Visit Us",
      "home.sub.wholesale": "Wholesale",
      "home.sub.contact": "Contact",
      "homeFooter.desc": "A small specialty coffee roastery by the Red River, Hanoi. Roasted in small batches — for the road.",
      "homeFooter.shop": "Shop",
      "homeFooter.story": "Story",
      "homeFooter.notes": "Field Notes",
      "homeFooter.visit": "Visit",

      /* ---- collection ---- */
      "common.home": "Home",
      "col.crumb": "Specialty coffee",
      "col.eyebrow": "Collection",
      "col.h1": "Specialty coffee",
      "col.lead": "Single origins from three continents, roasted in small batches. Each lot tells a story of its land and the people behind the bean.",
      "col.all": "All",
      "col.sortFeatured": "Featured",
      "col.sortPriceAsc": "Price: low to high",
      "col.sortPriceDesc": "Price: high to low",
      "col.sortAria": "Sort",
      "col.empty": "No products match this filter.",
      "country.vietnam": "Vietnam",

      /* ---- product page (static) ---- */
      "prod.crumbProduct": "Product",
      "prod.brewEyebrow": "Brewing",
      "prod.brewTitle": "Extract the single origin right",
      "prod.brew1Title": "Pour-over / V60",
      "prod.brew1Body": "15g coffee : 250ml water at 92–94°C, poured in 3 stages over 2:30 — brings out florals & fruit.",
      "prod.brew2Title": "Espresso",
      "prod.brew2Body": "18g in : 40g out in 28–32s. Deep sweet finish, round body.",
      "prod.brew3Title": "Aeropress",
      "prod.brew3Body": "14g : 200ml, steep 1:30 then press slowly — light and travel-friendly.",
      "prod.relatedEyebrow": "You may like",
      "prod.relatedTitle": "From the collection",
      "prod.viewAll": "View all →",

      /* ---- product detail (dynamic) ---- */
      "prod.specProducer": "Producer",
      "prod.specVarietal": "Varietal",
      "prod.specProcess": "Process",
      "prod.specRegion": "Region",
      "prod.specAltitude": "Altitude",
      "prod.specYear": "Crop year",
      "prod.weight": "Weight",
      "prod.weightAria": "Choose weight",
      "prod.form": "Form",
      "prod.grindWhole": "Whole bean",
      "prod.grindPourover": "Pour-over grind",
      "prod.grindEspresso": "Espresso grind",
      "prod.grindPhin": "Phin grind",
      "prod.grindWholeHint": "Keep whole beans and grind right before brewing — freshest aroma. Requires a grinder at home.",
      "prod.grindPouroverHint": "Medium grind (like coarse sugar) for V60/Kalita drippers — hand brew, clean and aromatic cup.",
      "prod.grindEspressoHint": "Fine grind for espresso machines — fast extraction under pressure, intense and concentrated.",
      "prod.grindPhinHint": "Coarser grind for the Vietnamese phin — slow drip, bold and traditional.",
      "prod.qtyMinus": "Decrease",
      "prod.qtyPlus": "Increase",
      "prod.qtyAria": "Quantity",
      "prod.addToCart": "Add to cart",
      "prod.buyNow": "Buy now",
      "prod.added": "Added ✓",
      "prod.w0Label": "Sip",
      "prod.w0Sub": "A weekend tasting",
      "prod.w1Label": "Awake",
      "prod.w1Sub": "Enough for a week",
      "prod.w2Label": "Wired",
      "prod.w2Sub": "Full energy!",
      "prod.storyEyebrow": "Origin & story",
      "prod.storyFrom": "From ",
      "prod.storyToCup": " to your cup",
      "prod.tagRegion": "Region",
      "prod.tagFarm": "Farm",
      "prod.producerEyebrow": "The grower",
      "prod.statAltitude": "Altitude",
      "prod.statProcess": "Process",
      "prod.statVarietal": "Varietal",
      "prod.altRegion": "Growing region: ",
      "prod.altFarm": "Farm: ",

      /* ---- status badges ---- */
      "status.best": "Bestseller",
      "status.new": "New",
      "status.limited": "Limited",
      "status.low": "Low stock",

      /* ---- field notes (index) ---- */
      "notes.eyebrow": "Field Notes",
      "notes.h1": "Stories around the cup",
      "notes.lead": "The origin of each lot, brewing know-how, and life at the roastery. Honest notes from Donkey's journey.",
      "notes.read": "Read →",

      /* ---- single note ---- */
      "note.crumb": "Article",
      "note.keepReading": "Keep reading",
      "note.more": "More articles",
      "note.all": "All →",
      "note.ctaEyebrow": "Taste this lot",
      "note.ctaView": "View product · ",

      /* ---- about ---- */
      "about.eyebrow": "Story",
      "about.h1": "A roastery in the city.",
      "about.lead": "Raw, dusty, and honest. Donkey doesn't chase glamour — we just make decent coffee.",
      "about.manifestoEyebrow": "Manifesto",
      "about.manifestoTitle": "Good coffee needn't be complicated. Just honest.",
      "about.manifestoBody": "The name Donkey is a nod to the stamina and free spirit of people who love to roam. We roast in small batches, hand-pick every single-origin lot, and tell the story of the farmer behind each cup.",
      "about.spaceTag": "Space",
      "about.spaceTitle": "Raw, unadorned.",
      "about.spaceBody": "Exposed metal ducting, rough timber walls, warm workshop lights. We keep the raw \u2018workshop\u2019 feel so you can watch each batch roasted right in front of you — transparent from green bean to cup.",
      "about.peopleTag": "People",
      "about.peopleTitle": "Barista and guest face the same way.",
      "about.peopleBody": "At Donkey, the counter isn't a wall between us. The barista weighs beans while telling you about the latest Gesha lot; regulars chime in on extraction. Everyone faces the same thing: flavor.",
      "about.statOrigin": "Single origin",
      "about.statOriginSub": "Sourced from 3 continents.",
      "about.statRoast": "Roast & ship",
      "about.statRoastSub": "Fresh from roaster to you.",
      "about.valuesEyebrow": "What we believe",
      "about.valuesTitle": "Three Donkey principles",
      "about.val1Title": "Original",
      "about.val1Body": "No chasing flashy trends. We keep coffee and space raw and honest.",
      "about.val2Title": "Transparent",
      "about.val2Body": "We're open about the origin, producer and process of every lot. You know exactly what you're drinking.",
      "about.val3Title": "Free",
      "about.val3Body": "Coffee for people on the move — brewed in the shop, taken on the road, or beside a campfire.",
      "about.visitTitle": "Coffee is waiting for you.",
      "about.visitAddress": "Address",
      "about.visitHours": "Opening hours",
      "about.visitHoursVal": "Daily 07:00 – 22:00",
      "about.visitContact": "Contact",
      "about.visitBtnShop": "Shop coffee online",
      "about.visitBtnDir": "Directions →",

      /* ---- footer (JS-rendered) ---- */
      "footer.visitEyebrow": "Visit the roastery",
      "footer.visitTitle": "Coffee is waiting for you on the road.",
      "footer.hours": "Daily 07:00 – 22:00",
      "footer.directions": "Directions →",
      "footer.brandDesc": "Specialty coffee & outdoor spirit. Roasted for the road.",
      "footer.shopHead": "Shop",
      "footer.shopBeans": "Coffee beans",
      "footer.shopOutdoor": "Outdoor gear",
      "footer.shopTools": "Brew tools",
      "footer.shopGift": "Gift set",
      "footer.donkeyHead": "Donkey",
      "footer.story": "Story",
      "footer.notes": "Field Notes",
      "footer.visit": "Visit us",
      "footer.contact": "Contact",
      "footer.copy": "© 2026 Donkey Coffee Roastery. Made on the move.",
      "footer.backToTop": "Back to top",
      "footer.legal": "Policy · Privacy · Shipping",
      "footer.mapAria": "Donkey Coffee Roastery map",
      "common.backToTop": "Back to top",

      /* ---- cart drawer ---- */
      "cart.title": "Your cart",
      "cart.close": "Close cart",
      "cart.empty": "Your cart is empty",
      "cart.emptySub": "Discover specialty single-origins from three continents.",
      "cart.continueShop": "Continue shopping",
      "cart.checkout": "Checkout",
      "cart.subtotal": "Subtotal",
      "cart.shipping": "Shipping",
      "cart.calcAtCheckout": "Calculated at checkout",
      "cart.freeShip": "Free",
      "cart.freeShipHint1": "Add ",
      "cart.freeShipHint2": " more for free shipping.",
      "cart.freeShipReached": "You've unlocked free shipping.",
      "cart.remove": "Remove",
      "cart.qtyAria": "Quantity",
      "cart.openAria": "Open cart",

      /* ---- checkout ---- */
      "title.checkout": "Checkout — Donkey Coffee Roastery",
      "desc.checkout": "Complete your order at Donkey Coffee Roastery.",
      "checkout.crumb": "Checkout",
      "checkout.h1": "Checkout",
      "checkout.lead": "Almost there. Just your details and we'll roast & ship.",
      "checkout.contactHead": "Contact",
      "checkout.shippingHead": "Shipping address",
      "checkout.shipMethodHead": "Shipping method",
      "checkout.payHead": "Payment",
      "checkout.fullname": "Full name",
      "checkout.phone": "Phone",
      "checkout.email": "Email",
      "checkout.address": "Street address",
      "checkout.city": "City / Province",
      "checkout.note": "Order note (optional)",
      "checkout.shipStd": "Standard delivery (1–3 days)",
      "checkout.shipExpress": "Express delivery (24h, intra-city)",
      "checkout.payCod": "Cash on delivery (COD)",
      "checkout.payBank": "Bank transfer",
      "checkout.payBankNote": "We'll email payment details after you place the order.",
      "checkout.place": "Place order",
      "checkout.total": "Total",
      "checkout.orderTitle": "Your order",
      "checkout.required": "Required",
      "checkout.invalidEmail": "Invalid email",
      "checkout.invalidPhone": "Invalid phone number",
      "checkout.successTitle": "Order placed. Thank you!",
      "checkout.successOrderLabel": "Order ID",
      "checkout.successNameLabel": "Customer",
      "checkout.successPayLabel": "Payment",
      "checkout.successBody": "We've received your order and will reach out shortly to confirm. A receipt is on its way to your inbox.",
      "checkout.backHome": "Back to home",
      "checkout.viewShop": "Keep shopping"
    },

    vi: {
      /* ---- document titles / meta ---- */
      "title.home": "Donkey Coffee Roastery — Cà phê đặc sản cho người dịch chuyển",
      "desc.home": "Donkey Coffee Roastery — lò rang cà phê đặc sản nhỏ bên bờ sông Hồng, Hà Nội. Rang mẻ nhỏ, mộc mạc, cho người mê thiên nhiên.",
      "title.collection": "Cà phê đặc sản — Donkey Coffee Roastery",
      "desc.collection": "Bộ sưu tập cà phê đặc sản rang mộc của Donkey Coffee Roastery.",
      "title.product": "Sản phẩm — Donkey Coffee Roastery",
      "desc.product": "Cà phê đặc sản single origin của Donkey Coffee Roastery.",
      "title.notes": "Nhật ký — Donkey Coffee Roastery",
      "desc.notes": "Chuyện nguồn gốc, kiến thức pha chế và đời sống quanh ly cà phê đặc sản của Donkey Coffee Roastery.",
      "title.note": "Nhật ký — Donkey Coffee Roastery",
      "desc.note": "Bài viết nhật ký của Donkey Coffee Roastery.",
      "title.about": "Câu chuyện — Donkey Coffee Roastery",
      "desc.about": "Donkey Coffee Roastery — một xưởng rang giữa phố, nguyên bản và bụi bặm. Câu chuyện, không gian và con người.",

      /* ---- header / nav ---- */
      "nav.coffee": "Cà phê",
      "nav.story": "Câu chuyện",
      "nav.notes": "Nhật ký",
      "nav.search": "Tìm kiếm",
      "nav.cart": "Giỏ hàng",
      "nav.openMenu": "Mở menu",
      "nav.closeMenu": "Đóng menu",

      /* ---- homepage ---- */
      "home.carouselAria": "Ảnh không gian Donkey",
      "home.navAria": "Điều hướng chính",
      "home.footerAria": "Liên kết chân trang",
      "home.shop": "Cửa hàng",
      "home.story": "Câu chuyện",
      "home.event": "Sự kiện",
      "home.more": "Khác",
      "home.sub.beans": "Cà phê hạt Donkey",
      "home.sub.selection": "Donkey tuyển chọn",
      "home.sub.kombucha": "Kombucha",
      "home.sub.merch": "Đồ lưu niệm",
      "home.sub.aboutDonkey": "Về Donkey",
      "home.sub.journey": "Hành trình",
      "home.sub.notes": "Nhật ký",
      "home.sub.cupping": "Cupping & Workshop",
      "home.sub.camping": "Cắm trại ven sông",
      "home.sub.popup": "Phiên chợ pop-up",
      "home.sub.visit": "Ghé quán",
      "home.sub.wholesale": "Bán sỉ",
      "home.sub.contact": "Liên hệ",
      "homeFooter.desc": "Lò rang cà phê đặc sản nhỏ bên bờ sông Hồng, Hà Nội. Rang mẻ nhỏ, mộc mạc — cho những cung đường.",
      "homeFooter.shop": "Cửa hàng",
      "homeFooter.story": "Câu chuyện",
      "homeFooter.notes": "Nhật ký",
      "homeFooter.visit": "Ghé quán",

      /* ---- collection ---- */
      "common.home": "Trang chủ",
      "col.crumb": "Cà phê đặc sản",
      "col.eyebrow": "Bộ sưu tập",
      "col.h1": "Cà phê đặc sản",
      "col.lead": "Single origin tuyển chọn từ ba châu lục, rang theo từng mẻ nhỏ. Mỗi lô là một câu chuyện về vùng đất và người làm ra hạt.",
      "col.all": "Tất cả",
      "col.sortFeatured": "Nổi bật",
      "col.sortPriceAsc": "Giá: thấp đến cao",
      "col.sortPriceDesc": "Giá: cao đến thấp",
      "col.sortAria": "Sắp xếp",
      "col.empty": "Chưa có sản phẩm phù hợp bộ lọc.",
      "country.vietnam": "Việt Nam",

      /* ---- product page (static) ---- */
      "prod.crumbProduct": "Sản phẩm",
      "prod.brewEyebrow": "Gợi ý pha",
      "prod.brewTitle": "Chiết xuất đúng chất single origin",
      "prod.brew1Title": "Pour-over / V60",
      "prod.brew1Body": "15g cà phê : 250ml nước 92–94°C, rót 3 lần trong 2:30 — làm bật hương hoa & trái cây.",
      "prod.brew2Title": "Espresso",
      "prod.brew2Body": "18g in : 40g out trong 28–32s. Hậu ngọt đậm, body tròn.",
      "prod.brew3Title": "Aeropress",
      "prod.brew3Body": "14g : 200ml, ngâm 1:30 rồi nén chậm — gọn nhẹ, hợp khi đi.",
      "prod.relatedEyebrow": "Có thể bạn thích",
      "prod.relatedTitle": "Cùng bộ sưu tập",
      "prod.viewAll": "Xem tất cả →",

      /* ---- product detail (dynamic) ---- */
      "prod.specProducer": "Producer",
      "prod.specVarietal": "Giống",
      "prod.specProcess": "Sơ chế",
      "prod.specRegion": "Vùng trồng",
      "prod.specAltitude": "Cao độ",
      "prod.specYear": "Niên vụ",
      "prod.weight": "Khối lượng",
      "prod.weightAria": "Chọn khối lượng",
      "prod.form": "Dạng",
      "prod.grindWhole": "Nguyên hạt",
      "prod.grindPourover": "Xay pour-over",
      "prod.grindEspresso": "Xay espresso",
      "prod.grindPhin": "Xay phin",
      "prod.grindWholeHint": "Để nguyên hạt, bạn tự xay ngay trước khi pha — giữ hương tươi nhất. Cần máy xay tại nhà.",
      "prod.grindPouroverHint": "Xay cỡ vừa (như hạt đường cát) cho phễu nhỏ giọt V60, Kalita — pha tay, tách trong & nhiều hương.",
      "prod.grindEspressoHint": "Xay mịn cho máy pha espresso — chiết xuất nhanh dưới áp suất cao, vị đậm đặc.",
      "prod.grindPhinHint": "Xay hơi thô cho phin Việt Nam — nước chảy chậm, cà phê đậm đà, truyền thống.",
      "prod.qtyMinus": "Giảm",
      "prod.qtyPlus": "Tăng",
      "prod.qtyAria": "Số lượng",
      "prod.addToCart": "Thêm vào giỏ",
      "prod.buyNow": "Mua ngay",
      "prod.added": "Đã thêm ✓",
      "prod.w0Label": "Nhâm nhi",
      "prod.w0Sub": "Đủ pha thử cuối tuần",
      "prod.w1Label": "Tỉnh táo",
      "prod.w1Sub": "Đủ cho cả tuần",
      "prod.w2Label": "Tăng động",
      "prod.w2Sub": "Full năng lượng!",
      "prod.storyEyebrow": "Nguồn gốc & câu chuyện",
      "prod.storyFrom": "Từ ",
      "prod.storyToCup": " đến tách của bạn",
      "prod.tagRegion": "Vùng trồng",
      "prod.tagFarm": "Nông trại",
      "prod.producerEyebrow": "Người làm ra hạt",
      "prod.statAltitude": "Cao độ",
      "prod.statProcess": "Sơ chế",
      "prod.statVarietal": "Giống",
      "prod.altRegion": "Vùng trồng ",
      "prod.altFarm": "Nông trại ",

      /* ---- status badges ---- */
      "status.best": "Bán chạy",
      "status.new": "Mới",
      "status.limited": "Giới hạn",
      "status.low": "Sắp hết",

      /* ---- field notes (index) ---- */
      "notes.eyebrow": "Nhật ký",
      "notes.h1": "Chuyện quanh ly cà phê",
      "notes.lead": "Nguồn gốc từng lô hạt, kiến thức pha chế, và đời sống ở lò rang. Những ghi chép thật từ hành trình của Donkey.",
      "notes.read": "Đọc bài →",

      /* ---- single note ---- */
      "note.crumb": "Bài viết",
      "note.keepReading": "Đọc tiếp",
      "note.more": "Bài viết khác",
      "note.all": "Tất cả →",
      "note.ctaEyebrow": "Nếm thử lô này",
      "note.ctaView": "Xem sản phẩm · ",

      /* ---- about ---- */
      "about.eyebrow": "Câu chuyện",
      "about.h1": "Một xưởng rang giữa phố.",
      "about.lead": "Nguyên bản, bụi bặm, và thật. Donkey không chạy theo hào nhoáng — chúng tôi chỉ làm cà phê tử tế.",
      "about.manifestoEyebrow": "Tuyên ngôn",
      "about.manifestoTitle": "Cà phê ngon không cần phức tạp. Chỉ cần thật.",
      "about.manifestoBody": "Cái tên Donkey — con lừa — là lời nhắc về sự bền bỉ và tinh thần tự do của những người thích dịch chuyển. Chúng tôi rang từng mẻ nhỏ, chọn từng lô hạt single origin, và kể câu chuyện của người nông dân phía sau mỗi tách cà phê.",
      "about.spaceTag": "Không gian",
      "about.spaceTitle": "Trần trụi, không son phấn.",
      "about.spaceBody": "Ống kẽm lộ thiên, tường ván gỗ thô, đèn nhà xưởng ánh vàng. Chúng tôi giữ nguyên cái chất \u201cxưởng\u201d để bạn nhìn thấy từng mẻ hạt được rang ngay trước mắt — minh bạch từ hạt xanh tới ly cà phê.",
      "about.peopleTag": "Con người",
      "about.peopleTitle": "Người pha và người uống nhìn về một hướng.",
      "about.peopleBody": "Ở Donkey, mặt quầy không phải bức tường ngăn cách. Barista vừa cân hạt vừa kể chuyện về lô Gesha mới về, khách quen góp ý về độ chiết xuất. Tất cả cùng hướng về một điều: hương vị.",
      "about.statOrigin": "Single origin",
      "about.statOriginSub": "Tuyển chọn từ 3 châu lục.",
      "about.statRoast": "Rang & giao",
      "about.statRoastSub": "Tươi từ lò đến tay.",
      "about.valuesEyebrow": "Điều tụi mình tin",
      "about.valuesTitle": "Ba nguyên tắc của Donkey",
      "about.val1Title": "Nguyên bản",
      "about.val1Body": "Không chạy theo xu hướng bóng bẩy. Giữ cái chất mộc, thật của cà phê và không gian.",
      "about.val2Title": "Minh bạch",
      "about.val2Body": "Kể rõ nguồn gốc, producer, sơ chế của từng lô. Bạn biết chính xác mình đang uống gì.",
      "about.val3Title": "Tự do",
      "about.val3Body": "Cà phê cho người dịch chuyển — pha ở quán, mang lên đường, hay bên bếp lửa trại.",
      "about.visitTitle": "Cà phê đang chờ bạn.",
      "about.visitAddress": "Địa chỉ",
      "about.visitHours": "Giờ mở cửa",
      "about.visitHoursVal": "07:00 – 22:00 hằng ngày",
      "about.visitContact": "Liên hệ",
      "about.visitBtnShop": "Mua cà phê online",
      "about.visitBtnDir": "Chỉ đường →",

      /* ---- footer (JS-rendered) ---- */
      "footer.visitEyebrow": "Ghé lò rang",
      "footer.visitTitle": "Cà phê đang chờ bạn trên đường.",
      "footer.hours": "07:00 – 22:00 hằng ngày",
      "footer.directions": "Chỉ đường →",
      "footer.brandDesc": "Cà phê đặc sản & tinh thần outdoor. Rang cho những cung đường.",
      "footer.shopHead": "Mua sắm",
      "footer.shopBeans": "Cà phê hạt",
      "footer.shopOutdoor": "Đồ outdoor",
      "footer.shopTools": "Dụng cụ pha",
      "footer.shopGift": "Gift set",
      "footer.donkeyHead": "Donkey",
      "footer.story": "Câu chuyện",
      "footer.notes": "Nhật ký",
      "footer.visit": "Ghé quán",
      "footer.contact": "Liên hệ",
      "footer.copy": "© 2026 Donkey Coffee Roastery. Made on the move.",
      "footer.backToTop": "Về đầu trang",
      "footer.legal": "Chính sách · Bảo mật · Vận chuyển",
      "footer.mapAria": "Bản đồ Donkey Coffee Roastery",
      "common.backToTop": "Về đầu trang",

      /* ---- cart drawer ---- */
      "cart.title": "Giỏ hàng",
      "cart.close": "Đóng giỏ",
      "cart.empty": "Giỏ hàng đang trống",
      "cart.emptySub": "Khám phá cà phê đặc sản từ ba châu lục.",
      "cart.continueShop": "Tiếp tục mua",
      "cart.checkout": "Thanh toán",
      "cart.subtotal": "Tạm tính",
      "cart.shipping": "Phí giao hàng",
      "cart.calcAtCheckout": "Tính khi thanh toán",
      "cart.freeShip": "Miễn phí",
      "cart.freeShipHint1": "Mua thêm ",
      "cart.freeShipHint2": " để được miễn phí giao hàng.",
      "cart.freeShipReached": "Bạn đã được miễn phí giao hàng.",
      "cart.remove": "Xoá",
      "cart.qtyAria": "Số lượng",
      "cart.openAria": "Mở giỏ hàng",

      /* ---- checkout ---- */
      "title.checkout": "Thanh toán — Donkey Coffee Roastery",
      "desc.checkout": "Hoàn tất đơn hàng của bạn tại Donkey Coffee Roastery.",
      "checkout.crumb": "Thanh toán",
      "checkout.h1": "Thanh toán",
      "checkout.lead": "Sắp xong rồi. Để lại thông tin, Donkey sẽ rang và giao đến tận tay bạn.",
      "checkout.contactHead": "Liên hệ",
      "checkout.shippingHead": "Địa chỉ giao hàng",
      "checkout.shipMethodHead": "Phương thức giao",
      "checkout.payHead": "Thanh toán",
      "checkout.fullname": "Họ và tên",
      "checkout.phone": "Số điện thoại",
      "checkout.email": "Email",
      "checkout.address": "Địa chỉ",
      "checkout.city": "Tỉnh / Thành phố",
      "checkout.note": "Ghi chú (không bắt buộc)",
      "checkout.shipStd": "Giao tiêu chuẩn (1–3 ngày)",
      "checkout.shipExpress": "Giao nhanh nội thành (24h)",
      "checkout.payCod": "Thanh toán khi nhận hàng (COD)",
      "checkout.payBank": "Chuyển khoản ngân hàng",
      "checkout.payBankNote": "Donkey sẽ gửi thông tin chuyển khoản qua email sau khi bạn đặt hàng.",
      "checkout.place": "Đặt hàng",
      "checkout.total": "Tổng cộng",
      "checkout.orderTitle": "Đơn hàng của bạn",
      "checkout.required": "Bắt buộc",
      "checkout.invalidEmail": "Email không hợp lệ",
      "checkout.invalidPhone": "Số điện thoại không hợp lệ",
      "checkout.successTitle": "Đặt hàng thành công. Cảm ơn bạn!",
      "checkout.successOrderLabel": "Mã đơn",
      "checkout.successNameLabel": "Khách hàng",
      "checkout.successPayLabel": "Thanh toán",
      "checkout.successBody": "Donkey đã nhận đơn của bạn và sẽ liên hệ xác nhận sớm. Biên nhận sẽ được gửi tới hộp thư của bạn.",
      "checkout.backHome": "Về trang chủ",
      "checkout.viewShop": "Tiếp tục mua"
    }
  };

  function t(key) {
    var lang = getLang();
    var d = DICT[lang] || {};
    if (Object.prototype.hasOwnProperty.call(d, key)) return d[key];
    var f = DICT[DEFAULT_LANG] || {};
    return Object.prototype.hasOwnProperty.call(f, key) ? f[key] : key;
  }

  /* Resolve a localized data value: {en, vi} -> string, plain -> unchanged */
  function L(v) {
    if (v && typeof v === "object" && !Array.isArray(v) && ("en" in v || "vi" in v)) {
      var lang = getLang();
      return v[lang] != null ? v[lang] : (v.en != null ? v.en : v.vi);
    }
    return v;
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) < 0 || lang === getLang()) return;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    window.location.reload();
  }

  function applyStatic() {
    var lang = getLang();
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("meta[data-i18n-content]").forEach(function (el) {
      el.setAttribute("content", t(el.getAttribute("data-i18n-content")));
    });
  }

  function buildToggle() {
    if (document.querySelector(".lang-switch")) return;
    var lang = getLang();
    var wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Language");
    wrap.innerHTML =
      '<button type="button" data-lang="en"' + (lang === "en" ? ' class="is-active"' : "") + ' aria-pressed="' + (lang === "en") + '">EN</button>' +
      '<span class="lang-switch__sep" aria-hidden="true">/</span>' +
      '<button type="button" data-lang="vi"' + (lang === "vi" ? ' class="is-active"' : "") + ' aria-pressed="' + (lang === "vi") + '">VI</button>';
    wrap.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang]");
      if (!b) return;
      setLang(b.getAttribute("data-lang"));
    });
    document.body.appendChild(wrap);
  }

  function init() {
    applyStatic();
    buildToggle();
  }

  window.I18N = { t: t, L: L, getLang: getLang, setLang: setLang, apply: applyStatic };
  window.t = t;
  window.L = L;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
