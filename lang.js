// lang.js - Haoyu Aluminum bilingual toggle
// Reads data-zh attributes and swaps innerHTML / placeholder on toggle.
// Language choice is persisted to localStorage.

(function () {
  var lang = localStorage.getItem('hy-lang') || 'en';

  function apply(l) {
    // Swap innerHTML elements
    document.querySelectorAll('[data-zh]').forEach(function (el) {
      if (l === 'zh') {
        if (!el.dataset.en) el.dataset.en = el.innerHTML;
        el.innerHTML = el.dataset.zh;
      } else {
        if (el.dataset.en) el.innerHTML = el.dataset.en;
      }
    });
    // Swap placeholder text
    document.querySelectorAll('[data-zh-ph], [data-zh-placeholder]').forEach(function (el) {
      var zhPlaceholder = el.dataset.zhPlaceholder || el.dataset.zhPh;
      if (l === 'zh') {
        if (!el.dataset.enPh) el.dataset.enPh = el.placeholder;
        if (zhPlaceholder) el.placeholder = zhPlaceholder;
      } else {
        if (el.dataset.enPh) el.placeholder = el.dataset.enPh;
      }
    });
    // Update button label
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.textContent = l === 'zh' ? 'EN' : '中文';
    });
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('hy-lang', l);
    lang = l;
  }

  window.toggleLang = function () {
    apply(lang === 'en' ? 'zh' : 'en');
  };

  // Apply on page load if user previously chose Chinese
  document.addEventListener('DOMContentLoaded', function () {
    if (lang === 'zh') apply('zh');
  });
})();
