// ============================================================
// quiz.js — Quiz engine: render, navigate, score, result
// ============================================================
import { getAnswerExplanation } from "./ai-service.js";

let questions   = [];
let currentIdx  = 0;
let answers     = [];   // stores selected option index (-1 = skipped)
let timerHandle = null;

// ─── Bootstrap ──────────────────────────────────────────────
export function initQuiz(qs) {
  questions   = qs;
  currentIdx  = 0;
  answers     = new Array(qs.length).fill(-1);
  renderQuestion();
  updateProgress();
}

// ─── Render current question ─────────────────────────────────
function renderQuestion() {
  const q   = questions[currentIdx];
  const num = currentIdx + 1;
  const total = questions.length;

  document.getElementById("question-counter").textContent = `Question ${num} of ${total}`;
  document.getElementById("question-text").textContent    = q.question;

  const opts = document.getElementById("options-container");
  opts.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className    = "option-btn";
    btn.textContent  = opt;
    btn.dataset.idx  = i;

    if (answers[currentIdx] === i)    btn.classList.add("selected");

    btn.addEventListener("click", () => selectOption(i));
    opts.appendChild(btn);
  });

  // Update nav buttons
  document.getElementById("btn-prev").disabled = currentIdx === 0;
  const nextBtn = document.getElementById("btn-next");
  nextBtn.textContent = currentIdx === total - 1 ? "Finish" : "Next →";
}

// ─── Select an option ────────────────────────────────────────
function selectOption(idx) {
  answers[currentIdx] = idx;

  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.classList.remove("selected");
    if (+btn.dataset.idx === idx) btn.classList.add("selected");
  });

  updateProgress();
}

// ─── Navigation ──────────────────────────────────────────────
export function nextQuestion(onFinish) {
  if (currentIdx < questions.length - 1) {
    currentIdx++;
    renderQuestion();
    updateProgress();
  } else {
    onFinish(calculateScore());
  }
}

export function prevQuestion() {
  if (currentIdx > 0) {
    currentIdx--;
    renderQuestion();
    updateProgress();
  }
}

// ─── Progress bar ────────────────────────────────────────────
function updateProgress() {
  const answered = answers.filter((a) => a !== -1).length;
  const pct      = Math.round((answered / questions.length) * 100);
  const bar      = document.getElementById("progress-bar");
  const label    = document.getElementById("progress-label");
  if (bar)   bar.style.width   = pct + "%";
  if (label) label.textContent = `${answered}/${questions.length} answered`;
}

// ─── Score ───────────────────────────────────────────────────
function calculateScore() {
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.answer) correct++;
  });
  return { correct, total: questions.length, answers, questions };
}

// ─── Force-finish (called by timer expiry) ───────────────────
// Submits immediately with whatever answers the user has so far.
// Unanswered questions (-1) are treated as wrong.
export function forceFinish() {
  return calculateScore();
}

