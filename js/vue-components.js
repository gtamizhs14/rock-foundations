// ============================================================
// Rock Foundations — vue-components.js
// Vue 3 interactive components via CDN
// ============================================================

const { createApp, ref, reactive, computed, onMounted, onBeforeUnmount } = Vue;

// ---- 1. Prayer Counter (used inside prayer card section) ----
const PrayerCounterApp = createApp({
  setup() {
    const count = ref(47);
    const prayed = ref(false);

    function togglePrayed() {
      prayed.value = !prayed.value;
      count.value += prayed.value ? 1 : -1;
    }

    return { count, prayed, togglePrayed };
  },
  template: `
    <div class="rf-prayer-actions">
      <div class="rf-prayer-action-btns">
        <button
          class="rf-prayer-action-btn rf-prayed-btn"
          :class="{ 'rf-prayed-active': prayed }"
          @click="togglePrayed"
          :aria-pressed="prayed"
          :aria-label="prayed ? 'Remove prayer' : 'Add prayer'">
          <i class="fa-solid fa-hands-praying"></i>
          {{ prayed ? 'Prayed ✓' : 'I Prayed' }}
        </button>
        <button class="rf-prayer-action-btn" aria-label="Comment">
          <i class="fa-regular fa-comment"></i>
          Comment
        </button>
        <button class="rf-prayer-action-btn" aria-label="Share">
          <i class="fa-solid fa-share-nodes"></i>
          Share
        </button>
      </div>
      <div class="rf-prayer-count">
        <i class="fa-solid fa-hands-praying" style="color:#1E6EBF;font-size:11px;"></i>
        <strong>{{ count }}</strong> people prayed
      </div>
    </div>
  `
});
if (document.getElementById('vue-prayer-counter')) {
  PrayerCounterApp.mount('#vue-prayer-counter');
}


// ---- 2. Modal ----
const ModalApp = createApp({
  setup() {
    const isOpen = ref(false);
    const modalSize = ref('md');

    const sizeLabels = { sm: 'Small (400px)', md: 'Medium (560px)', lg: 'Large (720px)' };

    function openModal(size) {
      modalSize.value = size;
      isOpen.value = true;
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      isOpen.value = false;
      document.body.style.overflow = '';
    }

    function handleBackdropClick(e) {
      if (e.target === e.currentTarget) closeModal();
    }

    function handleEscape(e) {
      if (e.key === 'Escape' && isOpen.value) closeModal();
    }

    onMounted(() => document.addEventListener('keydown', handleEscape));
    onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape));

    return { isOpen, modalSize, sizeLabels, openModal, closeModal, handleBackdropClick };
  },
  template: `
    <div>
      <div class="rf-demo-row">
        <button class="rf-btn rf-btn-primary" @click="openModal('sm')">
          <i class="fa-solid fa-up-right-and-down-left-from-center"></i> Open Small Modal
        </button>
        <button class="rf-btn rf-btn-secondary" @click="openModal('md')">
          <i class="fa-solid fa-up-right-and-down-left-from-center"></i> Open Medium Modal
        </button>
        <button class="rf-btn rf-btn-ghost" @click="openModal('lg')">
          <i class="fa-solid fa-up-right-and-down-left-from-center"></i> Open Large Modal
        </button>
      </div>

      <teleport to="body">
        <transition name="rf-modal-fade">
          <div
            v-if="isOpen"
            class="rf-modal-backdrop"
            role="dialog"
            aria-modal="true"
            :aria-label="'Modal — ' + sizeLabels[modalSize]"
            @click="handleBackdropClick">
            <div :class="['rf-modal-box', 'rf-modal-' + modalSize]" role="document">
              <div class="rf-modal-header">
                <h3 class="rf-modal-title">{{ sizeLabels[modalSize] }} Modal</h3>
                <button class="rf-modal-close" @click="closeModal" aria-label="Close modal">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div class="rf-modal-body">
                <p>This is a <strong>{{ modalSize }}</strong> modal dialog. It supports keyboard navigation — press <kbd style="background:#1F2937;color:#F9FAFB;padding:2px 8px;border-radius:4px;font-size:11px;font-family:monospace;border:1px solid #4B5563;box-shadow:0 1px 0 #4B5563;letter-spacing:0.5px;">Esc</kbd> to close, or click the backdrop.</p>
                <p>Modals in Rock Foundations support three sizes and include focus trapping, body scroll lock, and smooth fade-scale transitions. All accessibility requirements from WCAG AA are met.</p>
                <template v-if="modalSize === 'lg'">
                  <p>Large modals are ideal for forms, detailed views, or complex data entry — like adding a new person to a group, scheduling a volunteer, or configuring campus settings.</p>
                  <div style="background:#F8FAFC;border-radius:8px;padding:16px;margin-top:16px;">
                    <p style="margin:0;font-size:13px;color:#6B7280;">Rock RMS uses modal dialogs throughout its admin interface for person editing, group management, and workflow steps. This modal matches that design language.</p>
                  </div>
                </template>
              </div>
              <div class="rf-modal-footer">
                <button class="rf-btn rf-btn-ghost" @click="closeModal">Cancel</button>
                <button class="rf-btn rf-btn-primary" @click="closeModal">
                  <i class="fa-solid fa-check"></i> Confirm
                </button>
              </div>
            </div>
          </div>
        </transition>
      </teleport>
    </div>
  `
});
if (document.getElementById('vue-modal-app')) {
  ModalApp.mount('#vue-modal-app');
}


