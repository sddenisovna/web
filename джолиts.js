/* джоли/джолиts.ts */
console.log("✅ джолиts.ts загружен");
var trainerData = {
  id: 1,
  name: "Анжелика Джоли",
  title: "тренер групповых программ",
  experience: 19,
  clubs: ["Железнодорожный"],
  specializations: ["йога", "бой с тенью", "коррекция осанки"],
  phone: "+7 (800) 555-35-35",
  email: "a.jolie@tochkaofbalance.ru",
  schedule: {
    monday: "09:00-18:00",
    tuesday: "12:00-20:00",
    wednesday: "09:00-18:00",
    thursday: "12:00-20:00",
    friday: "09:00-18:00",
    saturday: "10:00-15:00",
    sunday: "выходной"
  }
};
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
function formatSchedule() {
  const days = [
    { key: "monday", name: "Понедельник" },
    { key: "tuesday", name: "Вторник" },
    { key: "wednesday", name: "Среда" },
    { key: "thursday", name: "Четверг" },
    { key: "friday", name: "Пятница" },
    { key: "saturday", name: "Суббота" },
    { key: "sunday", name: "Воскресенье" }
  ];
  return days.filter((day) => trainerData.schedule[day.key]).map((day) => `${day.name}: ${trainerData.schedule[day.key]}`).join(`
`);
}
function showSchedule() {
  const scheduleText = formatSchedule();
  alert(`\uD83D\uDCC5 расписание ${trainerData.name}:

${scheduleText}

Клуб: ${trainerData.clubs.join(", ")}`);
}
var selectedTrainerId = null;
function bookToTrainer() {
  if (window.authAPI && window.authAPI.isLoggedIn()) {
    const trainingData = {
      id: Date.now(),
      title: `тренировка с ${trainerData.name}`,
      trainer: trainerData.name,
      time: "по расписанию",
      district: trainerData.clubs[0]
    };
    const existing = localStorage.getItem("myTrainings");
    let trainings = existing ? JSON.parse(existing) : [];
    trainings.push(trainingData);
    localStorage.setItem("myTrainings", JSON.stringify(trainings));
    showNotification(`✨ Вы записаны на тренировку к ${trainerData.name}! ✨`);
  } else {
    selectedTrainerId = trainerData.id;
    const infoBlock = getElement("modalTrainingInfo");
    if (infoBlock) {
      infoBlock.style.display = "block";
      infoBlock.innerHTML = `
                <p><strong>\uD83D\uDCCB вы записываетесь к тренеру:</strong></p>
                <p><strong>${trainerData.name}</strong></p>
                <p>\uD83D\uDC64 ${trainerData.title}</p>
                <p>\uD83D\uDCCD Клуб: ${trainerData.clubs.join(", ")}</p>
                <p>для записи войдите или зарегистрируйтесь</p>
            `;
    }
    openModal();
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
function initReviews() {
  const allReviewsLink = document.querySelector(".all-reviews-link");
  if (allReviewsLink) {
    allReviewsLink.addEventListener("click", (e) => {
      e.preventDefault();
      showNotification("\uD83D\uDCCB скоро здесь появятся все отзывы!");
    });
  }
}
function initContacts() {
  const contactLinks = document.querySelectorAll(".contact-link");
  contactLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const platform = link.querySelector("span")?.textContent;
      showNotification(`\uD83D\uDCF1 связь с тренером через ${platform} появится скоро`);
    });
  });
}
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
    const infoBlock = getElement("modalTrainingInfo");
    if (infoBlock)
      infoBlock.style.display = "none";
    selectedTrainerId = null;
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
        if (selectedTrainerId) {
          const trainingData = {
            id: Date.now(),
            title: `тренировка с ${trainerData.name}`,
            trainer: trainerData.name,
            time: "по расписанию",
            district: trainerData.clubs[0]
          };
          const existing = localStorage.getItem("myTrainings");
          let trainings = existing ? JSON.parse(existing) : [];
          trainings.push(trainingData);
          localStorage.setItem("myTrainings", JSON.stringify(trainings));
          showNotification(`✨ Вы записаны на тренировку к ${trainerData.name}! ✨`);
          selectedTrainerId = null;
        }
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
      if (selectedTrainerId) {
        const trainingData = {
          id: Date.now(),
          title: `тренировка с ${trainerData.name}`,
          trainer: trainerData.name,
          time: "по расписанию",
          district: trainerData.clubs[0]
        };
        const existing = localStorage.getItem("myTrainings");
        let trainings = existing ? JSON.parse(existing) : [];
        trainings.push(trainingData);
        localStorage.setItem("myTrainings", JSON.stringify(trainings));
        showNotification(`✨ Вы записаны на тренировку к ${trainerData.name}! ✨`);
        selectedTrainerId = null;
      }
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
        if (selectedTrainerId) {
          const trainingData = {
            id: Date.now(),
            title: `тренировка с ${trainerData.name}`,
            trainer: trainerData.name,
            time: "по расписанию",
            district: trainerData.clubs[0]
          };
          const existing = localStorage.getItem("myTrainings");
          let trainings = existing ? JSON.parse(existing) : [];
          trainings.push(trainingData);
          localStorage.setItem("myTrainings", JSON.stringify(trainings));
          showNotification(`✨ Вы записаны на тренировку к ${trainerData.name}! ✨`);
          selectedTrainerId = null;
        }
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
      if (selectedTrainerId) {
        const trainingData = {
          id: Date.now(),
          title: `тренировка с ${trainerData.name}`,
          trainer: trainerData.name,
          time: "по расписанию",
          district: trainerData.clubs[0]
        };
        const existing = localStorage.getItem("myTrainings");
        let trainings = existing ? JSON.parse(existing) : [];
        trainings.push(trainingData);
        localStorage.setItem("myTrainings", JSON.stringify(trainings));
        showNotification(`✨ Вы записаны на тренировку к ${trainerData.name}! ✨`);
        selectedTrainerId = null;
      }
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
function initBackButton() {
  const backLink = document.querySelector(".back-link");
  if (backLink) {
    backLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../тренеры/тренерыhtml.html";
    });
  }
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
function initCardsAnimation() {
  const cards = document.querySelectorAll(".bubble-card");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });
}
function renderTrainerData() {
  const nameEl = document.getElementById("trainerName");
  const roleEl = document.getElementById("trainerRole");
  const statsEl = document.getElementById("trainerStats");
  const clubsEl = document.getElementById("clubsList");
  const specTags = document.querySelector(".spec-tags");
  if (nameEl)
    nameEl.textContent = trainerData.name;
  if (roleEl)
    roleEl.textContent = trainerData.title;
  if (statsEl)
    statsEl.innerHTML = `<i class="fas fa-calendar-alt"></i> стаж ${trainerData.experience} лет`;
  if (clubsEl)
    clubsEl.innerHTML = trainerData.clubs.map((c) => `<li>${c}</li>`).join("");
  if (specTags) {
    specTags.innerHTML = trainerData.specializations.map((s) => `<span class="spec-tag">${s}</span>`).join("");
  }
}
function initBookButton() {
  const bookBtns = document.querySelectorAll(".btn-detail, .book-trainer-btn, .schedule-link");
  bookBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      bookToTrainer();
    });
  });
}
function initScheduleButton() {
  const scheduleBtn = document.getElementById("scheduleBtn");
  if (scheduleBtn) {
    scheduleBtn.addEventListener("click", showSchedule);
  }
}
function init() {
  console.log("\uD83D\uDE80 Страница тренера Анжелика Джоли загружена");
  renderTrainerData();
  initScheduleButton();
  initBookButton();
  initBackButton();
  initReviews();
  initContacts();
  initModal();
  initSubscription();
  initStickyHeader();
  updateLoginButton();
  initCardsAnimation();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
