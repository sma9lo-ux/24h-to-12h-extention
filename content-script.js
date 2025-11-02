// content-script.js
(function () {
  'use strict';

  // Regex to match 24-hour times: HH:MM or H:MM or HH:MM:SS
  const timeRegex = /\b([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?\b/g;

  // Regex to skip already converted times
  const ampmRegex = /\b([AaPp]\.?[Mm]\.?|AM|PM)\b/;

  // Tags to ignore
  const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA', 'INPUT']);

  function convert24To12(match, h, m, s) {
    const hour = parseInt(h, 10);
    const minute = m;
    const second = s;
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = ((hour + 11) % 12) + 1; // 0 -> 12
    return second ? `${hour12}:${minute}:${second} ${period}` : `${hour12}:${minute} ${period}`;
  }

  function shouldSkipNode(node) {
    if (!node || !node.parentElement) return true;
    if (IGNORED_TAGS.has(node.parentElement.tagName)) return true;
    return false;
  }

  function processTextNode(node) {
    if (!node.nodeValue) return;
    if (shouldSkipNode(node)) return;
    const text = node.nodeValue;
    if (ampmRegex.test(text)) return;

    let replaced = false;
    const newText = text.replace(timeRegex, (match, h, m, s, offset, str) => {
      const leftChar = str[offset - 1] || ' ';
      const rightChar = str[offset + match.length] || ' ';

      // Skip if surrounded by letters (e.g. code or variable names)
      if (/[A-Za-z]/.test(leftChar) || /[A-Za-z]/.test(rightChar)) return match;

      // Skip likely sports scores like "2:1"
      const hourNum = parseInt(h, 10);
      const minuteNum = parseInt(m, 10);
      if (hourNum < 10 && minuteNum < 10 && str.trim().length <= 5) return match;

      replaced = true;
      return convert24To12(match, h, m, s);
    });

    if (replaced) {
      const span = document.createElement('span');
      span.innerText = newText;
      span.title = text; // keep original as tooltip
      node.parentNode.replaceChild(span, node);
    }
  }

  function walkAndProcess(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    const toProcess = [];
    while (walker.nextNode()) {
      toProcess.push(walker.currentNode);
    }
    toProcess.forEach(processTextNode);
  }

  // Initial scan
  walkAndProcess(document.body);

  // Watch for dynamic changes
  const mo = new MutationObserver(mutations => {
    for (const mut of mutations) {
      for (const node of mut.addedNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          walkAndProcess(node);
        }
      }
    }
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // Re-run every few seconds (for sites that silently update content)
  setInterval(() => {
    walkAndProcess(document.body);
  }, 3000);

})();