// ---- 3. Toast Notifications ----
const ToastApp = createApp({
  setup() {
    const toasts = reactive([]);
    let nextId = 0;

    const toastConfig = {
      success: { icon: 'fa-check',          title: 'Success!',   message: 'The group member has been added successfully.' },
      warning: { icon: 'fa-triangle-exclaim', title: 'Warning',    message: 'This person is already registered for this event.' },
      error:   { icon: 'fa-xmark',           title: 'Error',      message: 'Unable to save. Please check your connection and try again.' },
      info:    { icon: 'fa-info',            title: 'Info',       message: 'Rock RMS sync will run automatically at midnight.' }
    };

    function showToast(type) {
      const config = toastConfig[type];
      const id = ++nextId;
      const toast = { id, type, ...config, progress: 100 };
      toasts.unshift(toast);

      if (toasts.length > 4) toasts.pop();

      const start = Date.now();
      const duration = 4000;

      const interval = setInterval(function() {
        const elapsed = Date.now() - start;
        const pct = Math.max(0, 100 - (elapsed / duration) * 100);
        const t = toasts.find(function(t) { return t.id === id; });
        if (t) t.progress = pct;
        if (elapsed >= duration) {
          clearInterval(interval);
          dismissToast(id);
        }
      }, 50);

      toast._interval = interval;
    }

    function dismissToast(id) {
      const idx = toasts.findIndex(function(t) { return t.id === id; });
      if (idx !== -1) {
        if (toasts[idx]._interval) clearInterval(toasts[idx]._interval);
        toasts.splice(idx, 1);
      }
    }

    const iconMap = {
      success: 'fa-check',
      warning: 'fa-triangle-exclamation',
      error:   'fa-xmark',
      info:    'fa-circle-info'
    };

    return { toasts, showToast, dismissToast, iconMap };
  },
  template: `
    <div>
      <div class="rf-demo-row">
        <button class="rf-btn rf-btn-success" @click="showToast('success')">
          <i class="fa-solid fa-check"></i> Show Success
        </button>
        <button class="rf-btn rf-btn-warning" @click="showToast('warning')">
          <i class="fa-solid fa-triangle-exclamation"></i> Show Warning
        </button>
        <button class="rf-btn rf-btn-danger" @click="showToast('error')">
          <i class="fa-solid fa-xmark"></i> Show Error
        </button>
        <button class="rf-btn rf-btn-ghost" @click="showToast('info')">
          <i class="fa-solid fa-circle-info"></i> Show Info
        </button>
      </div>

      <teleport to="body">
        <div class="rf-toast-container" aria-live="polite" aria-atomic="false" role="status">
          <transition-group name="rf-toast-slide">
            <div
              v-for="toast in toasts"
              :key="toast.id"
              :class="['rf-toast', 'rf-toast-' + toast.type]"
              role="alert">
              <div class="rf-toast-content">
                <div class="rf-toast-icon">
                  <i :class="['fa-solid', iconMap[toast.type]]"></i>
                </div>
                <div class="rf-toast-body">
                  <div class="rf-toast-title">{{ toast.title }}</div>
                  <div class="rf-toast-message">{{ toast.message }}</div>
                </div>
                <button
                  class="rf-toast-dismiss"
                  @click="dismissToast(toast.id)"
                  aria-label="Dismiss notification">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div class="rf-toast-progress">
                <div
                  class="rf-toast-progress-bar"
                  :style="{ width: toast.progress + '%' }">
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </teleport>
    </div>
  `
});

