/**
 * 우리 반 1인 1역할 배정 시스템 - script.js
 * 초등학생 학급 1인 1역할 무작위 배정, A4 인쇄, 구글 스프레드시트(Apps Script) 연동 지원
 */

// ==========================================
// 1. 기본 예시 데이터 (학생 20명 & 역할 20개)
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
  { id: 1, title: "칠판 지우미", emoji: "🧹", desc: "수업이 끝나면 칠판을 깨끗하게 닦고 분필 가루를 털어요." },
  { id: 2, title: "우유 도우미", emoji: "🥛", desc: "아침마다 우리 반 우유 상자를 챙겨오고 정리해요." },
  { id: 3, title: "줄서기 반장", emoji: "🚶", desc: "이동 수업이나 급식실 갈 때 바르고 조용하게 줄을 세워요." },
  { id: 4, title: "급식 도우미", emoji: "🍱", desc: "급식판을 질서 있게 받도록 돕고 식탁을 닦아요." },
  { id: 5, title: "분리수거 대장", emoji: "♻️", desc: "우유팩, 종이, 플라스틱을 올바른 통에 바르게 분리수거해요." },
  { id: 6, title: "초록 식물 가꾸기", emoji: "🌱", desc: "교실 화분에 물을 골고루 주고 사랑의 말을 건네요." },
  { id: 7, title: "창문 환기 대장", emoji: "🪟", desc: "쉬는 시간과 점심시간에 창문을 열어 맑은 공기를 채워요." },
  { id: 8, title: "학급 문고 관리자", emoji: "📚", desc: "교실 뒤 책꽂이의 책들이 번호대로 가지런히 꽂히게 관리해요." },
  { id: 9, title: "학습지 나누미", emoji: "📑", desc: "선생님께서 주시는 학습지와 유인물을 짝꿍에게 바르게 전달해요." },
  { id: 10, title: "컴퓨터·TV 도우미", emoji: "💻", desc: "수업 시간 전자칠판과 컴퓨터 리모컨을 바르게 챙겨요." },
  { id: 11, title: "소지품 정리왕", emoji: "🎒", desc: "사물함 위와 책상 옆걸이가 단정하게 정돈되도록 살펴봐요." },
  { id: 12, title: "체육 기구 도우미", emoji: "⚽", desc: "체육 시간에 공과 줄넘기를 챙겨오고 제자리에 넣어요." },
  { id: 13, title: "에너지 지킴이", emoji: "💡", desc: "교실을 비울 때 전등과 선풍기/에어컨을 끄고 전기를 아껴요." },
  { id: 14, title: "신발장 정리왕", emoji: "👟", desc: "친구들의 실내화가 삐뚤어지지 않게 가지런히 모아요." },
  { id: 15, title: "청소함 정리도우미", emoji: "🧺", desc: "빗자루와 쓰레받기가 청소도구함에 제자리로 들어가게 도와줘요." },
  { id: 16, title: "손 소독 지킴이", emoji: "🧴", desc: "교실에 들어올 때 친구들이 손 소독을 깨끗이 하도록 안내해요." },
  { id: 17, title: "시간 알림이", emoji: "⏰", desc: "수업 시작종이 치면 자리에 앉도록 친구들에게 조용히 알려줘요." },
  { id: 18, title: "칭찬 우체부", emoji: "💌", desc: "칭찬 상자의 따뜻한 편지를 모아서 친구들에게 전달해요." },
  { id: 19, title: "미술 재료 도우미", emoji: "🎨", desc: "미술 시간에 가위, 풀, 색연필 바구니를 바르게 준비해요." },
  { id: 20, title: "교실 안전 지킴이", emoji: "🛡️", desc: "복도나 교실에서 뛰는 친구들에게 친절하게 조심하자고 말해요." }
];

const THEME_COLORS = ["blue", "green", "peach", "purple", "pink", "yellow", "mint"];

// ==========================================
// 2. 애플리케이션 상태 관리
// ==========================================
let appState = {
  className: "3학년 2반",
  termName: "2026학년도 1학기",
  students: [...DEFAULT_STUDENTS],
  roles: [...DEFAULT_ROLES],
  assignments: [], // { studentId, studentName, roleId, roleTitle, roleEmoji, roleDesc }
  viewMode: "card", // "card" | "table"
  searchQuery: "",
  sheetsWebAppUrl: ""
};

