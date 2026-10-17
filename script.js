/**
 * 우리 반 1인 1역할 뽑기 대작전! - script.js
 * 초등 저학년 맞춤: 귀엽고 신나는 1:1 역할 뽑기, 꽃가루 폭죽 효과, A4 인쇄, 스프레드시트 연동
 */

// ==========================================
// 1. 기본 예시 데이터 (학생 20명 & 알찬 역할 20개)
// ==========================================
const DEFAULT_STUDENTS = [
  { id: 1, name: "김민준" },
  { id: 2, name: "이서아" },
  { id: 3, name: "박도윤" },
  { id: 4, name: "최지안" },
  { id: 5, name: "정시우" },
  { id: 6, name: "강하은" },
  { id: 7, name: "조예준" },
  { id: 8, name: "윤서윤" },
  { id: 9, name: "장지호" },
  { id: 10, name: "임수아" },
  { id: 11, name: "한은우" },
  { id: 12, name: "오시아" },
  { id: 13, name: "서지우" },
  { id: 14, name: "신채원" },
  { id: 15, name: "권유준" },
  { id: 16, name: "황지유" },
  { id: 17, name: "송서진" },
  { id: 18, name: "전다은" },
  { id: 19, name: "홍서우" },
  { id: 20, name: "유하윤" }
];

const DEFAULT_ROLES = [
  { id: 1, title: "칠판 지우미", emoji: "🧹", desc: "수업이 끝나면 칠판을 뽀득뽀득 닦고 분필 가루를 털어요." },
  { id: 2, title: "우유 도우미", emoji: "🥛", desc: "아침마다 우리 반 건강 우유 상자를 챙겨오고 정리해요." },
  { id: 3, title: "줄서기 반장", emoji: "🚶", desc: "이동 수업이나 급식실 갈 때 바르고 조용하게 줄을 세워요." },
  { id: 4, title: "급식 도우미", emoji: "🍱", desc: "급식판을 질서 있게 받도록 돕고 식탁을 닦아요." },
  { id: 5, title: "분리수거 대장", emoji: "♻️", desc: "우유팩, 종이, 플라스틱을 올바른 통에 바르게 분리수거해요." },
  { id: 6, title: "초록 식물 가꾸기", emoji: "🌱", desc: "교실 화분에 물을 퐁퐁 주고 사랑의 말을 건네요." },
  { id: 7, title: "창문 환기 대장", emoji: "🪟", desc: "쉬는 시간과 점심시간에 창문을 활짝 열어 맑은 공기를 채워요." },
  { id: 8, title: "학급 문고 관리자", emoji: "📚", desc: "교실 뒤 책꽂이의 책들이 번호대로 가지런히 꽂히게 살펴봐요." },
  { id: 9, title: "학습지 나누미", emoji: "📑", desc: "선생님께서 주시는 학습지를 친구들에게 소중하게 전달해요." },
  { id: 10, title: "컴퓨터·TV 도우미", emoji: "💻", desc: "수업 시간 전자칠판과 컴퓨터 리모컨을 바르게 챙겨요." },
  { id: 11, title: "소지품 정리왕", emoji: "🎒", desc: "사물함 위와 책상 옆걸이가 단정하게 정돈되도록 살펴봐요." },
  { id: 12, title: "체육 기구 도우미", emoji: "⚽", desc: "신나는 체육 시간에 공과 줄넘기를 챙겨오고 제자리에 넣어요." },
  { id: 13, title: "에너지 지킴이", emoji: "💡", desc: "교실을 비울 때 전등을 톡 끄고 전기를 아껴요." },
  { id: 14, title: "신발장 정리왕", emoji: "👟", desc: "친구들의 실내화가 삐뚤어지지 않게 가지런히 모아요." },
  { id: 15, title: "청소함 정리도우미", emoji: "🧺", desc: "빗자루와 쓰레받기가 청소도구함 제자리로 쏙 들어가게 도와줘요." },
  { id: 16, title: "손 소독 지킴이", emoji: "🧴", desc: "교실에 들어올 때 친구들이 손 소독을 깨끗이 하도록 안내해요." },
  { id: 17, title: "시간 알림이", emoji: "⏰", desc: "수업 시작종이 치면 자리에 앉도록 친구들에게 조용히 알려줘요." },
  { id: 18, title: "칭찬 우체부", emoji: "💌", desc: "칭찬 상자의 따뜻한 편지를 모아서 친구들에게 전달해요." },
  { id: 19, title: "미술 재료 도우미", emoji: "🎨", desc: "미술 시간에 가위, 풀, 색연필 바구니를 바르게 준비해요." },
  { id: 20, title: "교실 안전 지킴이", emoji: "🛡️", desc: "복도나 교실에서 뛰는 친구들에게 친절하게 조심하자고 말해요." }
];