// Add toast transition CSS dynamically
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .rf-toast-slide-enter-active { transition: all 0.3s ease; }
  .rf-toast-slide-leave-active { transition: all 0.25s ease; position: absolute; right: 0; }
  .rf-toast-slide-enter-from   { transform: translateX(100%); opacity: 0; }
  .rf-toast-slide-leave-to     { transform: translateX(100%); opacity: 0; }
  .rf-toast-slide-move          { transition: all 0.3s ease; }
`;
document.head.appendChild(toastStyle);

if (document.getElementById('vue-toasts-app')) {
  ToastApp.mount('#vue-toasts-app');
}


// ---- 4. Dropdown Menu ----
const DropdownApp = createApp({
  setup() {
    const isOpen = ref(false);
    let lastToast = null;

    function toggle() { isOpen.value = !isOpen.value; }

    function close() { isOpen.value = false; }

    function handleClickOutside(e) {
      const el = document.getElementById('vue-dropdown-app');
      if (el && !el.contains(e.target)) close();
    }

    function handleEscape(e) {
      if (e.key === 'Escape') close();
    }

    function selectItem(label) {
      close();
      const toast = document.getElementById('vue-toasts-app');
      if (window._rfToastInstance) {
        window._rfToastInstance.showToast('success');
      }
    }

    onMounted(function() {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    });

    onBeforeUnmount(function() {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    });

    const menuItems = [
      { icon: 'fa-eye',          label: 'View Profile',    section: 1 },
      { icon: 'fa-pen-to-square', label: 'Edit Person',    section: 1 },
      { icon: 'fa-users',         label: 'Add to Group',   section: 1 },
      { icon: 'fa-envelope',      label: 'Send Email',     section: 2 },
      { icon: 'fa-bell-slash',    label: 'Mute Notifications', section: 2, disabled: true },
      { icon: 'fa-trash-can',     label: 'Delete Record',  section: 3, destructive: true },
    ];

    return { isOpen, toggle, close, selectItem, menuItems };
  },
  template: `
    <div class="rf-dropdown">
      <button
        class="rf-btn rf-btn-secondary"
        @click.stop="toggle"
        :aria-expanded="isOpen"
        aria-haspopup="true">
        Actions
        <i class="fa-solid fa-chevron-down" style="font-size:10px;transition:transform 0.15s ease;" :style="{ transform: isOpen ? 'rotate(180deg)' : '' }"></i>
      </button>

      <transition
        enter-active-class="rf-dropdown-enter-active"
        leave-active-class="rf-dropdown-leave-active"
        enter-from-class="rf-dropdown-enter-from"
        leave-to-class="rf-dropdown-leave-to">
        <div v-if="isOpen" class="rf-dropdown-menu" role="menu" @click.stop>
          <template v-for="(item, i) in menuItems" :key="item.label">
            <div v-if="i > 0 && menuItems[i-1].section !== item.section" class="rf-dropdown-divider"></div>
            <button
              :class="[
                'rf-dropdown-item',
                item.destructive ? 'rf-dropdown-item-destructive' : '',
                item.disabled ? 'rf-dropdown-item-disabled' : ''
              ]"
              :disabled="item.disabled"
              role="menuitem"
              @click="selectItem(item.label)">
              <i :class="['fa-solid', item.icon]"></i>
              {{ item.label }}
            </button>
          </template>
        </div>
      </transition>
    </div>
  `
});

const dropdownStyle = document.createElement('style');
dropdownStyle.textContent = `
  .rf-dropdown-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
  .rf-dropdown-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
  .rf-dropdown-enter-from   { opacity: 0; transform: scaleY(0.9) translateY(-4px); }
  .rf-dropdown-leave-to     { opacity: 0; transform: scaleY(0.9) translateY(-4px); }