// ==========================================
// 3. 로컬 스토리지 연동 (자동 저장 및 복원)
// ==========================================
const STORAGE_KEY = "class_role_manager_state_v1";

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
// 4. 핵심 로직: 피셔-예이츠 무작위 배정 알고리즘
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
    showToast("⚠️ 배정할 학생 명단이 없습니다.");
    return;
  }
  if (appState.roles.length === 0) {
    showToast("⚠️ 배정할 역할 목록이 없습니다.");
    return;
  }

  const resultsGrid = document.getElementById("cards-grid");
  const tableView = document.getElementById("table-view-container");
  
  // 셔플 애니메이션 느낌을 주기 위한 가벼운 블러 효과
  if (resultsGrid) resultsGrid.classList.add("shuffling-animation");
  if (tableView) tableView.classList.add("shuffling-animation");

  setTimeout(() => {
    // 역할을 학생 수에 맞추어 무작위 셔플
    // 역할 수가 학생 수보다 적으면 순환 배정, 많으면 랜덤 선택
    let shuffledRoles = shuffleArray(appState.roles);
    
    // 역할 수가 학생 수보다 적을 경우 반복해서 채움
    while (shuffledRoles.length < appState.students.length) {
      shuffledRoles = shuffledRoles.concat(shuffleArray(appState.roles));
    }

    // 학생별 1:1 매칭
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
    
    if (resultsGrid) resultsGrid.classList.remove("shuffling-animation");
    if (tableView) tableView.classList.remove("shuffling-animation");

    renderUI();
    showToast("🎉 모든 학생에게 1인 1역할이 멋지게 배정되었습니다!");
  }, 400);
}

// ==========================================
// 5. UI 렌더링 함수
// ==========================================
function renderUI() {
  // 상단 학급 정보
  const classBadgeEl = document.getElementById("class-title-badge");
  if (classBadgeEl) {
    classBadgeEl.textContent = `${appState.className} · ${appState.termName}`;
  }

  // 상태 요약 뱃지
  const studentCountEl = document.getElementById("stat-student-count");
  const roleCountEl = document.getElementById("stat-role-count");
  const assignedCountEl = document.getElementById("stat-assigned-count");

  if (studentCountEl) studentCountEl.textContent = `${appState.students.length}명`;
  if (roleCountEl) roleCountEl.textContent = `${appState.roles.length}개`;
  if (assignedCountEl) assignedCountEl.textContent = `${appState.assignments.length}명`;

  // 검색 필터 적용
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
  const resultsContainer = document.getElementById("results-container");

  // 배정 전 상태인 경우
  if (appState.assignments.length === 0) {
    if (emptyStateEl) emptyStateEl.style.display = "block";
    if (cardsGridEl) cardsGridEl.style.display = "none";
    if (tableViewEl) tableViewEl.style.display = "none";
    return;
  }

  if (emptyStateEl) emptyStateEl.style.display = "none";

  // 카드 뷰 / 표 뷰 전환
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

  // A4 인쇄 시트 업데이트
  updatePrintSheet();
}

function renderCards(list, container) {
  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
        🔍 '${escapeHtml(appState.searchQuery)}' 검색 조건과 일치하는 학생이나 역할이 없습니다.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((item, index) => {
    const theme = THEME_COLORS[index % THEME_COLORS.length];
    return `
      <div class="assignment-card card-pop" data-theme="${theme}" style="animation-delay: ${index * 0.02}s">
        <div class="card-top-row">
          <div class="student-meta">
            <span class="student-number-badge">${item.studentId}번</span>
            <span class="student-name">${escapeHtml(item.studentName)}</span>
          </div>
          <button class="btn-card-swap" onclick="openSwapModal(${item.studentId})" title="역할 변경 또는 교환">
            🔄
          </button>
        </div>
        <div class="role-info-box">
          <div class="role-badge-row">
            <span class="role-emoji">${item.roleEmoji || '⭐'}</span>
            <span class="role-title">${escapeHtml(item.roleTitle)}</span>
          </div>
          <p class="role-duty-desc">${escapeHtml(item.roleDesc || '')}</p>
        </div>
      </div>
    `;
  }).join("");
}