const PASTEL_THEMES = ["pink", "yellow", "mint", "sky", "purple", "orange"];

// ==========================================
// 2. 상태 관리
// ==========================================
let appState = {
  className: "3학년 2반",
  termName: "2026학년도 1학기",
  students: [...DEFAULT_STUDENTS],
  roles: [...DEFAULT_ROLES],
  assignments: [],
  viewMode: "card", // "card" | "table"
  searchQuery: "",
  sheetsWebAppUrl: ""
};

const STORAGE_KEY = "cute_class_role_state_v2";

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      className: appState.className,
      termName: appState.termName,
      students: appState.students,
      roles: appState.roles,
      assignments: appState.assignments,
      sheetsWebAppUrl: appState.sheetsWebAppUrl
    }));
  } catch (e) {
    console.warn("로컬 저장 오류:", e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.className) appState.className = parsed.className;
      if (parsed.termName) appState.termName = parsed.termName;
      if (Array.isArray(parsed.students) && parsed.students.length > 0) appState.students = parsed.students;
      if (Array.isArray(parsed.roles) && parsed.roles.length > 0) appState.roles = parsed.roles;
      if (Array.isArray(parsed.assignments)) appState.assignments = parsed.assignments;
      if (parsed.sheetsWebAppUrl) appState.sheetsWebAppUrl = parsed.sheetsWebAppUrl;
    }
  } catch (e) {
    console.warn("로컬 데이터 로드 실패:", e);
  }
}

// ==========================================
// 3. 피셔-예이츠 무작위 배정 로직 & 꽃가루 폭죽
// ==========================================
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function assignRoles() {
  if (appState.students.length === 0) {
    showToast("⚠️ 먼저 명단·역할 관리에서 학생 명단을 입력해 주세요!");
    return;
  }
  if (appState.roles.length === 0) {
    showToast("⚠️ 배정할 역할 목록이 없습니다!");
    return;
  }

  const resultsGrid = document.getElementById("cards-grid");
  const tableView = document.getElementById("table-view-container");

  if (resultsGrid) resultsGrid.style.opacity = "0.4";
  if (tableView) tableView.style.opacity = "0.4";

  showToast("🎲 또르르르~ 역할을 신나게 섞는 중이에요!");

  setTimeout(() => {
    let shuffledRoles = shuffleArray(appState.roles);
    while (shuffledRoles.length < appState.students.length) {
      shuffledRoles = shuffledRoles.concat(shuffleArray(appState.roles));
    }

    const newAssignments = appState.students.map((student, idx) => {
      const role = shuffledRoles[idx];
      return {
        studentId: student.id,
        studentName: student.name,
        roleId: role.id,
        roleTitle: role.title,
        roleEmoji: role.emoji,
        roleDesc: role.desc
      };
    });

    appState.assignments = newAssignments;
    saveToLocalStorage();

    if (resultsGrid) resultsGrid.style.opacity = "1";
    if (tableView) tableView.style.opacity = "1";

    renderUI();
    triggerCuteConfetti();
    showToast("🎉 짠! 우리 반 20명 친구들의 1인 1역할이 모두 정해졌어요!");
  }, 450);
}

