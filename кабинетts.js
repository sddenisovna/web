/* кабинет/кабинетts.ts */
console.log(" Кабинетts.ts загружен");
var currentUser = {
  id: 0,
  name: "",
  email: "",
  phone: "",
  registeredAt: ""
};
var myTrainings = [];
var mySubscriptions = [];
function showNotification(message, isError = false) {
  let toast = document.querySelector(".toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.background = isError ? "#f44336" : "#ff99b8";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}
function getCurrentUserId() {
  const user = localStorage.getItem("tochka_balance_current_user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.id || userData.email;
    } catch (e) {
      console.error("Ошибка парсинга пользователя:", e);
    }
  }
  return null;
}
function loadData() {
  const savedUser = localStorage.getItem("tochka_balance_current_user");
  console.log(" Загрузка пользователя:", savedUser);
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      currentUser = {
        id: user.id || 0,
        name: user.name || "Гость",
        email: user.email || "",
        phone: user.phone || "",
        registeredAt: user.registeredAt || new Date().toLocaleDateString("ru-RU")
      };
    } catch (e) {
      console.error("Ошибка парсинга пользователя:", e);
    }
  } else {
    console.log("Пользователь не авторизован");
  }
  const userId = getCurrentUserId();
  if (userId) {
    const trainingsKey = `myTrainings_${userId}`;
    const savedTrainings = localStorage.getItem(trainingsKey);
    if (savedTrainings) {
      try {
        myTrainings = JSON.parse(savedTrainings);
        console.log(` Загружено тренировок для ${userId}:`, myTrainings.length);
      } catch (e) {}
    } else {
      myTrainings = [];
    }
    const subscriptionsKey = `mySubscriptions_${userId}`;
    const savedSubscriptions = localStorage.getItem(subscriptionsKey);
    if (savedSubscriptions) {
      try {
        mySubscriptions = JSON.parse(savedSubscriptions);
        console.log(`\uD83C\uDFAB Загружено абонементов для ${userId}:`, mySubscriptions.length);
      } catch (e) {
        console.error("Ошибка парсинга абонементов:", e);
      }
    } else {
      mySubscriptions = [];
      console.log("\uD83C\uDFAB Абонементов пока нет");
    }
  } else {
    myTrainings = [];
    mySubscriptions = [];
  }
}
function updateProfileUI() {
  const userNameEl = document.getElementById("userName");
  const userEmailEl = document.getElementById("userEmail");
  const profileNameEl = document.getElementById("profileName");
  const profileEmailEl = document.getElementById("profileEmail");
  const profilePhoneEl = document.getElementById("profilePhone");
  const profileDateEl = document.getElementById("profileDate");
  if (userNameEl)
    userNameEl.textContent = currentUser.name;
  if (userEmailEl)
    userEmailEl.textContent = currentUser.email;
  if (profileNameEl)
    profileNameEl.textContent = currentUser.name;
  if (profileEmailEl)
    profileEmailEl.textContent = currentUser.email;
  if (profilePhoneEl)
    profilePhoneEl.textContent = currentUser.phone;
  if (profileDateEl)
    profileDateEl.textContent = currentUser.registeredAt;
}
function renderTrainings() {
  const container = document.getElementById("trainingsList");
  if (!container) {
    console.error("❌ trainingsList не найден");
    return;
  }
  console.log("\uD83D\uDCCB Рендер тренировок, всего:", myTrainings.length);
  if (myTrainings.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-alt"></i>
                <p>у вас пока нет записей</p>
                <p style="font-size: 0.8rem;">запишитесь на тренировку в каталоге</p>
            </div>
        `;
    return;
  }
  container.innerHTML = myTrainings.map((t) => `
        <div class="training-item" data-id="${t.id}">
            <div class="training-info">
                <h4>${t.title}</h4>
                <p>${t.trainer} • ${t.time} • ${t.district}</p>
            </div>
            <button class="cancel-btn" data-id="${t.id}">отменить</button>
        </div>
    `).join("");
  document.querySelectorAll(".cancel-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute("data-id") || "0");
      const index = myTrainings.findIndex((t) => t.id === id);
      if (index !== -1) {
        myTrainings.splice(index, 1);
        const userId = getCurrentUserId();
        if (userId) {
          localStorage.setItem(`myTrainings_${userId}`, JSON.stringify(myTrainings));
        }
        renderTrainings();
        showNotification("✖️ запись отменена");
      }
    });
  });
}
function renderSubscriptions() {
  const container = document.getElementById("subscriptionsList");
  if (!container) {
    console.error("❌ subscriptionsList не найден");
    return;
  }
  console.log("\uD83C\uDFAB Рендер абонементов, всего:", mySubscriptions.length);
  if (mySubscriptions.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ticket-alt"></i>
                <p>у вас пока нет абонементов</p>
                <p style="font-size: 0.8rem;">приобретите абонемент в соответствующем разделе</p>
            </div>
        `;
    return;
  }
  container.innerHTML = mySubscriptions.map((sub) => `
        <div class="subscription-item">
            <h4>${sub.name}</h4>
            <p>${sub.price} • ${sub.period}</p>
            <p>действует до: ${sub.validUntil}</p>
            <span class="subscription-status status-active">активен</span>
        </div>
    `).join("");
  console.log("✅ Абонементы отрендерены, количество:", mySubscriptions.length);
}
function initClearSubscriptions() {
  const clearBtn = document.getElementById("clearSubscriptionsBtn");
  if (!clearBtn)
    return;
  clearBtn.addEventListener("click", () => {
    if (confirm("Очистить все ваши абонементы? Это действие нельзя отменить.")) {
      const userId = getCurrentUserId();
      if (userId) {
        localStorage.removeItem(`mySubscriptions_${userId}`);
        mySubscriptions = [];
        renderSubscriptions();
        showNotification("✅ Все абонементы удалены");
      }
    }
  });
}
function initTabs() {
  const profileTabBtn = document.querySelector('[data-tab="profile"]');
  const trainingsTabBtn = document.querySelector('[data-tab="trainings"]');
  const subscriptionsTabBtn = document.querySelector('[data-tab="subscriptions"]');
  const profileTab = document.getElementById("profile-tab");
  const trainingsTab = document.getElementById("trainings-tab");
  const subscriptionsTab = document.getElementById("subscriptions-tab");
  function showTab(tabId) {
    if (profileTab)
      profileTab.style.display = "none";
    if (trainingsTab)
      trainingsTab.style.display = "none";
    if (subscriptionsTab)
      subscriptionsTab.style.display = "none";
    if (tabId === "profile" && profileTab) {
      profileTab.style.display = "block";
    } else if (tabId === "trainings" && trainingsTab) {
      trainingsTab.style.display = "block";
      renderTrainings();
    } else if (tabId === "subscriptions" && subscriptionsTab) {
      subscriptionsTab.style.display = "block";
      renderSubscriptions();
    }
    const allBtns = [profileTabBtn, trainingsTabBtn, subscriptionsTabBtn];
    allBtns.forEach((btn) => {
      if (btn) {
        if (btn.getAttribute("data-tab") === tabId) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      }
    });
  }
  if (profileTabBtn) {
    profileTabBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showTab("profile");
    });
  }
  if (trainingsTabBtn) {
    trainingsTabBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showTab("trainings");
    });
  }
  if (subscriptionsTabBtn) {
    subscriptionsTabBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showTab("subscriptions");
    });
  }
  showTab("profile");
}
function initEditProfile() {
  const editBtn = document.getElementById("editProfileBtn");
  if (!editBtn)
    return;
  editBtn.addEventListener("click", () => {
    const newName = prompt("Введите новое имя:", currentUser.name);
    if (newName && newName.trim()) {
      currentUser.name = newName;
      localStorage.setItem("tochka_balance_current_user", JSON.stringify({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone
      }));
      updateProfileUI();
      showNotification("✅ имя обновлено");
    }
    const newPhone = prompt("Введите новый телефон:", currentUser.phone);
    if (newPhone && newPhone.trim()) {
      currentUser.phone = newPhone;
      localStorage.setItem("tochka_balance_current_user", JSON.stringify({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone
      }));
      updateProfileUI();
      showNotification("✅ телефон обновлён");
    }
  });
}
function initLogout() {
  const logoutBtns = document.querySelectorAll("#logoutBtn, #logoutSidebarBtn");
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (confirm("Вы уверены, что хотите выйти?")) {
        localStorage.removeItem("tochka_balance_current_user");
        window.location.href = "../главная/главнаяhtml.html";
      }
    });
  });
}
function initStickyHeader() {
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10)
        header.classList.add("scrolled");
      else
        header.classList.remove("scrolled");
    });
  }
}
window.addTraining = function(training) {
  const userId = getCurrentUserId();
  if (!userId) {
    showNotification("ошибка: пользователь не найден", true);
    return false;
  }
  myTrainings.push(training);
  localStorage.setItem(`myTrainings_${userId}`, JSON.stringify(myTrainings));
  showNotification(` Вы записаны на "${training.title}"!`);
  return true;
};
window.addSubscription = function(subscription) {
  const userId = getCurrentUserId();
  if (!userId) {
    showNotification("ошибка: пользователь не найден", true);
    return false;
  }
  mySubscriptions.push(subscription);
  localStorage.setItem(`mySubscriptions_${userId}`, JSON.stringify(mySubscriptions));
  console.log(" Абонемент добавлен в кабинет:", subscription);
  showNotification(` Абонемент "${subscription.name}" приобретён!`);
  return true;
};
function init() {
  console.log(" init() вызван");
  loadData();
  updateProfileUI();
  renderTrainings();
  renderSubscriptions();
  initTabs();
  initEditProfile();
  initLogout();
  initStickyHeader();
  initClearSubscriptions();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
