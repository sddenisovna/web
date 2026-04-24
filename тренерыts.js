/* тренеры/тренерыts.ts */
var trainersData = [
  {
    id: 1,
    name: "Анжелика Джоли",
    type: "групповой",
    specialty: "йога",
    experience: 19,
    club: "Железнодорожный",
    image: "https://i.pinimg.com/736x/0c/07/b3/0c07b328bdd49adff1dff143bd282f04.jpg",
    pageUrl: "../джоли/джолиhtml.html"
  },
  {
    id: 2,
    name: "Александра Йоханссон",
    type: "групповой",
    specialty: "пилатес",
    experience: 6,
    club: "Ленинский",
    image: "https://i.playground.ru/e/ICeV7ma97FRmRuNYaiEmig.jpeg",
    pageUrl: "../йоханссон/йоханссонhtml.html"
  },
  {
    id: 3,
    name: "Карина Кардашьян",
    type: "групповой",
    specialty: "танцы, пилатес",
    experience: 10,
    club: "Самарский",
    image: "https://avatars.mds.yandex.net/i?id=641981fb2b61cad86ef95b2993b9f3a2_l-5336269-images-thumbs&n=13",
    pageUrl: "../кардашьян/кардашьянhtml.html"
  },
  {
    id: 4,
    name: "Софья Суини",
    type: "персональный",
    specialty: "стрейчинг, силовые",
    experience: 5,
    club: "Советский",
    image: "https://s.yimg.com/ny/api/res/1.2/uw5NLSelFYqCuGmztZkNKQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTU0MDtjZj13ZWJw/https://media.zenfs.com/en/us_magazine_896/37d58a873dd2830449676ca62872c874",
    pageUrl: "../суини/суиниhtml.html"
  }
];
function getElement(id) {
  const element = document.getElementById(id);
  if (!element)
    throw new Error(`Элемент с id "${id}" не найден`);
  return element;
}
function getOptionalElement(id) {
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
function goToTrainerPage(url) {
  if (url) {
    window.location.href = url;
  } else {
    showNotification("\uD83D\uDE15 страница тренера в разработке", true);
  }
}
function renderTrainers() {
  const container = getElement("trainersGrid");
  const typeFilter = getOptionalElement("typeFilter")?.value || "all";
  const clubFilter = getOptionalElement("clubFilter")?.value || "all";
  const specialtyFilter = getOptionalElement("specialtyFilter")?.value || "all";
  const filtered = trainersData.filter((trainer) => {
    if (typeFilter !== "all" && trainer.type !== typeFilter)
      return false;
    if (clubFilter !== "all" && trainer.club !== clubFilter)
      return false;
    if (specialtyFilter !== "all" && !trainer.specialty.includes(specialtyFilter))
      return false;
    return true;
  });
  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 60px; color: #515152;">\uD83D\uDE14 ничего не найдено</div>`;
    return;
  }
  container.innerHTML = filtered.map((trainer) => `
        <div class="trainer-card" data-url="${trainer.pageUrl}">
            <div class="trainer-photo">
                <img src="${trainer.image}" alt="${trainer.name}" loading="lazy">
            </div>
            <div class="trainer-info">
                <div class="trainer-name">${trainer.name}</div>
                <div class="trainer-type">${trainer.type === "персональный" ? "персональный тренер" : "тренер групповых"}</div>
                <div class="trainer-stats">
                    <span class="stat-badge"><i class="fas fa-clock"></i> стаж ${trainer.experience} лет</span>
                    <span class="stat-badge"><i class="fas fa-tag"></i> ${trainer.specialty}</span>
                </div>
                <div class="trainer-club">
                    <i class="fas fa-location-dot"></i> ${trainer.club}
                </div>
                <div class="card-buttons">
                    <button class="btn-detail" data-id="${trainer.id}">подробнее</button>
                    <button class="btn-schedule" data-id="${trainer.id}">посмотреть расписание</button>
                </div>
            </div>
        </div>
    `).join("");
  document.querySelectorAll(".trainer-card").forEach((card) => {
    const url = card.getAttribute("data-url");
    card.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("btn-detail") || target.classList.contains("btn-schedule")) {
        return;
      }
      if (url)
        goToTrainerPage(url);
    });
  });
  document.querySelectorAll(".btn-detail").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute("data-id") || "0");
      const trainer = trainersData.find((t) => t.id === id);
      if (trainer)
        goToTrainerPage(trainer.pageUrl);
    });
  });
  document.querySelectorAll(".btn-schedule").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute("data-id") || "0");
      const trainer = trainersData.find((t) => t.id === id);
      if (trainer)
        showNotification(`\uD83D\uDCC5 расписание тренера ${trainer.name} появится скоро`);
    });
  });
}
function resetFilters() {
  const typeFilter = getOptionalElement("typeFilter");
  const clubFilter = getOptionalElement("clubFilter");
  const specialtyFilter = getOptionalElement("specialtyFilter");
  if (typeFilter)
    typeFilter.value = "all";
  if (clubFilter)
    clubFilter.value = "all";
  if (specialtyFilter)
    specialtyFilter.value = "all";
  renderTrainers();
  showNotification("\uD83D\uDD0D фильтры сброшены");
}
function bindEvents() {
  const typeFilter = getOptionalElement("typeFilter");
  const clubFilter = getOptionalElement("clubFilter");
  const specialtyFilter = getOptionalElement("specialtyFilter");
  const resetBtn = getOptionalElement("resetFilters");
  typeFilter?.addEventListener("change", renderTrainers);
  clubFilter?.addEventListener("change", renderTrainers);
  specialtyFilter?.addEventListener("change", renderTrainers);
  resetBtn?.addEventListener("click", resetFilters);
}
function initModal() {
  const modal = getOptionalElement("auth-modal");
  const closeBtn = getOptionalElement("modalCloseBtn");
  const loginBtn = getOptionalElement("loginBtn");
  const loginTab = document.querySelector('[data-tab="login"]');
  const registerTab = document.querySelector('[data-tab="register"]');
  const loginForm = getOptionalElement("login-form");
  const registerForm = getOptionalElement("register-form");
  const switchToRegister = getOptionalElement("switch-to-register");
  const switchToLogin = getOptionalElement("switch-to-login");
  const loginSubmit = getOptionalElement("login-submit-btn");
  const registerSubmit = getOptionalElement("register-submit-btn");
  function closeModal() {
    modal?.classList.remove("active");
  }
  function openModal2() {
    modal?.classList.add("active");
  }
  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal)
      closeModal();
  });
  loginBtn?.addEventListener("click", openModal2);
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
  loginSubmit?.addEventListener("click", () => {
    const email = getOptionalElement("login-email")?.value;
    const password = getOptionalElement("login-password")?.value;
    if (!email || !password) {
      showNotification("пожалуйста, заполните все поля", true);
      return;
    }
    if (window.authAPI) {
      const result = window.authAPI.login(email, password);
      if (result.success) {
        showNotification(result.message);
        closeModal();
        const currentUser = window.authAPI.getCurrentUser();
        if (currentUser && loginBtn) {
          loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        }
      } else {
        showNotification(result.message, true);
      }
    } else {
      showNotification(`✨ добро пожаловать, ${email.split("@")[0]}! ✨`);
      closeModal();
    }
    const loginEmail = getOptionalElement("login-email");
    const loginPassword = getOptionalElement("login-password");
    if (loginEmail)
      loginEmail.value = "";
    if (loginPassword)
      loginPassword.value = "";
  });
  registerSubmit?.addEventListener("click", () => {
    const name = getOptionalElement("register-name")?.value;
    const email = getOptionalElement("register-email")?.value;
    const phone = getOptionalElement("register-phone")?.value;
    const password = getOptionalElement("register-password")?.value;
    if (!name || !email || !password) {
      showNotification("пожалуйста, заполните имя, email и пароль", true);
      return;
    }
    if (password.length < 4) {
      showNotification("пароль должен быть не менее 4 символов", true);
      return;
    }
    if (window.authAPI) {
      const result = window.authAPI.register(name, email, phone, password);
      if (result.success) {
        showNotification(result.message);
        closeModal();
        const currentUser = window.authAPI.getCurrentUser();
        if (currentUser && loginBtn) {
          loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        }
      } else {
        showNotification(result.message, true);
      }
    } else {
      showNotification(`✨ ${name}, добро пожаловать в точку баланса! ✨`);
      closeModal();
    }
    const regName = getOptionalElement("register-name");
    const regEmail = getOptionalElement("register-email");
    const regPhone = getOptionalElement("register-phone");
    const regPassword = getOptionalElement("register-password");
    if (regName)
      regName.value = "";
    if (regEmail)
      regEmail.value = "";
    if (regPhone)
      regPhone.value = "";
    if (regPassword)
      regPassword.value = "";
  });
}
function checkAuthOnLoad() {
  const loginBtn = getOptionalElement("loginBtn");
  if (window.authAPI && window.authAPI.isLoggedIn()) {
    const currentUser = window.authAPI.getCurrentUser();
    if (currentUser && loginBtn) {
      loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
    }
  }
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
function init() {
  renderTrainers();
  bindEvents();
  initModal();
  initSubscription();
  initStickyHeader();
  checkAuthOnLoad();
}
document.addEventListener("DOMContentLoaded", init);
function updateLoginButton() {
  const loginBtn = document.getElementById("loginBtn");
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
    loginBtn.onclick = () => {
      openModal();
    };
  }
}
updateLoginButton();