// ==========================================
// 4. 귀여운 꽃가루 폭죽 애니메이션 (Confetti)
// ==========================================
function triggerCuteConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#f472b6", "#fb923c", "#facc15", "#4ade80", "#38bdf8", "#c084fc", "#fb7185"];
  const pieces = [];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 300,
      y: canvas.height * 0.3 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 18,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 9 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.4 ? "circle" : "star"
    });
  }

  let animationFrame;
  let startTime = performance.now();

  function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function render(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = time - startTime;

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // 중력
      p.vx *= 0.98; // 공기 저항
      p.rotation += p.vRotation;

      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      } else {
        drawStar(p.x, p.y, 5, p.size, p.size * 0.5, p.color);
      }
    });

    if (elapsed < 2400) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  animationFrame = requestAnimationFrame(render);
}

// ==========================================
// 5. UI 렌더링
// ==========================================
function renderUI() {
  const badgeText = document.getElementById("class-badge-text");
  if (badgeText) {
    badgeText.textContent = `${appState.className} · ${appState.termName}`;
  }

  const studentCountEl = document.getElementById("stat-student-count");
  const roleCountEl = document.getElementById("stat-role-count");
  const assignedCountEl = document.getElementById("stat-assigned-count");

  if (studentCountEl) studentCountEl.textContent = `${appState.students.length}명`;
  if (roleCountEl) roleCountEl.textContent = `${appState.roles.length}개`;
  if (assignedCountEl) assignedCountEl.textContent = `${appState.assignments.length}명`;

  const query = appState.searchQuery.trim().toLowerCase();
  let displayedList = appState.assignments;
  if (query) {
    displayedList = displayedList.filter(item => 
      item.studentName.toLowerCase().includes(query) ||
      item.roleTitle.toLowerCase().includes(query) ||
      String(item.studentId).includes(query)
    );
  }

  const emptyStateEl = document.getElementById("empty-state");
  const cardsGridEl = document.getElementById("cards-grid");
  const tableViewEl = document.getElementById("table-view-container");

  if (appState.assignments.length === 0) {
    if (emptyStateEl) emptyStateEl.style.display = "block";
    if (cardsGridEl) cardsGridEl.style.display = "none";
    if (tableViewEl) tableViewEl.style.display = "none";
    return;
  }

  if (emptyStateEl) emptyStateEl.style.display = "none";

  if (appState.viewMode === "card") {
    if (cardsGridEl) {
      cardsGridEl.style.display = "grid";
      renderCards(displayedList, cardsGridEl);
    }
    if (tableViewEl) tableViewEl.style.display = "none";
  } else {
    if (cardsGridEl) cardsGridEl.style.display = "none";
    if (tableViewEl) {
      tableViewEl.style.display = "block";
      renderTable(displayedList, tableViewEl);
    }
  }

  updatePrintSheet();
}

function renderCards(list, container) {
  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #78716c; font-family: var(--font-display); font-size: 17px;">
        🔍 '${escapeHtml(appState.searchQuery)}' 친구나 역할을 찾지 못했어요.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((item, index) => {
    const theme = PASTEL_THEMES[index % PASTEL_THEMES.length];
    return `
      <div class="desk-card theme-${theme}">
        <div class="card-header-row">
          <div class="student-tag-group">
            <span class="student-number-circle">${item.studentId}</span>
            <span class="student-name-text">${escapeHtml(item.studentName)}</span>
          </div>
          <button class="btn-card-mini-swap" onclick="openSwapModal(${item.studentId})" title="역할 변경 또는 맞교환">
            🔄 바꾸기
          </button>
        </div>
        <div class="cute-role-bubble">
          <div class="role-title-row">
            <span class="role-big-emoji">${item.roleEmoji || '⭐'}</span>
            <span class="role-title-label">${escapeHtml(item.roleTitle)}</span>
          </div>
          <p class="role-explain-text">${escapeHtml(item.roleDesc || '')}</p>
        </div>
      </div>
    `;
  }).join("");
}

