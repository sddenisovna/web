/* блог/блогts.ts */
console.log("✅ блогts.ts загружен");
function getBlogElement(id) {
  return document.getElementById(id);
}
function showBlogNotification(message, isError = false) {
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
function initBlogSubscription() {
  const subscribeBtns = document.querySelectorAll(".footer-col .btn-primary");
  subscribeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".footer-col");
      const input = parent?.querySelector('input[type="email"]');
      if (input && input.value) {
        showBlogNotification(`\uD83D\uDC8C спасибо за подписку! письма будут приходить на ${input.value}`);
        input.value = "";
      } else {
        showBlogNotification("пожалуйста, введите e-mail", true);
      }
    });
  });
}
function initBlogArticleLinks() {
  const readMoreLinks = document.querySelectorAll(".read-more");
  readMoreLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const articleTitle = link.closest("article")?.querySelector("h2, h3")?.textContent || "статья";
      showBlogNotification(`\uD83D\uDCD6 статья "${articleTitle}" — скоро будет доступна для чтения!`);
    });
  });
}
function initBlogTagLinks() {
  const tags = document.querySelectorAll(".tags-list a");
  tags.forEach((tag) => {
    tag.addEventListener("click", (e) => {
      e.preventDefault();
      const tagName = tag.textContent || "";
      showBlogNotification(`\uD83D\uDD0D показываем статьи по тегу ${tagName}`);
    });
  });
}
function initBlogAlsoReadLinks() {
  const alsoReadItems = document.querySelectorAll(".also-read-item");
  alsoReadItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const title = item.querySelector("span")?.textContent || "статья";
      showBlogNotification(`\uD83D\uDCD6 открыть статью "${title}"`);
    });
  });
}
function initBlogMagazineLink() {
  const magazineLink = document.querySelector(".magazine-link");
  if (magazineLink) {
    magazineLink.addEventListener("click", () => {
      console.log("Переход на журнал theGirl");
    });
  }
}
var blogSelectedAction = null;
function openBlogModal() {
  const modal = getBlogElement("auth-modal");
  if (modal)
    modal.classList.add("active");
}
function closeBlogModal() {
  const modal = getBlogElement("auth-modal");
  if (modal)
    modal.classList.remove("active");
}
function initBlogModal() {
  const modal = getBlogElement("auth-modal");
  const closeBtn = getBlogElement("modalCloseBtn");
  const loginHeaderBtn = document.querySelector(".header .btn-outline");
  const loginTab = document.querySelector('[data-tab="login"]');
  const registerTab = document.querySelector('[data-tab="register"]');
  const loginForm = getBlogElement("login-form");
  const registerForm = getBlogElement("register-form");
  const switchToRegister = getBlogElement("switch-to-register");
  const switchToLogin = getBlogElement("switch-to-login");
  const loginSubmit = getBlogElement("login-submit-btn");
  const registerSubmit = getBlogElement("register-submit-btn");
  closeBtn?.addEventListener("click", closeBlogModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal)
      closeBlogModal();
  });
  loginHeaderBtn?.addEventListener("click", () => {
    blogSelectedAction = null;
    openBlogModal();
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
    const email = getBlogElement("login-email")?.value || "";
    const password = getBlogElement("login-password")?.value || "";
    if (!email || !password) {
      showBlogNotification("пожалуйста, заполните все поля", true);
      return;
    }
    if (window.authAPI) {
      const result = await window.authAPI.login(email, password);
      if (result.success) {
        showBlogNotification(result.message);
        closeBlogModal();
        updateBlogLoginButton();
        const loginEmail = getBlogElement("login-email");
        const loginPassword = getBlogElement("login-password");
        if (loginEmail)
          loginEmail.value = "";
        if (loginPassword)
          loginPassword.value = "";
      } else {
        showBlogNotification(result.message, true);
      }
    } else {
      showBlogNotification(`✨ добро пожаловать, ${email.split("@")[0]}! ✨`);
      closeBlogModal();
      updateBlogLoginButton();
      const loginEmail = getBlogElement("login-email");
      const loginPassword = getBlogElement("login-password");
      if (loginEmail)
        loginEmail.value = "";
      if (loginPassword)
        loginPassword.value = "";
    }
  });
  registerSubmit?.addEventListener("click", async () => {
    const name = getBlogElement("register-name")?.value || "";
    const email = getBlogElement("register-email")?.value || "";
    const phone = getBlogElement("register-phone")?.value || "";
    const password = getBlogElement("register-password")?.value || "";
    if (!name || !email || !password) {
      showBlogNotification("пожалуйста, заполните имя, email и пароль", true);
      return;
    }
    if (password.length < 4) {
      showBlogNotification("пароль должен быть не менее 4 символов", true);
      return;
    }
    if (window.authAPI) {
      const result = await window.authAPI.register(name, email, phone, password);
      if (result.success) {
        showBlogNotification(result.message);
        closeBlogModal();
        updateBlogLoginButton();
        const regName = getBlogElement("register-name");
        const regEmail = getBlogElement("register-email");
        const regPhone = getBlogElement("register-phone");
        const regPassword = getBlogElement("register-password");
        if (regName)
          regName.value = "";
        if (regEmail)
          regEmail.value = "";
        if (regPhone)
          regPhone.value = "";
        if (regPassword)
          regPassword.value = "";
      } else {
        showBlogNotification(result.message, true);
      }
    } else {
      showBlogNotification(`✨ ${name}, добро пожаловать в точку баланса! ✨`);
      closeBlogModal();
      updateBlogLoginButton();
      const regName = getBlogElement("register-name");
      const regEmail = getBlogElement("register-email");
      const regPhone = getBlogElement("register-phone");
      const regPassword = getBlogElement("register-password");
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
function updateBlogLoginButton() {
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
    loginBtn.onclick = () => openBlogModal();
  }
}
function initBlogStickyHeader() {
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
function initBlogScrollAnimation() {
  const animatedElements = document.querySelectorAll(".featured-post, .post-card, .news-column, .magazine-card, .tags-cloud, .also-read-item");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(element);
  });
}
function initBlog() {
  console.log("\uD83D\uDE80 Блог загружен");
  initBlogSubscription();
  initBlogArticleLinks();
  initBlogTagLinks();
  initBlogAlsoReadLinks();
  initBlogMagazineLink();
  initBlogModal();
  initBlogStickyHeader();
  updateBlogLoginButton();
  initBlogScrollAnimation();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBlog);
} else {
  initBlog();
}
