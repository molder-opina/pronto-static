let keyboardShortcutsBound = false;

export function initKeyboardShortcuts(): void {
  if (keyboardShortcutsBound) return;
  keyboardShortcutsBound = true;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay--visible');
      if (activeModal) {
        const closeBtn = activeModal.querySelector<HTMLElement>('.modal-close');
        if (closeBtn) closeBtn.click();
      }

      const expandedSections = document.querySelectorAll('.collapsible-section--expanded');
      expandedSections.forEach((section) => {
        const header = section.querySelector<HTMLElement>('.collapsible-section__header');
        if (header) header.click();
      });
    }

    const activeChip = document.activeElement?.closest('.filter-chip');
    if (activeChip && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      const chips = Array.from(document.querySelectorAll<HTMLElement>('.filter-chip'));
      const currentIndex = chips.indexOf(activeChip as HTMLElement);

      if (event.key === 'ArrowRight' && currentIndex < chips.length - 1) {
        chips[currentIndex + 1].focus();
      } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
        chips[currentIndex - 1].focus();
      }
    }
  });
}