function renderTable(list, container) {
  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #78716c; font-family: var(--font-display);">
        🔍 '${escapeHtml(appState.searchQuery)}' 검색 결과가 없습니다.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="kids-table">
      <thead>
        <tr>
          <th style="width: 70px; text-align: center;">번호</th>
          <th style="width: 120px;">이름</th>
          <th style="width: 170px;">역할명</th>
          <th>담당 임무 (설명)</th>
          <th style="width: 80px; text-align: center;">관리</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((item) => `
          <tr>
            <td style="text-align: center; font-weight: 700; color: #ea580c; font-family: var(--font-display);">${item.studentId}번</td>
            <td style="font-weight: 700; color: #1f2937; font-family: var(--font-display); font-size: 16px;">${escapeHtml(item.studentName)}</td>
            <td>
              <span style="font-size: 18px; margin-right: 4px;">${item.roleEmoji || '⭐'}</span>
              <strong style="color: #374151; font-family: var(--font-display);">${escapeHtml(item.roleTitle)}</strong>
            </td>
            <td style="color: #4b5563; font-size: 13px;">${escapeHtml(item.roleDesc || '')}</td>
            <td style="text-align: center;">
              <button class="btn-card-mini-swap" onclick="openSwapModal(${item.studentId})">
                바꾸기
              </button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// ==========================================
// 6. A4 교실 게시판 인쇄용 데이터 동기화
// ==========================================
function updatePrintSheet() {
  const printTitleEl = document.getElementById("print-class-title");
  const printDateEl = document.getElementById("print-date");
  const printTable1El = document.getElementById("print-table-body-1");
  const printTable2El = document.getElementById("print-table-body-2");

  if (printTitleEl) {
    printTitleEl.textContent = `[ ${appState.className} ] 사이좋은 1인 1역할 배정표 (${appState.termName})`;
  }

  if (printDateEl) {
    const today = new Date();
    printDateEl.textContent = `배정일자: ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  }

  if (!printTable1El || !printTable2El) return;

  const list = appState.assignments;
  const half = Math.ceil(list.length / 2);
  const leftCol = list.slice(0, half);
  const rightCol = list.slice(half);

  function generateRows(items) {
    return items.map(item => `
      <tr>
        <td class="col-num">${item.studentId}</td>
        <td class="col-name">${escapeHtml(item.studentName)}</td>
        <td class="col-role">${item.roleEmoji} ${escapeHtml(item.roleTitle)}</td>
        <td class="col-desc">${escapeHtml(item.roleDesc)}</td>
        <td class="col-check">□</td>
      </tr>
    `).join("");
  }

  printTable1El.innerHTML = generateRows(leftCol);
  printTable2El.innerHTML = generateRows(rightCol);
}

function handlePrint() {
  if (appState.assignments.length === 0) {
    showToast("⚠️ 먼저 [🎲 역할 뽑기 시작!]을 눌러 배정을 완료해 주세요!");
    return;
  }
  updatePrintSheet();
  window.print();
}

// ==========================================
// 7. 역할 바꾸기 (맞교환 & 단독 변경)
// ==========================================
let currentSwapStudentId = null;

