import '../index.css';
import { bootstrapModule } from '../core/bootstrap';
import { initOrdersBoard } from '../modules/orders-board';
import { initPaymentsFlow } from '../modules/payments-flow';
import { initMenuManager } from '../modules/menu-manager';
import { initModifiersManager } from '../modules/modifiers-manager';
import { initAreasManager } from '../modules/areas-manager';
import { initTablesManager } from '../modules/tables-manager';
import { initConfigManager } from '../modules/config-manager';
import { initPromotionsManager } from '../modules/promotions-manager';
import { initRecommendationsManager } from '../modules/recommendations-manager';
import { initReportsManager } from '../modules/reports-manager';
import { initCustomersManager } from '../modules/customers-manager';
import { initRoleManagement } from '../modules/role-management';
import { initSessionsManager } from '../modules/sessions-manager';
import { initPrepTimesManager } from '../modules/prep-times-manager';
import { initProductSchedulesManager } from '../modules/product-schedules-manager';
import { initDashboardShortcuts } from '../modules/dashboard-shortcuts';
import { initAnonymousSessionsManager } from '../modules/anonymous-sessions-manager';
import { initWaiterBoard } from '../modules/waiter-board';
import { initKitchenBoard } from '../modules/kitchen-board';
import { initTableAssignment } from '../modules/table-assignment';
import { initCashierBoard } from '../modules/cashier-board';
import { initEmployeeEvents } from '../modules/employee-events';

bootstrapModule('[data-orders-board-root]', (root) => {
    initOrdersBoard(root);
}, { name: 'orders-board' });

bootstrapModule('[data-waiter-root]', (root) => {
    initWaiterBoard(root);
}, { name: 'waiter-board' });

bootstrapModule('[data-kitchen-root]', (root) => {
    initKitchenBoard(root);
}, { name: 'kitchen-board' });

bootstrapModule('[data-cashier-root]', (root) => {
    initCashierBoard(root);
}, { name: 'cashier-board' });

initPaymentsFlow();
initMenuManager();
initModifiersManager();
initAreasManager();
initTablesManager();
initConfigManager();
initPromotionsManager();
initRecommendationsManager();
initReportsManager();
initCustomersManager();
initRoleManagement();
initSessionsManager();
initPrepTimesManager();
initProductSchedulesManager();
initDashboardShortcuts();
initAnonymousSessionsManager();
initTableAssignment();
initEmployeeEvents();

// Expose unified refreshOrders function for realtime updates
(window as any).refreshOrders = () => {
    if (typeof (window as any).refreshWaiterOrders === 'function') {
        (window as any).refreshWaiterOrders();
    }
    if (typeof (window as any).refreshKitchenOrders === 'function') {
        (window as any).refreshKitchenOrders();
    }
};

// Vue Components Mounting
import { createApp } from 'vue';
// @ts-expect-error Vue component import
import EmployeesManager from '../components/EmployeesManager.vue';
// @ts-expect-error Vue component import
import FeedbackDashboard from '../components/FeedbackDashboard.vue';
// @ts-expect-error Vue component import
import ReportsManager from '../components/ReportsManager.vue';
// @ts-expect-error Vue component import
import BusinessConfig from '../components/BusinessConfig.vue';
// @ts-expect-error Vue component import
import RolesManager from '../components/RolesManager.vue';
// @ts-expect-error Vue component import
import ClosedSessionsManager from '../components/ClosedSessionsManager.vue';
// @ts-expect-error Vue component import
import PaymentFlow from '../components/PaymentFlow.vue';
// @ts-expect-error Vue component import
import NotificationToast from '../../shared/components/NotificationToast.vue';
// @ts-expect-error Vue component import
import NotificationCenter from '../../shared/components/NotificationCenter.vue';
// @ts-expect-error Vue component import
import ShortcutsManager from '../components/ShortcutsManager.vue';