`;
document.head.appendChild(dropdownStyle);

if (document.getElementById('vue-dropdown-app')) {
  DropdownApp.mount('#vue-dropdown-app');
}


// ---- 5. Vue Tabs ----
const TabsApp = createApp({
  setup() {
    const activeTab = ref('overview');

    const tabs = [
      { id: 'overview',  label: 'Overview',  icon: 'fa-chart-simple' },
      { id: 'members',   label: 'Members',   icon: 'fa-users' },
      { id: 'events',    label: 'Events',    icon: 'fa-calendar' },
      { id: 'settings',  label: 'Settings',  icon: 'fa-gear' },
    ];

    function setTab(id) {
      activeTab.value = id;
      window.location.hash = id;
    }

    onMounted(function() {
      const hash = window.location.hash.slice(1);
      if (tabs.find(function(t) { return t.id === hash; })) activeTab.value = hash;
    });

    const memberList = [
      { initials: 'SM', color: 'rf-avatar-blue',   name: 'Sarah Mitchell',  role: 'Group Leader',       status: 'active' },
      { initials: 'JT', color: 'rf-avatar-green',  name: 'James Torres',    role: 'Member',             status: 'active' },
      { initials: 'LN', color: 'rf-avatar-purple', name: 'Lisa Nguyen',     role: 'Member',             status: 'pending' },
    ];

    const eventList = [
      { icon: 'fa-church', title: 'Sunday Worship Night',   date: 'Sun, Apr 27 · 6:00 PM',  location: 'Main Auditorium' },
      { icon: 'fa-users',  title: 'Young Adults Gathering', date: 'Wed, Apr 30 · 7:00 PM',  location: 'Room 214' },
    ];

    const settings = [
      { label: 'Open Enrollment', desc: 'Allow anyone to join this group',  enabled: true },
      { label: 'Email Digest',    desc: 'Send weekly group activity email', enabled: true },
      { label: 'Public Listing',  desc: 'Show group in the public directory', enabled: false },
    ];

    const settingState = reactive(settings.map(function(s) { return { ...s }; }));

    return { activeTab, tabs, setTab, memberList, eventList, settingState };
  },
  template: `
    <div class="rf-vue-tabs">
      <div class="rf-vue-tab-list" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['rf-vue-tab-btn', activeTab === tab.id ? 'active' : '']"
          :aria-selected="activeTab === tab.id"
          :aria-controls="'tab-panel-' + tab.id"
          role="tab"
          @click="setTab(tab.id)">
          <i :class="['fa-solid', tab.icon]" style="margin-right:6px;font-size:12px;"></i>
          {{ tab.label }}
        </button>
      </div>

      <div class="rf-vue-tab-content">

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" :id="'tab-panel-overview'" role="tabpanel">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
            <div style="background:var(--rf-card-bg,#fff);border:1px solid #D1D5DB;border-radius:8px;padding:16px;text-align:center;">
              <div style="font-size:28px;font-weight:700;color:#1F2937;">14</div>
              <div style="font-size:12px;color:#6B7280;margin-top:4px;">Active Members</div>
            </div>
            <div style="background:var(--rf-card-bg,#fff);border:1px solid #D1D5DB;border-radius:8px;padding:16px;text-align:center;">
              <div style="font-size:28px;font-weight:700;color:#15803D;">87%</div>
              <div style="font-size:12px;color:#6B7280;margin-top:4px;">Attendance Rate</div>
            </div>
            <div style="background:var(--rf-card-bg,#fff);border:1px solid #D1D5DB;border-radius:8px;padding:16px;text-align:center;">
              <div style="font-size:28px;font-weight:700;color:#1E6EBF;">3</div>
              <div style="font-size:12px;color:#6B7280;margin-top:4px;">Upcoming Events</div>
            </div>
          </div>
        </div>

        <!-- Members Tab -->
        <div v-if="activeTab === 'members'" :id="'tab-panel-members'" role="tabpanel">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div
              v-for="member in memberList"
              :key="member.name"
              style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1px solid #D1D5DB;border-radius:8px;background:#fff;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div :class="['rf-avatar rf-avatar-md', member.color]">{{ member.initials }}</div>
                <div>
                  <div style="font-weight:600;font-size:14px;color:#1F2937;">{{ member.name }}</div>
                  <div style="font-size:12px;color:#6B7280;">{{ member.role }}</div>
                </div>
              </div>
              <span :class="['rf-status-badge', 'rf-status-' + member.status]">
                <span class="rf-status-dot"></span>
                {{ member.status.charAt(0).toUpperCase() + member.status.slice(1) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Events Tab -->
        <div v-if="activeTab === 'events'" :id="'tab-panel-events'" role="tabpanel">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div
              v-for="event in eventList"
              :key="event.title"
              style="display:flex;align-items:center;gap:16px;padding:16px;border:1px solid #D1D5DB;border-radius:8px;background:#fff;">
              <div style="width:44px;height:44px;border-radius:10px;background:#EBF4FF;color:#1E6EBF;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">
                <i :class="['fa-solid', event.icon]"></i>
              </div>
              <div style="flex:1;">
                <div style="font-weight:600;font-size:14px;color:#1F2937;">{{ event.title }}</div>
                <div style="font-size:12px;color:#6B7280;margin-top:2px;">
                  <i class="fa-solid fa-calendar" style="margin-right:4px;"></i>{{ event.date }}
                </div>
                <div style="font-size:12px;color:#6B7280;margin-top:1px;">
                  <i class="fa-solid fa-location-dot" style="margin-right:4px;"></i>{{ event.location }}
                </div>
              </div>
              <button class="rf-btn rf-btn-ghost rf-btn-sm">RSVP</button>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" :id="'tab-panel-settings'" role="tabpanel">
          <div style="display:flex;flex-direction:column;gap:0;">
            <div
              v-for="(setting, i) in settingState"
              :key="setting.label"
              style="display:flex;align-items:center;justify-content:space-between;padding:16px 0;"
              :style="{ borderBottom: i < settingState.length - 1 ? '1px solid #F3F4F6' : 'none' }">
              <div>
                <div style="font-weight:600;font-size:14px;color:#1F2937;">{{ setting.label }}</div>
                <div style="font-size:12px;color:#6B7280;margin-top:2px;">{{ setting.desc }}</div>
              </div>
              <label class="rf-toggle-wrapper" :aria-label="setting.label">
                <input type="checkbox" v-model="setting.enabled">
                <div class="rf-toggle"></div>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
});
if (document.getElementById('vue-tabs-app')) {
  TabsApp.mount('#vue-tabs-app');
}
