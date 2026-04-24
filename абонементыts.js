/* абонементы/абонементыts.ts */
console.log(" абонементыts.ts загружен");
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
function saveToCabinet(subName) {
  const userId = getCurrentUserId();
  if (!userId) {
    showNotification("ошибка: пользователь не найден", true);
    return;
  }
  const storageKey = `mySubscriptions_${userId}`;
  const existing = localStorage.getItem(storageKey);
  let subscriptions = [];
  if (existing) {
    try {
      subscriptions = JSON.parse(existing);
      console.log(` Существующие абонементы для ${userId}:`, subscriptions);
    } catch (e) {
      console.error("Ошибка парсинга", e);
    }
  }
  const priceMap = {
    "старт": "2 500 ₽",
    "актив": "3 000 ₽",
    "премиум": "7 900 ₽",
    "безлимит": "4 990 ₽"
  };
  const newSubscription = {
    id: Date.now(),
    name: subName,
    price: priceMap[subName] || "уточняйте",
    period: "/ месяц",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("ru-RU")
  };
  subscriptions.push(newSubscription);
  localStorage.setItem(storageKey, JSON.stringify(subscriptions));
  console.log(` СОХРАНЁН АБОНЕМЕНТ для ${userId}:`, newSubscription);
  console.log(` ТЕПЕРЬ ВСЕГО АБОНЕМЕНТОВ у ${userId}:`, subscriptions.length);
  showNotification(` Абонемент "${subName}" оформлен! `);
}
function updateLoginButton() {
  const loginBtn = document.getElementById("loginBtn");
  if (!loginBtn)
    return;
  const user = localStorage.getItem("tochka_balance_current_user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${userData.name}`;
      loginBtn.onclick = () => {
        window.location.href = "../кабинет/Кабинетhtml.html";
      };
    } catch (e) {}
  } else {
    loginBtn.innerHTML = `<i class="fas fa-user"></i> войти`;
    loginBtn.onclick = () => {
      const modal = document.getElementById("auth-modal");
      if (modal)
        modal.classList.add("active");
    };
  }
}
window.selectSubscription = function(subName) {
  console.log(" ВЫБРАН АБОНЕМЕНТ:", subName);
  const userId = getCurrentUserId();
  if (userId) {
    saveToCabinet(subName);
  } else {
    window.pendingSubscription = subName;
    const infoBlock = document.getElementById("modalTrainingInfo");
    if (infoBlock) {
      infoBlock.style.display = "block";
      infoBlock.innerHTML = `
                <p><strong>\uD83D\uDCCB вы выбрали абонемент:</strong></p>
                <p><strong>${subName}</strong></p>
                <p>для оформления войдите или зарегистрируйтесь</p>
            `;
    }
    const modal = document.getElementById("auth-modal");
    if (modal)
      modal.classList.add("active");
  }
};
function initButtons() {
  const btns = document.querySelectorAll(".sub-bubble__btn");
  console.log(" Найдено кнопок:", btns.length);
  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const subName = btn.getAttribute("data-sub");
      if (subName) {
        window.selectSubscription(subName);
      }
    });
  });
}
function initModal() {
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.getElementById("modalCloseBtn");
  if (closeBtn) {
    closeBtn.onclick = () => modal?.classList.remove("active");
  }
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal)
        modal.classList.remove("active");
    };
  }
  const loginSubmit = document.getElementById("login-submit-btn");
  if (loginSubmit) {
    loginSubmit.onclick = () => {
      const email = document.getElementById("login-email")?.value;
      const password = document.getElementById("login-password")?.value;
      if (!email || !password) {
        showNotification("заполните все поля", true);
        return;
      }
      const userName = email.split("@")[0];
      const userId = Date.now().toString();
      localStorage.setItem("tochka_balance_current_user", JSON.stringify({
        id: userId,
        name: userName,
        email
      }));
      showNotification(` Добро пожаловать, ${userName}! `);
      modal?.classList.remove("active");
      updateLoginButton();
      const pending = window.pendingSubscription;
      if (pending) {
        saveToCabinet(pending);
        window.pendingSubscription = null;
      }
      document.getElementById("login-email").value = "";
      document.getElementById("login-password").value = "";
    };
  }
  const registerSubmit = document.getElementById("register-submit-btn");
  if (registerSubmit) {
    registerSubmit.onclick = () => {
      const name = document.getElementById("register-name")?.value;
      const email = document.getElementById("register-email")?.value;
      const phone = document.getElementById("register-phone")?.value;
      const password = document.getElementById("register-password")?.value;
      if (!name || !email || !password) {
        showNotification("заполните имя, email и пароль", true);
        return;
      }
      const userId = Date.now().toString();
      localStorage.setItem("tochka_balance_current_user", JSON.stringify({
        id: userId,
        name,
        email,
        phone
      }));
      showNotification(` ${name}, добро пожаловать! `);
      modal?.classList.remove("active");
      updateLoginButton();
      const pending = window.pendingSubscription;
      if (pending) {
        saveToCabinet(pending);
        window.pendingSubscription = null;
      }
      document.getElementById("register-name").value = "";
      document.getElementById("register-email").value = "";
      document.getElementById("register-phone").value = "";
      document.getElementById("register-password").value = "";
    };
  }
  const loginTab = document.querySelector('[data-tab="login"]');
  const registerTab = document.querySelector('[data-tab="register"]');
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  if (loginTab && registerTab) {
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      if (loginForm)
        loginForm.style.display = "block";
      if (registerForm)
        registerForm.style.display = "none";
    });
    registerTab.addEventListener("click", () => {
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
      if (loginForm)
        loginForm.style.display = "none";
      if (registerForm)
        registerForm.style.display = "block";
    });
  }
}
function init() {
  console.log(" Инициализация страницы абонементов");
  initButtons();
  initModal();
  updateLoginButton();
}
init();
console.log(" Абонементы готовы!");