function openSwapModal(studentId) {
  currentSwapStudentId = studentId;
  const assignment = appState.assignments.find(a => a.studentId === studentId);
  if (!assignment) return;

  const modal = document.getElementById("swap-modal");
  const titleEl = document.getElementById("swap-modal-student-info");
  const roleSelectEl = document.getElementById("swap-role-select");
  const partnerSelectEl = document.getElementById("swap-partner-select");

  if (titleEl) {
    titleEl.textContent = `🌟 ${assignment.studentId}번 ${assignment.studentName} 친구 (현재: ${assignment.roleEmoji} ${assignment.roleTitle})`;
  }

  if (roleSelectEl) {
    roleSelectEl.innerHTML = appState.roles.map(r => `
      <option value="${r.id}" ${r.title === assignment.roleTitle ? 'selected' : ''}>
        ${r.emoji} ${r.title}
      </option>
    `).join("");
  }

  if (partnerSelectEl) {
    partnerSelectEl.innerHTML = `
      <option value="">-- 맞바꿀 친구 선택 (선택 사항) --</option>
      ${appState.assignments
        .filter(a => a.studentId !== studentId)
        .map(a => `
          <option value="${a.studentId}">
            ${a.studentId}번 ${a.studentName} (${a.roleEmoji} ${a.roleTitle})
          </option>
        `).join("")}
    `;
  }

  if (modal) modal.classList.add("active");
}

function closeSwapModal() {
  const modal = document.getElementById("swap-modal");
  if (modal) modal.classList.remove("active");
  currentSwapStudentId = null;
}

function applySwapRole() {
  if (!currentSwapStudentId) return;

  const partnerSelectEl = document.getElementById("swap-partner-select");
  const roleSelectEl = document.getElementById("swap-role-select");

  const partnerStudentId = partnerSelectEl ? parseInt(partnerSelectEl.value, 10) : null;
  const targetStudentIdx = appState.assignments.findIndex(a => a.studentId === currentSwapStudentId);

  if (targetStudentIdx === -1) return;

  if (partnerStudentId) {
    const partnerIdx = appState.assignments.findIndex(a => a.studentId === partnerStudentId);
    if (partnerIdx !== -1) {
      const tempRole = {
        roleId: appState.assignments[targetStudentIdx].roleId,
        roleTitle: appState.assignments[targetStudentIdx].roleTitle,
        roleEmoji: appState.assignments[targetStudentIdx].roleEmoji,
        roleDesc: appState.assignments[targetStudentIdx].roleDesc
      };

      appState.assignments[targetStudentIdx].roleId = appState.assignments[partnerIdx].roleId;
      appState.assignments[targetStudentIdx].roleTitle = appState.assignments[partnerIdx].roleTitle;
      appState.assignments[targetStudentIdx].roleEmoji = appState.assignments[partnerIdx].roleEmoji;
      appState.assignments[targetStudentIdx].roleDesc = appState.assignments[partnerIdx].roleDesc;

      appState.assignments[partnerIdx].roleId = tempRole.roleId;
      appState.assignments[partnerIdx].roleTitle = tempRole.roleTitle;
      appState.assignments[partnerIdx].roleEmoji = tempRole.roleEmoji;
      appState.assignments[partnerIdx].roleDesc = tempRole.roleDesc;

      showToast(`🔄 ${appState.assignments[targetStudentIdx].studentName} 친구와 ${appState.assignments[partnerIdx].studentName} 친구의 역할이 서로 바뀌었어요!`);
    }
  } else if (roleSelectEl) {
    const selectedRoleId = parseInt(roleSelectEl.value, 10);
    const selectedRole = appState.roles.find(r => r.id === selectedRoleId);
    if (selectedRole) {
      appState.assignments[targetStudentIdx].roleId = selectedRole.id;
      appState.assignments[targetStudentIdx].roleTitle = selectedRole.title;
      appState.assignments[targetStudentIdx].roleEmoji = selectedRole.emoji;
      appState.assignments[targetStudentIdx].roleDesc = selectedRole.desc;
      showToast(`✨ ${appState.assignments[targetStudentIdx].studentName} 친구의 역할이 '${selectedRole.title}'(으)로 바뀌었어요!`);
    }
  }

  saveToLocalStorage();
  renderUI();
  closeSwapModal();
}

// ==========================================
// 8. 명단 및 역할 관리
// ==========================================
function openManageModal() {
  const modal = document.getElementById("manage-modal");
  const studentNamesTextarea = document.getElementById("manage-students-textarea");
  const classInput = document.getElementById("manage-class-name");
  const termInput = document.getElementById("manage-term-name");

  if (classInput) classInput.value = appState.className;
  if (termInput) termInput.value = appState.termName;

  if (studentNamesTextarea) {
    studentNamesTextarea.value = appState.students.map(s => s.name).join("\n");
  }

  renderManageRolesList();
  if (modal) modal.classList.add("active");
}