function renderTable(list, container) {
  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #64748b;">
        🔍 '${escapeHtml(appState.searchQuery)}' 검색 조건과 일치하는 결과가 없습니다.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="class-table">
      <thead>
        <tr>
          <th style="width: 70px; text-align: center;">번호</th>
          <th style="width: 120px;">학생 이름</th>
          <th style="width: 180px;">배정된 역할</th>
          <th>담당 임무 (설명)</th>
          <th style="width: 80px; text-align: center;">관리</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((item) => `
          <tr>
            <td style="text-align: center; font-weight: 700; color: #475569;">${item.studentId}번</td>
            <td style="font-weight: 700; color: #0f172a;">${escapeHtml(item.studentName)}</td>
            <td>
              <span style="font-size: 1.15rem; margin-right: 4px;">${item.roleEmoji || '⭐'}</span>
              <strong style="color: #334155;">${escapeHtml(item.roleTitle)}</strong>
            </td>
            <td style="color: #64748b; font-size: 0.9rem;">${escapeHtml(item.roleDesc || '')}</td>
            <td style="text-align: center;">
              <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.85rem;" onclick="openSwapModal(${item.studentId})">
                변경
              </button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// ==========================================
// 6. A4 게시판 인쇄용 데이터 동기화
// ==========================================
function updatePrintSheet() {
  const printTitleEl = document.getElementById("print-class-title");
  const printDateEl = document.getElementById("print-date");
  const printTable1El = document.getElementById("print-table-body-1");
  const printTable2El = document.getElementById("print-table-body-2");

  if (printTitleEl) {
    printTitleEl.textContent = `[ ${appState.className} ] 우리 반 1인 1역할 배정표 (${appState.termName})`;
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
    showToast("⚠️ 먼저 [🎲 역할 배정하기]를 눌러 배정을 완료해 주세요.");
    return;
  }
  updatePrintSheet();
  window.print();
}

// ==========================================
// 7. 역할 수동 교환 및 단독 변경 모달
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
    titleEl.textContent = `${assignment.studentId}번 ${assignment.studentName} 학생 (현재 역할: ${assignment.roleEmoji} ${assignment.roleTitle})`;
  }

  // 전체 역할 목록 옵션 생성
  if (roleSelectEl) {
    roleSelectEl.innerHTML = appState.roles.map(r => `
      <option value="${r.id}" ${r.title === assignment.roleTitle ? 'selected' : ''}>
        ${r.emoji} ${r.title}
      </option>
    `).join("");
  }

  // 다른 학생과 맞교환할 옵션 목록 생성
  if (partnerSelectEl) {
    partnerSelectEl.innerHTML = `
      <option value="">-- 맞교환할 친구 선택 (선택 사항) --</option>
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
    // 1:1 맞교환 모드
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

      showToast(`🔄 ${appState.assignments[targetStudentIdx].studentName} 학생과 ${appState.assignments[partnerIdx].studentName} 학생의 역할이 맞교환되었습니다.`);
    }
  } else if (roleSelectEl) {
    // 단독 역할 변경 모드
    const selectedRoleId = parseInt(roleSelectEl.value, 10);
    const selectedRole = appState.roles.find(r => r.id === selectedRoleId);
    if (selectedRole) {
      appState.assignments[targetStudentIdx].roleId = selectedRole.id;
      appState.assignments[targetStudentIdx].roleTitle = selectedRole.title;
      appState.assignments[targetStudentIdx].roleEmoji = selectedRole.emoji;
      appState.assignments[targetStudentIdx].roleDesc = selectedRole.desc;
      showToast(`✨ ${appState.assignments[targetStudentIdx].studentName} 학생의 역할이 '${selectedRole.title}'(으)로 변경되었습니다.`);
    }
  }

  saveToLocalStorage();
  renderUI();
  closeSwapModal();
}

// ==========================================
// 8. 명단 및 역할 관리 모달
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
      <span style="font-size: 0.85rem; color: #64748b; width: 28px;">#${idx + 1}</span>
      <input type="text" class="manage-role-emoji" value="${escapeHtml(role.emoji)}" style="width: 48px; text-align: center;">
      <input type="text" class="manage-role-title" value="${escapeHtml(role.title)}" style="width: 140px; font-weight: 600;">
      <input type="text" class="manage-role-desc" value="${escapeHtml(role.desc)}" style="flex: 1;" placeholder="역할 설명">
      <button type="button" class="btn btn-secondary" onclick="deleteRoleByIndex(${idx})" style="padding: 6px 10px; color: #ef4444;" title="삭제">
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
    showToast("⚠️ 최소 1개 이상의 역할이 유지되어야 합니다.");
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

  // 학생 명단 저장
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

  // 역할 목록 저장
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
  showToast("💾 학생 명단 및 역할 목록이 안전하게 저장되었습니다.");
}

function resetToDefaultData() {
  if (!confirm("기본 예시 데이터(학생 20명, 역할 20개)로 초기화하시겠습니까?")) return;

  appState.students = [...DEFAULT_STUDENTS];
  appState.roles = [...DEFAULT_ROLES];
  appState.assignments = [];
  saveToLocalStorage();
  closeManageModal();
  renderUI();
  showToast("🔄 기본 예시 데이터로 초기화되었습니다.");
}

