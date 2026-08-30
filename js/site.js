/* GKC Enterprises · site behavior
   Forms, chips, yardage calculator, mobile nav, winter mode. No dependencies. */

/* ---- Config ---------------------------------------------------------- */

/* Form delivery endpoint (e.g. a Formspree form: "https://formspree.io/f/XXXXXXXX").
   Submissions should reach gary@hiregkc.com and brandi@hiregkc.com.
   Until this is set, forms show a call/email fallback instead of pretending to send. */
var FORM_ENDPOINT = "";

/* Winter mode (Nov-Mar): shows the sitewide 24-hour snow banner. */
var WINTER_MODE = false;

/* ---- Winter banner ---------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  if (WINTER_MODE) {
    var banner = document.getElementById("winter-banner");
    if (banner) banner.hidden = false;
  }

  initMobileNav();
  initChips();
  initEstimateForms();
  initDeliveryForm();
  initCalculator();
  initUploadBoxes();
});

/* ---- Mobile nav sheet -------------------------------------------------- */
function initMobileNav() {
  var btn = document.getElementById("menu-btn");
  var sheet = document.getElementById("nav-sheet");
  if (!btn || !sheet) return;
  function open() { sheet.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
  function close() { sheet.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  btn.addEventListener("click", open);
  sheet.querySelectorAll("[data-close]").forEach(function (el) { el.addEventListener("click", close); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
}

/* ---- Chip groups -------------------------------------------------------
   data-chip-group="services" data-multi  -> multi-select
   data-chip-group="budget"              -> single-select (tap again to clear) */
function initChips() {
  document.querySelectorAll("[data-chip-group]").forEach(function (group) {
    var multi = group.hasAttribute("data-multi");
    group.querySelectorAll(".chip").forEach(function (chip) {
      chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") || "false");
      chip.addEventListener("click", function () {
        var on = chip.getAttribute("aria-pressed") === "true";
        if (!multi) {
          group.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        }
        chip.setAttribute("aria-pressed", on && !multi ? "false" : String(!on));
      });
    });
  });
}

/* A value that may come from a <select> (homepage) or a chip group (/contact). */
function fieldOrChips(form, name) {
  var sel = form.querySelector('select[name="' + name + '"]');
  if (sel) return sel.value;
  return chipValues(form, name).join(", ");
}

function chipValues(scope, groupName) {
  var group = scope.querySelector('[data-chip-group="' + groupName + '"]');
  if (!group) return [];
  return Array.from(group.querySelectorAll('.chip[aria-pressed="true"]')).map(function (c) {
    return c.getAttribute("data-value") || c.textContent.trim();
  });
}

/* ---- Shared submit ----------------------------------------------------- */
function showMsg(form, kind, text) {
  var box = form.querySelector(".form-msg");
  if (!box) return;
  box.className = "form-msg " + kind;
  box.textContent = text;
  box.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function deliverForm(form, fields, onSuccess) {
  if (!FORM_ENDPOINT) {
    showMsg(form, "err", "Online sending isn't switched on yet. Call or text 267-436-1181, or email gary@hiregkc.com, and we'll take it from there.");
    return;
  }
  var data = new FormData();
  Object.keys(fields).forEach(function (k) { data.append(k, fields[k]); });
  var fileInput = form.querySelector('input[type="file"]');
  if (fileInput && fileInput.files) {
    Array.from(fileInput.files).slice(0, 4).forEach(function (f, i) { data.append("photo" + (i + 1), f); });
  }
  var btn = form.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = "SENDING..."; }
  fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
    .then(function (r) {
      if (!r.ok) throw new Error("send failed");
      onSuccess();
    })
    .catch(function () {
      if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute("data-label") || "SEND IT TO GKC"; }
      showMsg(form, "err", "That didn't go through. Call or text 267-436-1181, or email gary@hiregkc.com.");
    });
}

/* ---- Estimate forms (homepage #estimate and /contact) ------------------ */
function initEstimateForms() {
  document.querySelectorAll("form[data-estimate]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var phone = (form.querySelector('[name="phone"]') || {}).value || "";
      var email = (form.querySelector('[name="email"]') || {}).value || "";
      var town = (form.querySelector('[name="town"]') || {}).value || "";
      var details = (form.querySelector('[name="details"]') || {}).value || "";
      var services = chipValues(form, "services");
      var budget = fieldOrChips(form, "budget");
      var timeline = fieldOrChips(form, "timeline");
      var reach = fieldOrChips(form, "reach");

      if (!name.trim()) { showMsg(form, "err", "Add your name so we know who to call back."); return; }
      if (!phone.trim() && !email.trim()) { showMsg(form, "err", "Add a phone number or an email so we can reach you."); return; }
      if (services.length === 0) { showMsg(form, "err", "Pick at least one service so the right person calls you back."); return; }

      deliverForm(form, {
        form: "Free estimate",
        name: name, phone: phone, email: email, town: town,
        services: services.join(", "), budget: budget, timeline: timeline,
        "reach me by": reach, details: details,
        _subject: "Free estimate request: " + name
      }, function () {
        form.innerHTML =
          '<div style="text-align:center;padding:34px 10px;display:flex;flex-direction:column;gap:12px">' +
          '<div style="font-family:var(--display);font-size:26px;font-weight:800;text-transform:uppercase;color:var(--spruce)">Sent. You’re on the list.</div>' +
          '<div style="font-size:15.5px;line-height:1.6;color:var(--muted)">We\'ll get back to you within one business day.<br>Sooner is fine too: <a href="tel:+12674361181" style="font-weight:700">267-436-1181</a>, call or text.</div>' +
          "</div>";
      });
    });
  });
}