function closeManageModal() {
  const modal = document.getElementById("manage-modal");
  if (modal) modal.classList.remove("active");
}

function renderManageRolesList() {
  const container = document.getElementById("manage-roles-container");
  if (!container) return;

  container.innerHTML = appState.roles.map((role, idx) => `
    <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
      <span style="font-family: var(--font-display); font-size: 13px; color: #a8a29e; width: 28px;">#${idx + 1}</span>
      <input type="text" class="manage-role-emoji" value="${escapeHtml(role.emoji)}" style="width: 44px; text-align: center;">
      <input type="text" class="manage-role-title" value="${escapeHtml(role.title)}" style="width: 140px; font-weight: 700; font-family: var(--font-display);">
      <input type="text" class="manage-role-desc" value="${escapeHtml(role.desc)}" style="flex: 1;" placeholder="역할 설명">
      <button type="button" class="btn-puffy" onclick="deleteRoleByIndex(${idx})" style="padding: 4px 8px; color: #ef4444; background: #fee2e2; border-color: #fca5a5;" title="삭제">
        ✕
      </button>
    </div>
  `).join("");
}

function addNewRoleRow() {
  appState.roles.push({
    id: Date.now(),
    title: "새 역할",
    emoji: "⭐",
    desc: "담당 역할을 성실하게 수행해요."
  });
  renderManageRolesList();
}

function deleteRoleByIndex(index) {
  if (appState.roles.length <= 1) {
    showToast("⚠️ 최소 1개 이상의 역할이 있어야 합니다.");
    return;
  }
  appState.roles.splice(index, 1);
  renderManageRolesList();
}

function saveManageSettings() {
  const classInput = document.getElementById("manage-class-name");
  const termInput = document.getElementById("manage-term-name");
  const studentNamesTextarea = document.getElementById("manage-students-textarea");

  if (classInput && classInput.value.trim()) appState.className = classInput.value.trim();
  if (termInput && termInput.value.trim()) appState.termName = termInput.value.trim();

  if (studentNamesTextarea) {
    const lines = studentNamesTextarea.value.split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length > 0) {
      appState.students = lines.map((name, i) => ({
        id: i + 1,
        name: name
      }));
    }
  }

  const roleEmojiInputs = document.querySelectorAll(".manage-role-emoji");
  const roleTitleInputs = document.querySelectorAll(".manage-role-title");
  const roleDescInputs = document.querySelectorAll(".manage-role-desc");

  const updatedRoles = [];
  roleTitleInputs.forEach((input, i) => {
    const title = input.value.trim();
    if (title) {
      updatedRoles.push({
        id: i + 1,
        title: title,
        emoji: roleEmojiInputs[i] ? roleEmojiInputs[i].value.trim() || '⭐' : '⭐',
        desc: roleDescInputs[i] ? roleDescInputs[i].value.trim() : ''
      });
    }
  });

  if (updatedRoles.length > 0) {
    appState.roles = updatedRoles;
  }

  saveToLocalStorage();
  closeManageModal();
  renderUI();
  showToast("💾 학생 명단과 역할 목록이 예쁘게 저장되었어요!");
}

function resetToDefaultData() {
  if (!confirm("기본 예시 데이터(학생 20명, 역할 20개)로 되돌릴까요?")) return;

  appState.students = [...DEFAULT_STUDENTS];
  appState.roles = [...DEFAULT_ROLES];
  appState.assignments = [];
  saveToLocalStorage();
  closeManageModal();
  renderUI();
  showToast("🔄 기본 예시 데이터로 돌아왔어요!");
}

