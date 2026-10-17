// Untethered Ops portfolio: ROI calculator and quote request form

(function () {
  'use strict';

  var EMAIL = 'untetheredops@gmail.com';

  // ---------- ROI calculator ----------
  var currencies = {
    USD: { sym: '$',  min: 10,  max: 200,   step: 5,   def: 30 },
    PHP: { sym: '₱',  min: 300, max: 10000, step: 100, def: 1500 },
    EUR: { sym: '€',  min: 10,  max: 200,   step: 5,   def: 30 },
    GBP: { sym: '£',  min: 10,  max: 200,   step: 5,   def: 25 },
    AUD: { sym: 'A$', min: 15,  max: 300,   step: 5,   def: 45 },
    CAD: { sym: 'C$', min: 15,  max: 300,   step: 5,   def: 40 },
    SGD: { sym: 'S$', min: 15,  max: 300,   step: 5,   def: 40 }
  };

  var $ = function (id) { return document.getElementById(id); };

  var currencyEl = $('roi-currency');
  var hoursEl = $('roi-hours');
  var rateEl = $('roi-rate');
  var shareEl = $('roi-share');

  function formatNumber(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  function updateRoi() {
    var cfg = currencies[currencyEl.value] || currencies.USD;
    var hours = Number(hoursEl.value);
    var rate = Number(rateEl.value);
    var share = Number(shareEl.value);

    var week = hours * share / 100;
    var month = week * 52 / 12;
    var value = month * rate;

    $('roi-hours-label').textContent = hours + ' hrs';
    $('roi-rate-label').textContent = cfg.sym + formatNumber(rate) + ' / hr';
    $('roi-share-label').textContent = share + '%';
    $('roi-week').textContent = String(Math.round(week * 10) / 10);
    $('roi-month').textContent = formatNumber(month);
    $('roi-value').textContent = cfg.sym + formatNumber(value);
    $('roi-year').textContent = cfg.sym + formatNumber(value * 12);
  }

  function applyCurrency() {
    var cfg = currencies[currencyEl.value] || currencies.USD;
    rateEl.min = cfg.min;
    rateEl.max = cfg.max;
    rateEl.step = cfg.step;
    rateEl.value = cfg.def;
    updateRoi();
  }

  if (currencyEl && hoursEl && rateEl && shareEl) {
    currencyEl.addEventListener('change', applyCurrency);
    [hoursEl, rateEl, shareEl].forEach(function (el) {
      el.addEventListener('input', updateRoi);
    });
    applyCurrency();
  }

  // ---------- Quote request form ----------
  var nameEl = $('inq-name');
  var emailEl = $('inq-email');
  var storeEl = $('inq-store');
  var topicEl = $('inq-topic');
  var countryEl = $('inq-country');
  var phoneEl = $('inq-phone');
  var messageEl = $('inq-message');
  var sendEl = $('inq-send');
  var hintEl = $('inq-hint');

  var hintIdle = 'Add your name and a valid email, then Request a quote opens your email app with the message ready.';
  var hintReady = 'This opens your email app with your inquiry ready to send to ' + EMAIL + '.';

  function isReady() {
    return nameEl.value.trim().length > 0 && /^\S+@\S+\.\S+$/.test(emailEl.value.trim());
  }

  function buildMailto() {
    var body =
      'Name: ' + nameEl.value +
      '\nEmail: ' + emailEl.value +
      '\nPhone or WhatsApp: ' + (phoneEl.value || 'not provided') +
      '\nCountry or time zone: ' + (countryEl.value || 'not provided') +
      '\nStore: ' + (storeEl.value || 'not provided') +
      '\nInterested in: ' + topicEl.value +
      '\n\n' + messageEl.value;
    var subject = 'Quote request from ' + nameEl.value + ': ' + topicEl.value;
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function updateForm() {
    var ready = isReady();
    sendEl.setAttribute('href', ready ? buildMailto() : '#inquiry');
    hintEl.textContent = ready ? hintReady : hintIdle;
  }

  if (sendEl) {
    [nameEl, emailEl, storeEl, topicEl, countryEl, phoneEl, messageEl].forEach(function (el) {
      el.addEventListener('input', updateForm);
      el.addEventListener('change', updateForm);
    });
    updateForm();
  }

  // ---------- Footer year ----------
  var yearEl = $('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