/* ---- Delivery request form (/delivery-services) ------------------------ */
function initDeliveryForm() {
  var form = document.querySelector("form[data-delivery]");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = (form.querySelector('[name="name"]') || {}).value || "";
    var phone = (form.querySelector('[name="phone"]') || {}).value || "";
    var address = (form.querySelector('[name="address"]') || {}).value || "";
    var date = (form.querySelector('[name="date"]') || {}).value || "";
    var product = (form.querySelector('[name="product"]') || {}).value || "";
    var qty = (form.querySelector('[name="quantity"]') || {}).value || "";

    if (!name.trim()) { showMsg(form, "err", "Add your name so we know whose driveway it is."); return; }
    if (!phone.trim()) { showMsg(form, "err", "Add a phone number: we confirm every delivery before the truck rolls."); return; }
    if (!address.trim()) { showMsg(form, "err", "Add the delivery address."); return; }

    deliverForm(form, {
      form: "Delivery request",
      name: name, phone: phone, address: address,
      "preferred date": date, product: product, quantity: qty,
      _subject: "Delivery request: " + name
    }, function () {
      form.innerHTML =
        '<div style="text-align:center;padding:30px 10px;display:flex;flex-direction:column;gap:12px">' +
        '<div style="font-family:var(--display);font-size:24px;font-weight:800;text-transform:uppercase;color:var(--spruce)">Request in.</div>' +
        '<div style="font-size:15px;line-height:1.6;color:var(--muted)">We’ll confirm the price and the day before anything rolls.<br>Mark an X on the driveway. Nobody needs to be home.</div>' +
        "</div>";
    });
  });
}

/* ---- Yardage calculator (/delivery-services) ---------------------------
   cubic yards = ceil(((L ft x W ft x (D in / 12)) / 27) * 2) / 2  (round UP to half yard) */
function initCalculator() {
  var out = document.getElementById("calc-yards");
  if (!out) return;
  var inputs = ["calc-len", "calc-wid", "calc-dep"].map(function (id) { return document.getElementById(id); });
  function update() {
    var L = parseFloat(inputs[0].value), W = parseFloat(inputs[1].value), D = parseFloat(inputs[2].value);
    var ok = L > 0 && W > 0 && D > 0;
    out.textContent = ok ? (Math.ceil(((L * W * (D / 12)) / 27) * 2) / 2).toFixed(1) : "0.0";
  }
  inputs.forEach(function (el) { el.addEventListener("input", update); });
  update();
}

/* ---- Upload boxes ------------------------------------------------------ */
function initUploadBoxes() {
  document.querySelectorAll(".upload-box").forEach(function (box) {
    var input = box.querySelector('input[type="file"]');
    if (!input) return;
    box.addEventListener("click", function () { input.click(); });
    box.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
    input.addEventListener("change", function () {
      var n = input.files.length;
      box.querySelector(".upload-label").textContent =
        n === 0 ? box.getAttribute("data-empty") : n + (n === 1 ? " photo attached" : " photos attached");
    });
  });
}