// ─── Result screen ───────────────────────────────────────────
export function renderResult(result, container, meta) {
  const pct   = Math.round((result.correct / result.total) * 100);
  const grade = pct >= 80 ? "🏆 Excellent!" : pct >= 60 ? "👍 Good Job!" : pct >= 40 ? "📚 Keep Practicing" : "💪 Don't Give Up!";
  const color = pct >= 80 ? "var(--accent-green)" : pct >= 60 ? "var(--accent-blue)" : pct >= 40 ? "var(--accent-amber)" : "var(--accent-red)";

  const timedOutBanner = meta.timedOut
    ? `<div style="margin:0.6rem 0 0.8rem;padding:0.6rem 1rem;background:rgba(239,68,68,0.12);border:1px solid #ef4444;border-radius:8px;color:#ef4444;font-weight:600;text-align:center;">⏰ Time ran out — quiz was submitted automatically</div>`
    : "";

  container.innerHTML = `
    <div class="result-card">
      <div class="result-circle" style="--score-color:${color}">
        <span class="result-pct">${pct}%</span>
        <span class="result-grade-small">${result.correct}/${result.total}</span>
      </div>
      <h2 class="result-grade">${grade}</h2>
      <div class="result-meta">
        <span>${meta.domain} · ${meta.topic} · ${meta.difficulty}</span>
      </div>
      ${timedOutBanner}
      ${pct === 100 ? `<div class="result-badge-msg" style="margin: 0.8rem 0; padding: 0.6rem; border: 1px solid #fbbf24; background: rgba(251,191,36,0.12); color: #fbbf24; border-radius: 8px; font-weight: 600; text-align: center;">🎉 Congrats! You received a perfect-round badge!</div>` : ""}
      
      <div class="result-stats">
        <div class="stat correct-stat">
          <span class="stat-num">${result.correct}</span>
          <span class="stat-lbl">Correct</span>
        </div>
        <div class="stat wrong-stat">
          <span class="stat-num">${result.total - result.correct}</span>
          <span class="stat-lbl">Wrong</span>
        </div>
        <div class="stat total-stat">
          <span class="stat-num">${result.total}</span>
          <span class="stat-lbl">Total</span>
        </div>
      </div>

      ${pct >= 90 ? `
        <div class="certificate-unlock">
          <p>🎖️ High Score Achievement!</p>
          <button class="btn-primary" id="download-cert-btn">Download Certificate</button>
        </div>
      ` : ""}

      <div class="result-review">
        <h3>Answer Review</h3>
        <div class="review-list">
          ${result.questions.map((q, i) => {
            const chosen  = result.answers[i];
            const correct = q.answer;
            const isRight = chosen === correct;
            return `
              <div class="review-item ${isRight ? "right" : "wrong"}" data-q-idx="${i}">
                <div class="review-header">
                  <p class="review-q"><strong>Q${i+1}.</strong> ${q.question}</p>
                  <button class="ai-explain-btn" title="Explain with AI">✨ Explain</button>
                </div>
                <p class="review-your">Your answer: <span class="${isRight ? "ans-correct" : "ans-wrong"}">${chosen === -1 ? "Skipped" : q.options[chosen]}</span></p>
                ${!isRight ? `<p class="review-correct">Correct: <span class="ans-correct">${q.options[correct]}</span></p>` : ""}
                <div class="ai-explanation-box" style="display:none">
                   <div class="ai-loader">AI Thinking...</div>
                   <div class="ai-text"></div>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>
      <div class="result-actions">
        <button class="btn-primary" onclick="window.location.href='domains.html'">← Back to Domains</button>
        <button class="btn-outline" onclick="window.location.reload()">Retry Quiz</button>
      </div>
    </div>`;

  // Attach event listeners for AI explanations
  container.querySelectorAll(".ai-explain-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const item = e.target.closest(".review-item");
      const idx = item.dataset.qIdx;
      const q = result.questions[idx];
      const box = item.querySelector(".ai-explanation-box");
      const txt = box.querySelector(".ai-text");
      const loader = box.querySelector(".ai-loader");

      if (box.style.display === "block") {
        box.style.display = "none";
        return;
      }

      box.style.display = "block";
      txt.textContent = "";
      loader.style.display = "block";

      const chosenText = result.answers[idx] === -1 ? "Skipped" : q.options[result.answers[idx]];
      const correctText = q.options[q.answer];

      const explanation = await getAnswerExplanation(q.question, correctText, chosenText);
      loader.style.display = "none";
      txt.textContent = explanation;
    });
  });

  // Attach event listener for Certificate
  const certBtn = document.getElementById("download-cert-btn");
  if (certBtn) {
    certBtn.addEventListener("click", () => {
      generateCertificate(meta.domain, meta.topic, pct);
    });
  }
}

async function generateCertificate(domain, topic, score) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape', 'px', 'a4');
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const userName = sessionStorage.getItem("displayName") || "SmartQuiz Scholar";

  // Background
  doc.setFillColor(24, 28, 36); // --bg-2
  doc.rect(0, 0, width, height, 'F');

  // Border
  doc.setDrawColor(79, 142, 247); // --accent-blue
  doc.setLineWidth(10);
  doc.rect(20, 20, width - 40, height - 40);

  // Content
  doc.setTextColor(238, 240, 246); // --text-primary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.text("CERTIFICATE OF EXCELLENCE", width / 2, 80, { align: 'center' });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(20);
  doc.text("THIS IS PROUDLY PRESENTED TO", width / 2, 130, { align: 'center' });

  doc.setTextColor(139, 92, 246); // --accent-violet
  doc.setFontSize(35);
  doc.setFont("helvetica", "bolditalic");
  doc.text(userName, width / 2, 175, { align: 'center' });

  doc.setTextColor(238, 240, 246);
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text(`for masterfully completing the quiz on`, width / 2, 220, { align: 'center' });

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(`${topic} (${domain})`, width / 2, 255, { align: 'center' });

  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text(`with a remarkable score of ${score}%`, width / 2, 290, { align: 'center' });

  // Signature / Brand
  doc.setDrawColor(238, 240, 246);
  doc.setLineWidth(1);
  doc.line(width / 2 - 60, height - 60, width / 2 + 60, height - 60);
  doc.setFontSize(12);
  doc.text("SMARTQUIZ LEARN PLATFORM", width / 2, height - 45, { align: 'center' });

  doc.save(`SmartQuiz_Certificate_${topic}.pdf`);
}
