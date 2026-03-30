const rewards = [36, 42, 31, 39, 29, 36];

const questions = [
  {
    text: "What is TikTok mainly used for?",
    options: [
      "Watching and creating short videos",
      "Sending emails",
      "Editing spreadsheets",
      "Managing bank accounts"
    ]
  },
  {
    text: "What does \"FYP\" commonly mean on TikTok?",
    options: [
      "For You Page",
      "Find Your Password",
      "Follow Your Profile",
      "Filter Your Posts"
    ]
  },
  {
    text: "Which action helps TikTok personalize your feed?",
    options: [
      "Liking and watching videos longer",
      "Turning off your phone",
      "Deleting the app daily",
      "Using airplane mode"
    ]
  },
  {
    text: "What is a \"Duet\" on TikTok?",
    options: [
      "A split-screen video with another creator",
      "A private message",
      "A comment filter",
      "A video download feature"
    ]
  },
  {
    text: "What's the purpose of hashtags on TikTok?",
    options: [
      "Help categorize and discover content",
      "Increase phone battery",
      "Hide your account",
      "Disable sound"
    ]
  },
  {
    text: "Which is a common TikTok video feature?",
    options: [
      "Effects and filters",
      "Spreadsheet formulas",
      "Printer drivers",
      "GPS navigation routes"
    ]
  }
];

const ageView = document.getElementById("ageView");
const quizView = document.getElementById("quizView");
const doneView = document.getElementById("doneView");
const finalView = document.getElementById("finalView");

const balanceValue = document.getElementById("balanceValue");
const progressText = document.getElementById("progressText");
const progressBar = document.querySelector(".progress-bar");
const progressFill = document.getElementById("progressFill");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const errorText = document.getElementById("errorText");

const doneTotalValue = document.getElementById("doneTotalValue");
const withdrawBtn = document.getElementById("withdrawBtn");

const rewardModal = document.getElementById("rewardModal");
const modalBody = document.getElementById("modalBody");
const questionClickSound = document.getElementById("questionClickSound");

let currentQuestionIndex = 0;
let balance = 0;
let pendingAdvance = false;
let modalTimer = null;

function playQuestionSound() {
  if (!questionClickSound) {
    return;
  }

  questionClickSound.currentTime = 0;
  const playPromise = questionClickSound.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      // Ignore autoplay or missing-file errors.
    });
  }
}

function setView(activeView) {
  [ageView, quizView, doneView, finalView].forEach((view) => {
    const isActive = view === activeView;
    view.classList.toggle("active", isActive);
    view.setAttribute("aria-hidden", String(!isActive));
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateBalanceDisplays() {
  balanceValue.textContent = String(balance);
  doneTotalValue.textContent = String(balance);
}

function renderQuestion() {
  const questionNumber = currentQuestionIndex + 1;
  const question = questions[currentQuestionIndex];

  progressText.textContent = `Question ${questionNumber} of ${questions.length}`;
  progressBar.setAttribute("aria-valuenow", String(questionNumber));
  progressFill.style.width = `${(questionNumber / questions.length) * 100}%`;

  questionText.textContent = question.text;
  errorText.textContent = "";
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionId = `q${currentQuestionIndex}-o${index}`;

    const label = document.createElement("label");
    label.className = "option";
    label.htmlFor = optionId;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.id = optionId;
    input.value = String(index);

    const span = document.createElement("span");
    span.className = "option-text";
    span.textContent = option;

    label.append(input, span);
    optionsContainer.appendChild(label);
  });
}

function openRewardModal(amount) {
  modalBody.textContent = `You earned +${amount} USD!`;
  rewardModal.classList.remove("hidden");

  if (modalTimer) {
    clearTimeout(modalTimer);
  }

  modalTimer = setTimeout(() => {
    closeRewardModal();
  }, 2200);
}

function proceedAfterModal() {
  currentQuestionIndex += 1;

  if (currentQuestionIndex < questions.length) {
    renderQuestion();
    return;
  }

  setView(doneView);
}

function closeRewardModal() {
  rewardModal.classList.add("hidden");

  if (modalTimer) {
    clearTimeout(modalTimer);
    modalTimer = null;
  }

  if (pendingAdvance) {
    pendingAdvance = false;
    proceedAfterModal();
  }
}

optionsContainer.addEventListener("change", (event) => {
  if (pendingAdvance || !event.target.matches('input[name="answer"]')) {
    return;
  }

  playQuestionSound();

  const reward = rewards[currentQuestionIndex];
  balance += reward;
  updateBalanceDisplays();
  pendingAdvance = true;
  openRewardModal(reward);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !rewardModal.classList.contains("hidden")) {
    closeRewardModal();
  }
});

withdrawBtn.addEventListener("click", () => {
  setView(finalView);
});

const ageConfirmBtn = document.getElementById("ageConfirmBtn");
const ageDenyBtn = document.getElementById("ageDenyBtn");

ageConfirmBtn.addEventListener("click", () => {
  setView(quizView);
  updateBalanceDisplays();
  renderQuestion();
});

ageDenyBtn.addEventListener("click", () => {
  window.location.href = "https://www.google.com";
});