const employeesRoot = document.getElementById('employees-table');
if (employeesRoot) {
    console.log('Mounting Vue EmployeesManager...');
    const appContainer = document.createElement('div');
    employeesRoot.innerHTML = '';
    employeesRoot.appendChild(appContainer);
    createApp(EmployeesManager).mount(appContainer);
}

const feedbackRoot = document.getElementById('feedback-dashboard');
if (feedbackRoot) {
    console.log('Mounting Vue FeedbackDashboard...');
    const appContainer = document.createElement('div');
    feedbackRoot.innerHTML = '';
    feedbackRoot.appendChild(appContainer);
    createApp(FeedbackDashboard).mount(appContainer);
}

const reportsRoot = document.getElementById('reports-section');
if (reportsRoot) {
    console.log('Mounting Vue ReportsManager...');
    const appContainer = document.createElement('div');
    appContainer.className = 'reports-container';
    reportsRoot.innerHTML = '';
    reportsRoot.appendChild(appContainer);
    createApp(ReportsManager).mount(appContainer);
}

const businessConfigRoot = document.getElementById('business-config-section');
if (businessConfigRoot) {
    console.log('Mounting Vue BusinessConfig...');
    const appContainer = document.createElement('div');
    appContainer.className = 'business-config-container';
    businessConfigRoot.innerHTML = '';
    businessConfigRoot.appendChild(appContainer);
    createApp(BusinessConfig).mount(appContainer);
}

const rolesManagerRoot = document.getElementById('roles-manager-section');
if (rolesManagerRoot) {
    console.log('Mounting Vue RolesManager...');
    const appContainer = document.createElement('div');
    appContainer.className = 'roles-manager-container';
    rolesManagerRoot.innerHTML = '';
    rolesManagerRoot.appendChild(appContainer);
    createApp(RolesManager).mount(appContainer);
}

const closedSessionsRoot = document.getElementById('closed-sessions-section');
if (closedSessionsRoot) {
    console.log('Mounting Vue ClosedSessionsManager...');
    const appContainer = document.createElement('div');
    appContainer.className = 'closed-sessions-container';
    closedSessionsRoot.innerHTML = '';
    closedSessionsRoot.appendChild(appContainer);
    createApp(ClosedSessionsManager).mount(appContainer);
}

const paymentFlowRoot = document.getElementById('payment-flow-root');
if (paymentFlowRoot) {
    console.log('Mounting Vue PaymentFlow...');
    const appContainer = document.createElement('div');
    appContainer.className = 'payment-flow-root';
    paymentFlowRoot.innerHTML = '';
    paymentFlowRoot.appendChild(appContainer);
    createApp(PaymentFlow).mount(appContainer);
}

const notificationRoot = document.getElementById('notification-toast-root');
if (notificationRoot) {
    console.log('Mounting Vue NotificationToast...');
    const appContainer = document.createElement('div');
    appContainer.className = 'notification-toast-root';
    notificationRoot.innerHTML = '';
    notificationRoot.appendChild(appContainer);
    createApp(NotificationToast).mount(appContainer);
}

const notificationCenterRoot = document.getElementById('notification-center-root');
if (notificationCenterRoot) {
    console.log('Mounting Vue NotificationCenter...');
    const appContainer = document.createElement('div');
    appContainer.className = 'notification-center-root';
    notificationCenterRoot.innerHTML = '';
    notificationCenterRoot.appendChild(appContainer);
    createApp(NotificationCenter).mount(appContainer);
}

const shortcutsManagerRoot = document.getElementById('shortcuts-manager-section');
if (shortcutsManagerRoot) {
    console.log('Mounting Vue ShortcutsManager...');
    const appContainer = document.createElement('div');
    appContainer.className = 'shortcuts-manager-container';
    shortcutsManagerRoot.innerHTML = '';
    shortcutsManagerRoot.appendChild(appContainer);
    createApp(ShortcutsManager).mount(appContainer);
}

