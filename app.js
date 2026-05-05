const currentPage = document.body.dataset.page;
const navLinks = document.querySelectorAll("[data-nav]");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

navLinks.forEach((link) => {
  if (link.dataset.nav === currentPage) {
    link.classList.add("active");
  }
});

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const amountInput = document.querySelector("#amount");
const monthsInput = document.querySelector("#months");
const rateInput = document.querySelector("#rate");
const incomeInput = document.querySelector("#income");
const monthlyPayment = document.querySelector("#monthlyPayment");
const pressureText = document.querySelector("#pressureText");

function formatCurrency(value) {
  const amount = new Intl.NumberFormat("zh-TW", {
    maximumFractionDigits: 0
  }).format(value);
  return `NT$ ${amount}`;
}

function calculateLoan() {
  if (!amountInput || !monthsInput || !rateInput || !incomeInput || !monthlyPayment || !pressureText) return;

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
  if (input) input.addEventListener("input", calculateLoan);
});

calculateLoan();
