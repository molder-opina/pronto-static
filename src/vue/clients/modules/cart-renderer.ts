
import { type CartItem } from './cart-persistence';
import { cartStore } from '../store/cart';

/**
 * Handles rendering of the side-panel cart items and attaching event listeners.
 * This bridges the reactive Vue store with the legacy/static DOM structure of #cart-panel.
 */
export class CartRenderer {
    private container: HTMLElement | null;
    private totalElement: HTMLElement | null;
    private emptyStateHtml: string = '';

    constructor() {
        this.container = document.getElementById('cart-items');
        this.totalElement = document.getElementById('cart-total');

        // Capture initial empty state HTML if present
        if (this.container) {
            const emptyStateEl = this.container.querySelector('.empty-state');
            if (emptyStateEl) {
                this.emptyStateHtml = emptyStateEl.outerHTML;
            } else {
                // Fallback default empty state
                this.emptyStateHtml = `
          <div class="empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h3 class="empty-state-title">Tu carrito está vacío</h3>
            <p class="empty-state-description">Agrega algunos platillos deliciosos para empezar</p>
            <button class="btn btn-primary" onclick="window.closeCart?.() || document.querySelector('.cart-close')?.click()">Seguir comprando</button>
          </div>
        `;
            }
        }

        this.attachListeners();
    }

    private attachListeners() {
        if (!this.container) return;

        // Delegate click events for performance and dynamic content support
        this.container.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            // Handle Quantity Buttons
            const btn = target.closest('button');
            if (!btn) return;

            const action = btn.dataset.action;
            const indexStr = btn.dataset.index;

            if (!action || indexStr === undefined) return;

            const index = parseInt(indexStr, 10);
            if (isNaN(index)) return;

            if (action === 'increase') {
                cartStore.updateItemQuantity(index, 1);
            } else if (action === 'decrease') {
                cartStore.updateItemQuantity(index, -1);
            } else if (action === 'remove') {
                cartStore.removeItem(index);
            }
        });

        // Also attach listener to Clear Cart button in footer if it exists
        const clearBtn = document.getElementById('clear-cart-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                cartStore.clearCart();
            });
        }
    }

    public render(items: CartItem[]) {
        if (!this.container) {
            // Try to re-fetch container in case of DOM updates (unlikely but safe)
            this.container = document.getElementById('cart-items');
            this.totalElement = document.getElementById('cart-total');
            if (!this.container) return;
        }

        // Update Total
        if (this.totalElement) {
            const total = items.reduce((sum, item) => sum + (item.price + item.extrasTotal) * item.quantity, 0);
            const currencySymbol = (window as any).APP_CONFIG?.currency_symbol || '$';
            this.totalElement.textContent = `${currencySymbol}${total.toFixed(2)}`;
        }

        // If empty
        if (items.length === 0) {
            this.container.innerHTML = this.emptyStateHtml;
            // Also potentially hide 'Ir a pagar' button or disable it
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                (checkoutBtn as HTMLButtonElement).disabled = true;
                checkoutBtn.style.opacity = '0.5';
                checkoutBtn.style.cursor = 'not-allowed';
            }
            return;
        }

        // Enable checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            (checkoutBtn as HTMLButtonElement).disabled = false;
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
        }

        // Render List
        const currencySymbol = (window as any).APP_CONFIG?.currency_symbol || '$';

        const html = items.map((item, index) => {
            const itemTotal = (item.price + item.extrasTotal) * item.quantity;
            const extrasHtml = item.extras && item.extras.length > 0
                ? `<div class="cart-item-extras" style="font-size: 0.85rem; color: var(--muted); margin-top: 0.2rem;">+ ${item.extras.join(', ')}</div>`
                : '';

            const imageHtml = item.image
                ? `<img src="${item.image}" alt="${item.name}" class="cart-item-image" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; background: #f1f5f9;">`
                : `<div class="cart-item-image-placeholder" style="width: 60px; height: 60px; border-radius: 8px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🍽️</div>`;

            return `
        <div class="cart-item" style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--border);">
          ${imageHtml}
          
          <div class="cart-item-details" style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
              <h4 class="cart-item-title" style="margin: 0; font-size: 1rem; font-weight: 600; color: var(--text);">${item.name}</h4>
              <span class="cart-item-price" style="font-weight: 700; color: var(--primary);">${currencySymbol}${itemTotal.toFixed(2)}</span>
            </div>
            
            ${extrasHtml}
            
            <div class="cart-item-controls" style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.75rem;">
              <div class="quantity-selector" style="display: flex; align-items: center; gap: 0.25rem; background: #f8fafc; padding: 0.125rem; border-radius: 8px; border: 1px solid var(--border);">
                <button type="button" class="quantity-btn" data-action="decrease" data-index="${index}" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; background: white; border-radius: 6px; cursor: pointer; color: var(--text); font-weight: bold; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">-</button>
                <span style="font-weight: 600; min-width: 1.5rem; text-align: center; font-size: 0.9rem;">${item.quantity}</span>
                <button type="button" class="quantity-btn" data-action="increase" data-index="${index}" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; background: white; border-radius: 6px; cursor: pointer; color: var(--text); font-weight: bold; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">+</button>
              </div>
              
              <button type="button" class="remove-btn" data-action="remove" data-index="${index}" style="margin-left: auto; color: var(--error); background: none; border: none; font-size: 0.85rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      `;
        }).join('');

        this.container.innerHTML = html;
    }
}