// ==========================================
// 9. 구글 스프레드시트 연동
// ==========================================
function openSheetsModal() {
  const modal = document.getElementById("sheets-modal");
  const urlInput = document.getElementById("sheets-webapp-url");
  if (urlInput) {
    urlInput.value = appState.sheetsWebAppUrl || "";
  }
  if (modal) modal.classList.add("active");
}

function closeSheetsModal() {
  const modal = document.getElementById("sheets-modal");
  if (modal) modal.classList.remove("active");
}

function saveSheetsUrl() {
  const urlInput = document.getElementById("sheets-webapp-url");
  if (urlInput) {
    appState.sheetsWebAppUrl = urlInput.value.trim();
    saveToLocalStorage();
    showToast("🔗 구글 웹 앱 주소가 저장되었습니다!");
  }
}

async function loadFromGoogleSheets() {
  const url = appState.sheetsWebAppUrl || (document.getElementById("sheets-webapp-url") ? document.getElementById("sheets-webapp-url").value.trim() : "");
  
  if (!url) {
    openSheetsModal();
    showToast("ℹ️ 먼저 구글 Apps Script Web App 주소를 등록해 주세요!");
    return;
  }

  showToast("⏳ 구글 스프레드시트에서 명단을 가져오는 중...");
  
  try {
    const response = await fetch(url + (url.includes('?') ? '&' : '?') + 'action=load', {
      method: "GET",
      mode: "cors"
    });

    if (!response.ok) throw new Error(`응답 상태: ${response.status}`);

    const data = await response.json();
    if (data.students && Array.isArray(data.students)) appState.students = data.students;
    if (data.roles && Array.isArray(data.roles)) appState.roles = data.roles;
    if (data.assignments && Array.isArray(data.assignments)) appState.assignments = data.assignments;

    saveToLocalStorage();
    renderUI();
    closeSheetsModal();
    showToast("✅ 구글 스프레드시트에서 명단을 쏙 불러왔어요!");
  } catch (err) {
    console.error("구글 시트 연동 오류:", err);
    alert(`[시트 불러오기 안내]\n\n아직 Apps Script 웹앱이 배포되지 않았거나 주소를 확인해 주세요.\nURL: ${url}\n상세: ${err.message}\n\n'시트 연동 안내'의 Apps Script 코드를 복사하여 Google Sheets에 부착해 주세요!`);
  }
}

async function saveToGoogleSheets() {
  const url = appState.sheetsWebAppUrl || (document.getElementById("sheets-webapp-url") ? document.getElementById("sheets-webapp-url").value.trim() : "");
  
  if (!url) {
    openSheetsModal();
    showToast("ℹ️ 먼저 구글 Apps Script Web App 주소를 등록해 주세요!");
    return;
  }

  if (appState.assignments.length === 0) {
    showToast("⚠️ 저장할 배정 결과가 없어요. 먼저 역할을 뽑아주세요!");
    return;
  }

  showToast("⏳ 구글 스프레드시트에 저장하는 중...");

  const payload = {
    action: "save",
    className: appState.className,
    termName: appState.termName,
    date: new Date().toISOString(),
    assignments: appState.assignments,
    students: appState.students,
    roles: appState.roles
  };

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    closeSheetsModal();
    showToast("✅ 구글 스프레드시트로 결과가 안전하게 전송되었어요!");
  } catch (err) {
    console.error("구글 시트 저장 오류:", err);
    alert(`[시트 저장 오류]\n\n전송 중 오류: ${err.message}`);
  }
}

