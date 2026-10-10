// Navigation Section Switching
function switchSection(sectionId) {
    document.querySelectorAll('.section-block').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(sectionId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// -------------------------------------------------------------
// 1. Monolith Scaling Simulator Logic
// -------------------------------------------------------------
let monolithInstanceCount = 1;

function simulateMonolithTraffic() {
    monolithInstanceCount++;
    const container = document.getElementById('monolith-instances-container');
    const log = document.getElementById('monolith-sim-log');

    const newCard = document.createElement('div');
    newCard.className = 'instance-card';
    newCard.innerHTML = `
        <div class="instance-title">Instance #${monolithInstanceCount} (Tüm Monolith Kopyalandı!)</div>
        <div class="instance-modules">Product + Checkout + Payment + Recommendation</div>
        <div class="resource-bar-wrapper">
            <span class="res-label">CPU / RAM Yükü:</span>
            <div class="resource-bar"><div class="res-fill" style="width: 85%"></div></div>
        </div>
    `;

    container.appendChild(newCard);
    log.innerHTML = `⚠️ YÜKSEK TRAFİK: Sadece Product servisine yük geldi ama KOCA MONOLITH (${monolithInstanceCount} Adet Instance) baştan sona kopyalanıp scale edildi! (Büyük İsraf)`;
}

function resetMonolithSim() {
    monolithInstanceCount = 1;
    const container = document.getElementById('monolith-instances-container');
    const log = document.getElementById('monolith-sim-log');

    container.innerHTML = `
        <div class="instance-card">
            <div class="instance-title">Instance #1 (Ana Sunucu)</div>
            <div class="instance-modules">Product + Checkout + Payment + Recommendation</div>
            <div class="resource-bar-wrapper">
                <span class="res-label">CPU / RAM Yükü:</span>
                <div class="resource-bar"><div class="res-fill" style="width: 40%"></div></div>
            </div>
        </div>
    `;
    log.innerHTML = 'Durum: Normal Trafik. 1 Adet Monolith Instance aktif.';
}

// -------------------------------------------------------------
// 2. Microservice Scaling Simulator Logic
// -------------------------------------------------------------
const microState = {
    product: 3,
    search: 2,
    payment: 1
};

function scaleMicroService(service, delta) {
    if (microState[service] + delta < 1) return; // En az 1 instance
    microState[service] += delta;

    document.getElementById(`${service}-count`).innerText = `${microState[service]} Instance Aktif`;
    renderClusterCanvas();
}

function renderClusterCanvas() {
    const canvas = document.getElementById('cluster-canvas');
    if (!canvas) return;

    canvas.innerHTML = '';

    // Render Product Service Nodes
    for (let i = 1; i <= microState.product; i++) {
        const node = document.createElement('div');
        node.className = 'cluster-node';
        node.innerHTML = `📦 Product-Svc #${i}`;
        canvas.appendChild(node);
    }

    // Render Search Service Nodes
    for (let i = 1; i <= microState.search; i++) {
        const node = document.createElement('div');
        node.className = 'cluster-node';
        node.style.borderColor = 'var(--accent-purple)';
        node.style.background = 'rgba(168, 85, 247, 0.15)';
        node.innerHTML = `🔍 Search-Svc #${i}`;
        canvas.appendChild(node);
    }

    // Render Payment Service Nodes
    for (let i = 1; i <= microState.payment; i++) {
        const node = document.createElement('div');
        node.className = 'cluster-node';
        node.style.borderColor = 'var(--success)';
        node.style.background = 'rgba(16, 185, 129, 0.15)';
        node.innerHTML = `💳 Payment-Svc #${i}`;
        canvas.appendChild(node);
    }
}

// Initialize Cluster on Load
document.addEventListener('DOMContentLoaded', () => {
    renderClusterCanvas();
});

// -------------------------------------------------------------
// 3. Fault Isolation Simulator Logic
// -------------------------------------------------------------
function toggleFault(action) {
    const recomBox = document.getElementById('ecom-recommendation');
    const explanation = document.getElementById('fault-explanation');

    if (action === 'recommendation') {
        recomBox.className = 'ecom-recom recom-down';
        recomBox.innerHTML = '❌ [Recommendation Service DOWN] (Tavsiye Alanı Geçici Olarak Boş)';
        explanation.innerHTML = '🛡️ <strong>Fault Isolation (Hata İzolasyonu):</strong> Recommendation servisi çöktü ama e-ticaret siteniz (Product & Payment) %100 çalışmaya devam ediyor! Müşteri ürün detayını görebilir ve satın alabilir.';
    } else {
        recomBox.className = 'ecom-recom recom-active';
        recomBox.innerHTML = '⭐ Tavsiye Edilen Ürünler: AirPods Pro, Deri Kılıf (Recommendation Service: ✅ Aktif)';
        explanation.innerHTML = 'Servis çalıştığı sürece sayfanın tüm bileşenleri kusursuz görüntülenir.';
    }
}

// -------------------------------------------------------------
// 4. Instant & Automatic Quiz Logic
// -------------------------------------------------------------
const quizAnswers = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
};

function selectQuizOption(btn, qId, isCorrect) {
    const parent = btn.parentElement;
    const buttons = parent.querySelectorAll('.q-btn');
    buttons.forEach(b => b.classList.remove('selected', 'correct', 'incorrect'));

    if (isCorrect) {
        btn.classList.add('correct');
    } else {
        btn.classList.add('incorrect');
    }

    quizAnswers[qId] = isCorrect;

    const feedback = parent.nextElementSibling;
    if (isCorrect) {
        feedback.innerHTML = '✅ Doğru cevap!';
        feedback.style.color = 'var(--success)';
    } else {
        feedback.innerHTML = '❌ Yanlış cevap!';
        feedback.style.color = 'var(--danger)';
    }

    // Check if ALL 5 questions have been answered automatically
    const allAnswered = Object.values(quizAnswers).every(val => val !== null);
    if (allAnswered) {
        setTimeout(showQuizResults, 400); // Smooth delay before showing final score
    }
}

function showQuizResults() {
    let correctCount = 0;
    let incorrectCount = 0;

    for (let qId in quizAnswers) {
        if (quizAnswers[qId] === true) {
            correctCount++;
        } else if (quizAnswers[qId] === false) {
            incorrectCount++;
        }
    }

    const totalQuestions = 5;
    const percent = Math.round((correctCount / totalQuestions) * 100);

    document.getElementById('res-correct-count').innerText = correctCount;
    document.getElementById('res-incorrect-count').innerText = incorrectCount;
    document.getElementById('res-score-percent').innerText = `%${percent}`;

    const feedbackMsg = document.getElementById('res-feedback-msg');
    if (correctCount === 5) {
        feedbackMsg.className = 'res-feedback-msg feedback-perfect';
        feedbackMsg.innerHTML = '🎉 MÜKEMMEL! Ders 1\'deki tüm soruları 5 Doğru 0 Yanlış ile tamamladınız!';
    } else if (correctCount >= 3) {
        feedbackMsg.className = 'res-feedback-msg feedback-good';
        feedbackMsg.innerHTML = `👍 TEBRİKLER! ${correctCount} Doğru, ${incorrectCount} Yanlış yaptınız. Yanlış sorularınızı dersten tekrar inceleyebilirsiniz.`;
    } else {
        feedbackMsg.className = 'res-feedback-msg feedback-needs-review';
        feedbackMsg.innerHTML = `📚 TEKRAR LAZIM: ${correctCount} Doğru, ${incorrectCount} Yanlış yaptınız. Ders notlarını tekrar okumanızı öneririz.`;
    }

    const resultCard = document.getElementById('quiz-result-card');
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth' });
}

function resetQuiz() {
    for (let key in quizAnswers) {
        quizAnswers[key] = null;
    }

    document.querySelectorAll('.q-btn').forEach(b => b.classList.remove('selected', 'correct', 'incorrect'));
    document.querySelectorAll('.q-feedback').forEach(f => f.innerHTML = '');

    const resultCard = document.getElementById('quiz-result-card');
    resultCard.style.display = 'none';
}
