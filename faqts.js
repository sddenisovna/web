/* вопросы/faqts.ts */
console.log("✅ faqts.ts загружен");
function getElement(id) {
  return document.getElementById(id);
}
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
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
function initEmailButton() {
  const emailBtn = document.getElementById("emailBtn");
  if (emailBtn) {
    emailBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const email = "support@tochkaofbalance.ru";
      navigator.clipboard.writeText(email).then(() => {
        showNotification("\uD83D\uDCE7 email скопирован! support@tochkaofbalance.ru");
      }).catch(() => {
        showNotification("\uD83D\uDCE7 support@tochkaofbalance.ru", true);
      });
    });
  }
}
function updateLoginButton() {
  const loginBtn = document.querySelector(".header .btn-outline");
  if (!loginBtn)
    return;
  if (window.authAPI && window.authAPI.isLoggedIn()) {
    const user = window.authAPI.getCurrentUser();
    if (user) {
      loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name}`;
      loginBtn.onclick = () => {
        window.location.href = "../кабинет/Кабинетhtml.html";
      };
    }
  } else {
    loginBtn.innerHTML = `<i class="fas fa-user"></i> войти`;
    loginBtn.onclick = () => openModal();
  }
}
function initFaqAccordion() {
  const details = document.querySelectorAll(".faq-item");
  details.forEach((detail) => {
    detail.addEventListener("toggle", (e) => {
      const target = e.target;
      if (target.open) {
        const summary = target.querySelector("summary");
        if (summary) {
          summary.style.fontWeight = "600";
        }
      } else {
        const summary = target.querySelector("summary");
        if (summary) {
          summary.style.fontWeight = "500";
        }
      }
    });
  });
}
var selectedAction = null;
function openModal() {
  const modal = getElement("auth-modal");
  if (modal)
    modal.classList.add("active");
}
function closeModal() {
  const modal = getElement("auth-modal");
  if (modal)
    modal.classList.remove("active");
}
function initModal() {
  const modal = getElement("auth-modal");
  const closeBtn = getElement("modalCloseBtn");
  const loginHeaderBtn = document.querySelector(".header .btn-outline");
  const loginTab = document.querySelector('[data-tab="login"]');
  const registerTab = document.querySelector('[data-tab="register"]');
  const loginForm = getElement("login-form");
  const registerForm = getElement("register-form");
  const switchToRegister = getElement("switch-to-register");
  const switchToLogin = getElement("switch-to-login");
  const loginSubmit = getElement("login-submit-btn");
  const registerSubmit = getElement("register-submit-btn");
  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal)
      closeModal();
  });
  loginHeaderBtn?.addEventListener("click", () => {
    selectedAction = null;
    openModal();
  });
  function switchTab(tab) {
    if (tab === "login") {
      loginTab?.classList.add("active");
      registerTab?.classList.remove("active");
      loginForm?.classList.add("active");
      registerForm?.classList.remove("active");
    } else {
      loginTab?.classList.remove("active");
      registerTab?.classList.add("active");
      loginForm?.classList.remove("active");
      registerForm?.classList.add("active");
    }
  }
  loginTab?.addEventListener("click", () => switchTab("login"));
  registerTab?.addEventListener("click", () => switchTab("register"));
  switchToRegister?.addEventListener("click", () => switchTab("register"));
  switchToLogin?.addEventListener("click", () => switchTab("login"));
  loginSubmit?.addEventListener("click", async () => {
    const email = getElement("login-email")?.value || "";
    const password = getElement("login-password")?.value || "";
    if (!email || !password) {
      showNotification("пожалуйста, заполните все поля", true);
      return;
    }
    if (window.authAPI) {
      const result = await window.authAPI.login(email, password);
      if (result.success) {
        showNotification(result.message);
        closeModal();
        updateLoginButton();
        const loginEmail = getElement("login-email");
        const loginPassword = getElement("login-password");
        if (loginEmail)
          loginEmail.value = "";
        if (loginPassword)
          loginPassword.value = "";
      } else {
        showNotification(result.message, true);
      }
    } else {
      showNotification(`✨ добро пожаловать, ${email.split("@")[0]}! ✨`);
      closeModal();
      updateLoginButton();
      const loginEmail = getElement("login-email");
      const loginPassword = getElement("login-password");
      if (loginEmail)
        loginEmail.value = "";
      if (loginPassword)
        loginPassword.value = "";
    }
  });
  registerSubmit?.addEventListener("click", async () => {
    const name = getElement("register-name")?.value || "";
    const email = getElement("register-email")?.value || "";
    const phone = getElement("register-phone")?.value || "";
    const password = getElement("register-password")?.value || "";
    if (!name || !email || !password) {
      showNotification("пожалуйста, заполните имя, email и пароль", true);
      return;
    }
    if (password.length < 4) {
      showNotification("пароль должен быть не менее 4 символов", true);
      return;
    }
    if (window.authAPI) {
      const result = await window.authAPI.register(name, email, phone, password);
      if (result.success) {
        showNotification(result.message);
        closeModal();
        updateLoginButton();
        const regName = getElement("register-name");
        const regEmail = getElement("register-email");
        const regPhone = getElement("register-phone");
        const regPassword = getElement("register-password");
        if (regName)
          regName.value = "";
        if (regEmail)
          regEmail.value = "";
        if (regPhone)
          regPhone.value = "";
        if (regPassword)
          regPassword.value = "";
      } else {
        showNotification(result.message, true);
      }
    } else {
      showNotification(`✨ ${name}, добро пожаловать в точку баланса! ✨`);
      closeModal();
      updateLoginButton();
      const regName = getElement("register-name");
      const regEmail = getElement("register-email");
      const regPhone = getElement("register-phone");
      const regPassword = getElement("register-password");
      if (regName)
        regName.value = "";
      if (regEmail)
        regEmail.value = "";
      if (regPhone)
        regPhone.value = "";
      if (regPassword)
        regPassword.value = "";
    }
  });
}
function initSubscription() {
  const subscribeBtns = document.querySelectorAll(".footer-col .btn-primary");
  subscribeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".footer-col");
      const input = parent?.querySelector('input[type="email"]');
      if (input && input.value) {
        showNotification(`\uD83D\uDC8C спасибо за подписку! письма будут приходить на ${input.value}`);
        input.value = "";
      } else {
        showNotification("пожалуйста, введите e-mail", true);
      }
    });
  });
}
function initStickyHeader() {
  const header = document.querySelector(".header");
  if (!header)
    return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}
function initScrollAnimation() {
  const elements = document.querySelectorAll(".faq-category, .contact-section");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(element);
  });
}
function init() {
  console.log("\uD83D\uDE80 init() вызван");
  initEmailButton();
  initFaqAccordion();
  initModal();
  initSubscription();
  initStickyHeader();
  updateLoginButton();
  initScrollAnimation();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