// ==========================================
// 9. 구글 스프레드시트(Apps Script) 연동 자리 및 기능
// ==========================================
function openSheetsModal(defaultTab = 'info') {
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
    showToast("🔗 구글 웹 앱 URL이 저장되었습니다.");
  }
}

// [🔄 시트 불러오기] 버튼 동작
async function loadFromGoogleSheets() {
  const url = appState.sheetsWebAppUrl || (document.getElementById("sheets-webapp-url") ? document.getElementById("sheets-webapp-url").value.trim() : "");
  
  if (!url) {
    openSheetsModal();
    showToast("ℹ️ 구글 Apps Script Web App URL을 입력해 주세요.");
    return;
  }

  showToast("⏳ 구글 스프레드시트에서 데이터를 불러오는 중...");
  
  try {
    const response = await fetch(url + (url.includes('?') ? '&' : '?') + 'action=load', {
      method: "GET",
      mode: "cors"
    });

    if (!response.ok) {
      throw new Error(`서버 응답 코드: ${response.status}`);
    }

    const data = await response.json();
    if (data.students && Array.isArray(data.students)) {
      appState.students = data.students;
    }
    if (data.roles && Array.isArray(data.roles)) {
      appState.roles = data.roles;
    }
    if (data.assignments && Array.isArray(data.assignments)) {
      appState.assignments = data.assignments;
    }

    saveToLocalStorage();
    renderUI();
    closeSheetsModal();
    showToast("✅ 구글 스프레드시트에서 데이터를 성공적으로 불러왔습니다!");
  } catch (err) {
    console.error("구글 시트 연동 오류:", err);
    alert(`[시트 불러오기 안내]\n\n아직 Apps Script 배포 URL이 연결되지 않았거나 CORS 설정이 필요합니다.\nURL: ${url}\n상세: ${err.message}\n\n'시트 연동 안내' 모달에서 제공되는 Apps Script 코드를 복사하여 Google Sheets에 부착해 주세요!`);
  }
}

// [💾 시트에 결과 저장] 버튼 동작
async function saveToGoogleSheets() {
  const url = appState.sheetsWebAppUrl || (document.getElementById("sheets-webapp-url") ? document.getElementById("sheets-webapp-url").value.trim() : "");
  
  if (!url) {
    openSheetsModal();
    showToast("ℹ️ 구글 Apps Script Web App URL을 입력해 주세요.");
    return;
  }

  if (appState.assignments.length === 0) {
    showToast("⚠️ 저장할 배정 결과가 없습니다. 먼저 배정을 진행해 주세요.");
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
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors", // Apps Script 웹앱 리다이렉트 특성 지원
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    closeSheetsModal();
    showToast("✅ 구글 스프레드시트로 배정 결과가 전송되었습니다!");
  } catch (err) {
    console.error("구글 시트 저장 오류:", err);
    alert(`[시트 저장 안내]\n\n구글 Apps Script 웹앱으로 전송 중 오류가 발생했습니다.\n상세: ${err.message}`);
  }
}

// 즉시 실무에 쓸 수 있는 CSV 내보내기/백업 기능
function exportToCSV() {
  if (appState.assignments.length === 0) {
    showToast("⚠️ 먼저 [🎲 역할 배정하기]를 진행해 주세요.");
    return;
  }

  let csvContent = "\uFEFF"; // UTF-8 BOM
  csvContent += "번호,학생 이름,역할명,이모지,역할 설명,학급,학기\n";
  appState.assignments.forEach(item => {
    csvContent += `"${item.studentId}","${item.studentName}","${item.roleTitle}","${item.roleEmoji}","${item.roleDesc}","${appState.className}","${appState.termName}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `우리반_1인1역할배정표_${appState.className}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("📥 엑셀/한글용 CSV 파일로 다운로드되었습니다.");
}

// ==========================================
// 10. 유틸리티 및 토스트 알림
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
// 11. 초기화 및 이벤트 리스너 등록
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // 로컬 스토리지 데이터 로드
  loadFromLocalStorage();

  // 버튼 이벤트 연결
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
      if (confirm("배정된 결과를 초기화하시겠습니까?")) {
        appState.assignments = [];
        saveToLocalStorage();
        renderUI();
        showToast("🧹 역할 배정이 초기화되었습니다.");
      }
    });
  }

  // 검색 인풋 핸들러
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.searchQuery = e.target.value;
      renderUI();
    });
  }

  // 뷰 모드 토글 (카드 vs 표)
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

  // 관리 모달 내부 탭 전환
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

  // 초기 렌더링
  renderUI();
});

// 전역 스코프 함수 노출 (HTML onclick 바인딩용)
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