function exportToCSV() {
  if (appState.assignments.length === 0) {
    showToast("⚠️ 먼저 [🎲 역할 뽑기 시작!]을 눌러 배정해 주세요!");
    return;
  }

  let csvContent = "\uFEFF";
  csvContent += "번호,학생 이름,역할명,이모지,역할 설명,학급,학기\n";
  appState.assignments.forEach(item => {
    csvContent += `"${item.studentId}","${item.studentName}","${item.roleTitle}","${item.roleEmoji}","${item.roleDesc}","${appState.className}","${appState.termName}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `우리반_1인1역할_${appState.className}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("📥 엑셀용 CSV 파일로 다운로드되었어요!");
}

// ==========================================
// 10. 유틸리티 & 토스트
// ==========================================
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast-notice");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// ==========================================
// 11. 이벤트 리스너 등록
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();

  const btnShuffle = document.getElementById("btn-shuffle");
  const btnPrint = document.getElementById("btn-print");
  const btnSheetLoad = document.getElementById("btn-sheet-load");
  const btnSheetSave = document.getElementById("btn-sheet-save");
  const btnManage = document.getElementById("btn-manage");
  const btnReset = document.getElementById("btn-reset");
  const btnExportCsv = document.getElementById("btn-export-csv");
  const searchInput = document.getElementById("search-input");

  if (btnShuffle) btnShuffle.addEventListener("click", assignRoles);
  if (btnPrint) btnPrint.addEventListener("click", handlePrint);
  if (btnSheetLoad) btnSheetLoad.addEventListener("click", loadFromGoogleSheets);
  if (btnSheetSave) btnSheetSave.addEventListener("click", saveToGoogleSheets);
  if (btnManage) btnManage.addEventListener("click", openManageModal);
  if (btnExportCsv) btnExportCsv.addEventListener("click", exportToCSV);

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("배정된 결과를 초기화하고 다시 뽑으시겠습니까?")) {
        appState.assignments = [];
        saveToLocalStorage();
        renderUI();
        showToast("🧹 역할 배정이 깨끗하게 초기화되었어요.");
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.searchQuery = e.target.value;
      renderUI();
    });
  }

  const btnViewCard = document.getElementById("btn-view-card");
  const btnViewTable = document.getElementById("btn-view-table");

  if (btnViewCard && btnViewTable) {
    btnViewCard.addEventListener("click", () => {
      appState.viewMode = "card";
      btnViewCard.classList.add("active");
      btnViewTable.classList.remove("active");
      renderUI();
    });

    btnViewTable.addEventListener("click", () => {
      appState.viewMode = "table";
      btnViewTable.classList.add("active");
      btnViewCard.classList.remove("active");
      renderUI();
    });
  }

  const tabStudentsBtn = document.getElementById("tab-students-btn");
  const tabRolesBtn = document.getElementById("tab-roles-btn");
  const tabStudentsContent = document.getElementById("tab-students-content");
  const tabRolesContent = document.getElementById("tab-roles-content");

  if (tabStudentsBtn && tabRolesBtn && tabStudentsContent && tabRolesContent) {
    tabStudentsBtn.addEventListener("click", () => {
      tabStudentsBtn.classList.add("active");
      tabRolesBtn.classList.remove("active");
      tabStudentsContent.style.display = "block";
      tabRolesContent.style.display = "none";
    });

    tabRolesBtn.addEventListener("click", () => {
      tabRolesBtn.classList.add("active");
      tabStudentsBtn.classList.remove("active");
      tabStudentsContent.style.display = "none";
      tabRolesContent.style.display = "block";
    });
  }

  renderUI();
});

// 전역 바인딩
window.assignRoles = assignRoles;
window.handlePrint = handlePrint;
window.openSwapModal = openSwapModal;
window.closeSwapModal = closeSwapModal;
window.applySwapRole = applySwapRole;
window.openManageModal = openManageModal;
window.closeManageModal = closeManageModal;
window.saveManageSettings = saveManageSettings;
window.resetToDefaultData = resetToDefaultData;
window.addNewRoleRow = addNewRoleRow;
window.deleteRoleByIndex = deleteRoleByIndex;
window.openSheetsModal = openSheetsModal;
window.closeSheetsModal = closeSheetsModal;
window.saveSheetsUrl = saveSheetsUrl;
window.loadFromGoogleSheets = loadFromGoogleSheets;
window.saveToGoogleSheets = saveToGoogleSheets;
window.exportToCSV = exportToCSV;
