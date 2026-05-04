const pages = [...document.querySelectorAll("[data-page]")];
const navLinks = [...document.querySelectorAll("[data-page-link]")];

function showPage(pageName) {
  pages.forEach((page) => {
    page.classList.toggle("active", page.dataset.page === pageName);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === pageName && link.classList.contains("nav-link"));
  });

  if (location.hash.replace("#", "") !== pageName) {
    history.replaceState(null, "", `#${pageName}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => showPage(link.dataset.pageLink));
});

const amountInput = document.querySelector("#amount");
const monthsInput = document.querySelector("#months");
const rateInput = document.querySelector("#rate");
const incomeInput = document.querySelector("#income");
const monthlyPayment = document.querySelector("#monthlyPayment");
const pressureText = document.querySelector("#pressureText");

function formatCurrency(value) {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0
  }).format(value);
}

function calculateLoan() {
  const amount = Number(amountInput.value || 0);
  const months = Number(monthsInput.value || 1);
  const annualRate = Number(rateInput.value || 0);
  const income = Number(incomeInput.value || 0);
  const monthlyRate = annualRate / 100 / 12;

  let payment = amount / months;
  if (monthlyRate > 0) {
    payment = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  monthlyPayment.textContent = formatCurrency(payment);

  const ratio = income > 0 ? payment / income : 0;
  if (!income) {
    pressureText.textContent = "請輸入每月收入，系統會顯示還款壓力提醒。";
  } else if (ratio <= 0.25) {
    pressureText.textContent = "月付占收入比例較低，仍建議保留生活預備金。";
  } else if (ratio <= 0.4) {
    pressureText.textContent = "月付已有一定壓力，建議與專人討論期數與金額。";
  } else {
    pressureText.textContent = "月付占收入比例偏高，建議降低金額或拉長期數後再評估。";
  }
}

[amountInput, monthsInput, rateInput, incomeInput].forEach((input) => {
  input.addEventListener("input", calculateLoan);
});

const initialPage = location.hash.replace("#", "") || "home";
showPage(pages.some((page) => page.dataset.page === initialPage) ? initialPage : "home");
calculateLoan();
