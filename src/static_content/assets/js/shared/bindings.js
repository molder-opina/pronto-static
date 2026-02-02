(() => {
  const coerceValue = (value) => {
    if (value === undefined || value === null) return value;
    const trimmed = String(value).trim();
    if (trimmed === '') return '';
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    const num = Number(trimmed);
    if (!Number.isNaN(num) && String(num) === trimmed) return num;
    return value;
  };

  const parseArgs = (el) => {
    if (el.dataset.args) {
      try {
        const parsed = JSON.parse(el.dataset.args);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (error) {
        return [el.dataset.args];
      }
    }
    if (el.dataset.arg !== undefined) return [coerceValue(el.dataset.arg)];
    return [];
  };

  const handleAction = (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (!action) return;

    if (target.dataset.preventDefault === 'true') {
      event.preventDefault();
    }

    if (action === 'navigate') {
      const href = target.dataset.href;
      if (href) window.location.href = href;
      return;
    }

    if (action === 'toggle-parent-class') {
      const className = target.dataset.class;
      const parent = target.parentElement;
      if (className && parent) parent.classList.toggle(className);
      return;
    }

    if (action === 'proceed-checkout') {
      if (typeof window.proceedToCheckout === 'function') {
        window.proceedToCheckout();
      } else {
        window.location.href = '/checkout';
      }
      return;
    }

    if (action === 'call') {
      const fnName = target.dataset.fn;
      const fn = fnName ? window[fnName] : null;
      if (typeof fn === 'function') {
        const args = parseArgs(target);
        fn(...args);
      }
    }
  };

  const bindImageFallbacks = () => {
    const images = document.querySelectorAll('img[data-fallback-src], img[data-onload-class]');
    images.forEach((img) => {
      if (img.dataset.onloadClass) {
        img.addEventListener('load', () => {
          img.classList.add(img.dataset.onloadClass);
        });
      }

      if (img.dataset.fallbackSrc) {
        img.addEventListener('error', () => {
          if (img.dataset.fallbackApplied === 'true') return;
          img.dataset.fallbackApplied = 'true';
          img.classList.add(img.dataset.onloadClass || '');
          img.src = img.dataset.fallbackSrc;
        });
      }
    });
  };

  document.addEventListener('click', handleAction);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindImageFallbacks);
  } else {
    bindImageFallbacks();
  }
})();
