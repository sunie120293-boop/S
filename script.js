/**
 * 우리 반 1인 1역할 배정 시스템 - script.js
 * 1. 학생 24명 1지망, 2지망, 3지망 희망 역할 선택 & 역할별 정원 관리
 * 2. AI 희망 순위 배정 알고리즘 (1지망 -> 2지망 -> 3지망 -> 과거 경험 우선순위)
 * 3. 동점 발생 시 교실 실제 가위바위보 일시 정지 & 교사 승자 입력 후속 배정
 * 4. A4 교실 게시판 인쇄 & 구글 스프레드시트 연동
 */

// ==========================================
// 1. 우리 반 학생 24명 & 학급 역할 24개 데이터
// ==========================================
const DEFAULT_STUDENTS = [
  { id: 1, name: "강다은", wishes: [0, 0, 0], pastRole: 0 },
  { id: 2, name: "김민서", wishes: [0, 0, 0], pastRole: 0 },
  { id: 3, name: "김혜린", wishes: [0, 0, 0], pastRole: 0 },
  { id: 4, name: "민미소", wishes: [0, 0, 0], pastRole: 0 },
  { id: 5, name: "손지연", wishes: [0, 0, 0], pastRole: 0 },
  { id: 6, name: "임라온", wishes: [0, 0, 0], pastRole: 0 },
  { id: 7, name: "전가은", wishes: [0, 0, 0], pastRole: 0 },
  { id: 8, name: "정서우", wishes: [0, 0, 0], pastRole: 0 },
  { id: 9, name: "정유주", wishes: [0, 0, 0], pastRole: 0 },
  { id: 10, name: "정하윤", wishes: [0, 0, 0], pastRole: 0 },
  { id: 11, name: "진서하", wishes: [0, 0, 0], pastRole: 0 },
  { id: 12, name: "자누리", wishes: [0, 0, 0], pastRole: 0 },
  { id: 13, name: "권기범", wishes: [0, 0, 0], pastRole: 0 },
  { id: 14, name: "김강민", wishes: [0, 0, 0], pastRole: 0 },
  { id: 15, name: "김성빈", wishes: [0, 0, 0], pastRole: 0 },
  { id: 16, name: "김지효", wishes: [0, 0, 0], pastRole: 0 },
  { id: 17, name: "남유혁", wishes: [0, 0, 0], pastRole: 0 },
  { id: 18, name: "백서진", wishes: [0, 0, 0], pastRole: 0 },
  { id: 19, name: "손성준", wishes: [0, 0, 0], pastRole: 0 },
  { id: 20, name: "송이수", wishes: [0, 0, 0], pastRole: 0 },
  { id: 21, name: "이시원", wishes: [0, 0, 0], pastRole: 0 },
  { id: 22, name: "전유진", wishes: [0, 0, 0], pastRole: 0 },
  { id: 23, name: "정의진", wishes: [0, 0, 0], pastRole: 0 },
  { id: 24, name: "최지훈", wishes: [0, 0, 0], pastRole: 0 }
];

const DEFAULT_ROLES = [
  { id: 1, title: "칠판 지우미", emoji: "🧹", desc: "수업이 끝나면 칠판을 뽀득뽀득 닦고 분필 가루를 털어요.", capacity: 1 },
  { id: 2, title: "우유 도우미", emoji: "🥛", desc: "아침마다 우리 반 건강 우유 상자를 챙겨오고 정리해요.", capacity: 1 },
  { id: 3, title: "줄서기 반장", emoji: "🚶", desc: "이동 수업이나 급식실 갈 때 바르고 조용하게 줄을 세워요.", capacity: 1 },
  { id: 4, title: "급식 도우미", emoji: "🍱", desc: "급식판을 질서 있게 받도록 돕고 식탁을 닦아요.", capacity: 1 },
  { id: 5, title: "분리수거 대장", emoji: "♻️", desc: "우유팩, 종이, 플라스틱을 올바른 통에 바르게 분리수거해요.", capacity: 1 },
  { id: 6, title: "초록 식물 가꾸기", emoji: "🌱", desc: "교실 화분에 물을 퐁퐁 주고 사랑의 말을 건네요.", capacity: 1 },
  { id: 7, title: "창문 환기 대장", emoji: "🪟", desc: "쉬는 시간과 점심시간에 창문을 활짝 열어 맑은 공기를 채워요.", capacity: 1 },
  { id: 8, title: "학급 문고 관리자", emoji: "📚", desc: "교실 뒤 책꽂이의 책들이 번호대로 가지런히 꽂히게 살펴봐요.", capacity: 1 },
  { id: 9, title: "학습지 나누미", emoji: "📑", desc: "선생님께서 주시는 학습지를 친구들에게 소중하게 전달해요.", capacity: 1 },
  { id: 10, title: "컴퓨터·TV 도우미", emoji: "💻", desc: "수업 시간 전자칠판과 컴퓨터 리모컨을 바르게 챙겨요.", capacity: 1 },
  { id: 11, title: "소지품 정리왕", emoji: "🎒", desc: "사물함 위와 책상 옆걸이가 단정하게 정돈되도록 살펴봐요.", capacity: 1 },
  { id: 12, title: "체육 기구 도우미", emoji: "⚽", desc: "신나는 체육 시간에 공과 줄넘기를 챙겨오고 제자리에 넣어요.", capacity: 1 },
  { id: 13, title: "에너지 지킴이", emoji: "💡", desc: "교실을 비울 때 전등을 톡 끄고 전기를 아껴요.", capacity: 1 },
  { id: 14, title: "신발장 정리왕", emoji: "👟", desc: "친구들의 실내화가 삐뚤어지지 않게 가지런히 모아요.", capacity: 1 },
  { id: 15, title: "청소함 정리도우미", emoji: "🧺", desc: "빗자루와 쓰레받기가 청소도구함 제자리로 쏙 들어가게 도와줘요.", capacity: 1 },
  { id: 16, title: "손 소독 지킴이", emoji: "🧴", desc: "교실에 들어올 때 친구들이 손 소독을 깨끗이 하도록 안내해요.", capacity: 1 },
  { id: 17, title: "시간 알림이", emoji: "⏰", desc: "수업 시작종이 치면 자리에 앉도록 친구들에게 조용히 알려줘요.", capacity: 1 },
  { id: 18, title: "칭찬 우체부", emoji: "💌", desc: "칭찬 상자의 따뜻한 편지를 모아서 친구들에게 전달해요.", capacity: 1 },
  { id: 19, title: "미술 재료 도우미", emoji: "🎨", desc: "미술 시간에 가위, 풀, 색연필 바구니를 바르게 준비해요.", capacity: 1 },
  { id: 20, title: "교실 안전 지킴이", emoji: "🛡️", desc: "복도나 교실에서 뛰는 친구들에게 친절하게 조심하자고 말해요.", capacity: 1 },
  { id: 21, title: "알림장 도우미", emoji: "📢", desc: "선생님의 알림장 판서 확인을 돕고 친구들에게 알려줘요.", capacity: 1 },
  { id: 22, title: "음악·방송 도우미", emoji: "📻", desc: "아침 자습이나 청소 시간에 잔잔한 힐링 음악을 챙겨요.", capacity: 1 },
  { id: 23, title: "세면대·양치 지킴이", emoji: "🧼", desc: "점심 양치 후 세면대 물기를 닦고 비누를 정돈해요.", capacity: 1 },
  { id: 24, title: "이주의 특별 도우미", emoji: "👑", desc: "선생님과 도움이 필요한 친구의 손을 언제든 잡아줘요.", capacity: 1 }
];

const PASTEL_THEMES = ["pink", "yellow", "mint", "sky", "purple", "orange"];

// ==========================================
// 2. 상태 관리 (2026학년도 2학기)
// ==========================================
let appState = {
  className: "우리 반",
  termName: "2026학년도 2학기",
  students: [...DEFAULT_STUDENTS],
  roles: [...DEFAULT_ROLES],
  assignments: [],
  viewMode: "card",
  searchQuery: "",
  sheetsWebAppUrl: ""
};

const STORAGE_KEY = "class_role_wishes_state_2026_v6";

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

      // 학생 명단 로드 & 희망 배열(wishes) 보정
      if (Array.isArray(parsed.students) && parsed.students.length >= 24) {
        appState.students = parsed.students.map((s, idx) => ({
          id: s.id || idx + 1,
          name: s.name,
          wishes: Array.isArray(s.wishes) && s.wishes.length === 3 ? s.wishes : (DEFAULT_STUDENTS[idx]?.wishes || [0, 0, 0]),
          pastRole: s.pastRole || (DEFAULT_STUDENTS[idx]?.pastRole || 0)
        }));
      } else {
        appState.students = [...DEFAULT_STUDENTS];
      }

      // 역할 목록 로드 & 정원(capacity) 보정
      if (Array.isArray(parsed.roles) && parsed.roles.length >= 24) {
        appState.roles = parsed.roles.map(r => ({
          ...r,
          capacity: r.capacity && r.capacity > 0 ? r.capacity : 1
        }));
      } else {
        appState.roles = [...DEFAULT_ROLES];
      }

      if (Array.isArray(parsed.assignments)) appState.assignments = parsed.assignments;
      if (parsed.sheetsWebAppUrl) appState.sheetsWebAppUrl = parsed.sheetsWebAppUrl;
    } else {
      appState.students = [...DEFAULT_STUDENTS];
      appState.roles = [...DEFAULT_ROLES];
      appState.termName = "2026학년도 2학기";
    }
  } catch (e) {
    console.warn("로컬 데이터 로드 실패:", e);
  }
}

// ==========================================
// 3. AI 희망 역할 배정 엔진 & 동점 발생 시 일시정지 (RPS Pause)
// ==========================================

// 현재 진행 중인 배정 세션 상태
let allocationSession = {
  active: false,
  step: 1, // 1: 1지망, 2: 2지망, 3: 3지망, 4: 잔여 배정
  assignedMap: new Map(), // studentId -> { roleId, wishRank: 1 | 2 | 3 | 'other' }
  roleFillCount: new Map(), // roleId -> number of assigned students
  pendingTie: null // 동점 대기 객체: { roleId, candidateIds, neededCount, wishRank, currentStep }
};

/**
 * [🎲 역할 배정하기] 시작 함수
 */
function startAIAssignment() {
  if (appState.students.length === 0) {
    showToast("⚠️ 학생 명단이 없습니다.");
    return;
  }
  if (appState.roles.length === 0) {
    showToast("⚠️ 역할 목록이 없습니다.");
    return;
  }

  // 희망 조사가 모두 비어있는지 확인
  const hasAnyWish = appState.students.some(s => Array.isArray(s.wishes) && s.wishes.some(w => w > 0));
  if (!hasAnyWish) {
    if (confirm("현재 모든 학생들의 1·2·3지망 희망 역할이 비어있습니다!\n\n[확인]을 누르면 추천 예시 희망 데이터를 자동으로 채운 뒤 공정 배정을 시작합니다.\n[취소]를 누르면 [1·2·3지망 희망 조사표]를 열어 직접 역할을 지정하실 수 있습니다.")) {
      fillRandomWishes();
    } else {
      openWishesModal();
      return;
    }
  }

  showToast("🧠 AI가 학생들의 1·2·3지망을 분석하며 공정 배정을 시작합니다!");

  // 배정 세션 초기화
  allocationSession = {
    active: true,
    step: 1,
    assignedMap: new Map(),
    roleFillCount: new Map(),
    pendingTie: null
  };

  appState.roles.forEach(r => {
    allocationSession.roleFillCount.set(r.id, 0);
  });

  // 순차적 배정 파이프라인 시작
  processNextAllocationStep();
}

/**
 * 배정 단계별 실행기 (1지망 -> 2지망 -> 3지망 -> 잔여 배정)
 */
function processNextAllocationStep() {
  if (!allocationSession.active) return;

  while (allocationSession.step <= 4) {
    const step = allocationSession.step;

    // 배정되지 않은 학생들
    const unassignedStudents = appState.students.filter(s => !allocationSession.assignedMap.has(s.id));
    if (unassignedStudents.length === 0) {
      // 모든 학생 배정 완료!
      finishAllocation();
      return;
    }

    if (step <= 3) {
      // 1지망(step=1), 2지망(step=2), 3지망(step=3) 처리
      const wishIndex = step - 1; // 0, 1, 2

      // 각 역할별로 현재 지망을 쓴 학생 그룹화
      const roleApplicants = new Map();
      unassignedStudents.forEach(student => {
        const targetRoleId = student.wishes[wishIndex];
        if (targetRoleId) {
          if (!roleApplicants.has(targetRoleId)) {
            roleApplicants.set(targetRoleId, []);
          }
          roleApplicants.get(targetRoleId).push(student);
        }
      });

      // 각 역할별 정원 체크 및 동점 검사
      for (const [roleId, applicants] of roleApplicants.entries()) {
        const role = appState.roles.find(r => r.id === roleId);
        if (!role) continue;

        const currentFilled = allocationSession.roleFillCount.get(roleId) || 0;
        const capacityLeft = role.capacity - currentFilled;

        if (capacityLeft <= 0) {
          // 이미 정원이 찬 역할 -> 다음 지망으로 자동 이월
          continue;
        }

        if (applicants.length <= capacityLeft) {
          // 지원자 수가 남은 정원 이하 -> 전원 합격 배정!
          applicants.forEach(student => {
            allocateStudentToRole(student.id, roleId, step);
          });
        } else {
          // 지원자 수가 남은 정원 초과 -> 경쟁 발생!
          // 과거 역할 경험에 따른 우선순위 1차 적용 (해당 역할을 해본 적 없는 미경험자 우선!)
          const nonExperienced = applicants.filter(s => s.pastRole !== roleId);
          const experienced = applicants.filter(s => s.pastRole === roleId);

          let priorityGroup = [];
          if (nonExperienced.length > 0 && experienced.length > 0) {
            // 과거 미경험자에게 우선순위 부여
            priorityGroup = nonExperienced;
          } else {
            // 모두 미경험자이거나 모두 경험자 -> 전원 동등 우선순위
            priorityGroup = applicants;
          }

          if (priorityGroup.length <= capacityLeft) {
            // 우선순위 그룹이 정원 이하인 경우 우선순위 그룹 전원 배정
            priorityGroup.forEach(student => {
              allocateStudentToRole(student.id, roleId, step);
            });
            // 남은 자리가 있다면 경험자 그룹 중에서 다시 체크
            const remainingSpots = capacityLeft - priorityGroup.length;
            if (remainingSpots > 0 && experienced.length > remainingSpots) {
              // 동점 발생! 가위바위보 일시정지 트리거
              pauseForRealRPS(role, experienced.map(s => s.id), remainingSpots, step);
              return; // 루프 멈추고 교사 입력 대기
            } else if (remainingSpots > 0 && experienced.length <= remainingSpots) {
              experienced.forEach(student => {
                allocateStudentToRole(student.id, roleId, step);
              });
            }
          } else {
            // 우선순위가 같은 학생 수가 정원 초과 -> **동점 발생!**
            // AI가 무작위로 선정하지 않고, 즉시 멈추고 실제 교실 가위바위보 안내 모달을 띄움!
            pauseForRealRPS(role, priorityGroup.map(s => s.id), capacityLeft, step);
            return; // 루프 즉시 멈추고 교사의 가위바위보 승자 입력 대기
          }
        }
      }

      allocationSession.step++;
    } else {
      // Step 4: 1, 2, 3지망에서 모두 탈락한 학생들을 남은 빈자리에 배정
      const stillUnassigned = appState.students.filter(s => !allocationSession.assignedMap.has(s.id));
      if (stillUnassigned.length === 0) {
        finishAllocation();
        return;
      }

      // 남은 여석이 있는 역할 찾기
      const availableRoles = appState.roles.filter(r => {
        const filled = allocationSession.roleFillCount.get(r.id) || 0;
        return filled < r.capacity;
      });

      if (availableRoles.length === 0) {
        finishAllocation();
        return;
      }

      // 잔여 역할에 1명씩 배정
      for (const role of availableRoles) {
        const currentFilled = allocationSession.roleFillCount.get(role.id) || 0;
        const capacityLeft = role.capacity - currentFilled;
        const remainingStudents = appState.students.filter(s => !allocationSession.assignedMap.has(s.id));

        if (remainingStudents.length === 0) break;

        if (remainingStudents.length > capacityLeft && availableRoles.length > 1) {
          // 남은 학생 수가 남은 자리보다 많을 때 동점 가위바위보
          pauseForRealRPS(role, remainingStudents.map(s => s.id), capacityLeft, 4);
          return;
        } else {
          // 남은 자리에 순차 배정
          const toAssign = remainingStudents.slice(0, capacityLeft);
          toAssign.forEach(s => {
            allocateStudentToRole(s.id, role.id, 'other');
          });
        }
      }

      allocationSession.step++;
    }
  }

  finishAllocation();
}

/**
 * 학생에게 특정 역할을 확정 등록하는 헬퍼 함수
 */
function allocateStudentToRole(studentId, roleId, wishRank) {
  allocationSession.assignedMap.set(studentId, {
    roleId: roleId,
    wishRank: wishRank
  });
  const currentCount = allocationSession.roleFillCount.get(roleId) || 0;
  allocationSession.roleFillCount.set(roleId, currentCount + 1);
}

/**
 * 동점 발생 시 가위바위보 일시정지 함수
 */
function pauseForRealRPS(role, candidateIds, neededCount, wishRank) {
  allocationSession.pendingTie = {
    roleId: role.id,
    roleTitle: role.title,
    roleEmoji: role.emoji,
    neededCount: neededCount,
    candidateIds: candidateIds,
    wishRank: wishRank,
    selectedWinners: new Set()
  };

  openRPSPauseModal();
}

/**
 * 교실 가위바위보 일시정지 모달 표시
 */
function openRPSPauseModal() {
  const tie = allocationSession.pendingTie;
  if (!tie) return;

  const modal = document.getElementById("rps-pause-modal");
  const roleNameEl = document.getElementById("rps-pause-role-name");
  const neededCountEl = document.getElementById("rps-pause-needed-count");
  const competitorsListEl = document.getElementById("rps-pause-competitors-list");
  const selectedCountEl = document.getElementById("rps-pause-selected-count");
  const targetCountEl = document.getElementById("rps-pause-target-count");

  if (roleNameEl) {
    roleNameEl.textContent = `${tie.roleEmoji} ${tie.roleTitle}`;
  }
  if (neededCountEl) {
    neededCountEl.textContent = `${tie.neededCount}명`;
  }
  if (targetCountEl) {
    targetCountEl.textContent = `${tie.neededCount}명`;
  }
  if (selectedCountEl) {
    selectedCountEl.textContent = `0명`;
  }

  // 후보 학생 목록 렌더링 (123번 순서 및 번호 표기)
  if (competitorsListEl) {
    const sortedIds = [...tie.candidateIds].sort((a, b) => a - b);
    competitorsListEl.innerHTML = sortedIds.map(id => {
      const student = appState.students.find(s => s.id === id);
      if (!student) return "";
      const wishRankText = typeof tie.wishRank === 'number' ? `${tie.wishRank}지망 지원` : '잔여 역할 지원';

      return `
        <div class="competitor-item" id="comp-item-${id}" onclick="toggleRPSWinner(${id})">
          <div class="competitor-info">
            <span class="student-number-circle">${student.id}</span>
            <div>
              <span class="competitor-name">${student.id}번 ${escapeHtml(student.name)}</span>
              <div class="competitor-wish-rank">🎯 ${wishRankText}</div>
            </div>
          </div>
          <div class="competitor-check-icon" id="comp-check-${id}">✔</div>
        </div>
      `;
    }).join("");
  }

  if (modal) modal.classList.add("active");
}

function closeRPSPauseModal() {
  const modal = document.getElementById("rps-pause-modal");
  if (modal) modal.classList.remove("active");
}

/**
 * 교사가 가위바위보 승자 체크박스 토글
 */
function toggleRPSWinner(studentId) {
  const tie = allocationSession.pendingTie;
  if (!tie) return;

  if (tie.selectedWinners.has(studentId)) {
    tie.selectedWinners.delete(studentId);
  } else {
    if (tie.selectedWinners.size >= tie.neededCount) {
      showToast(`⚠️ 승자는 필요한 인원(${tie.neededCount}명)까지만 선택할 수 있습니다.`);
      return;
    }
    tie.selectedWinners.add(studentId);
  }

  // UI 업데이트
  const itemEl = document.getElementById(`comp-item-${studentId}`);
  if (itemEl) {
    if (tie.selectedWinners.has(studentId)) {
      itemEl.classList.add("winner-selected");
    } else {
      itemEl.classList.remove("winner-selected");
    }
  }

  const selectedCountEl = document.getElementById("rps-pause-selected-count");
  if (selectedCountEl) {
    selectedCountEl.textContent = `${tie.selectedWinners.size}명`;
  }
}

/**
 * 교사가 '가위바위보 승자 결과 확정' 버튼 클릭 시 후속 배정 재개
 */
function confirmRPSWinnersAndResume() {
  const tie = allocationSession.pendingTie;
  if (!tie) return;

  if (tie.selectedWinners.size !== tie.neededCount) {
    alert(`가위바위보 승자를 정원(${tie.neededCount}명)에 맞게 정확히 선택해 주세요!\n현재 선택된 승자: ${tie.selectedWinners.size}명`);
    return;
  }

  // 승자들에게 역할 확정 배정
  tie.selectedWinners.forEach(studentId => {
    allocateStudentToRole(studentId, tie.roleId, tie.wishRank);
  });

  const winnerNames = Array.from(tie.selectedWinners).map(id => {
    const s = appState.students.find(st => st.id === id);
    return s ? s.name : `${id}번`;
  }).join(", ");

  showToast(`✌️ 가위바위보 결과 반영 완료! [${winnerNames}] 친구가 ${tie.roleTitle}에 배정되었습니다.`);

  closeRPSPauseModal();
  allocationSession.pendingTie = null;

  // 다음 배정 단계 계속 진행
  setTimeout(() => {
    processNextAllocationStep();
  }, 200);
}

/**
 * 모든 배정 완료 시 최종 결과 발표 및 애니메이션
 */
function finishAllocation() {
  allocationSession.active = false;

  const finalAssignments = appState.students.map(student => {
    const assignedInfo = allocationSession.assignedMap.get(student.id);
    const roleId = assignedInfo ? assignedInfo.roleId : (student.wishes[0] || 1);
    const wishRank = assignedInfo ? assignedInfo.wishRank : 'other';
    const role = appState.roles.find(r => r.id === roleId) || appState.roles[0];

    return {
      studentId: student.id,
      studentName: student.name,
      roleId: role.id,
      roleTitle: role.title,
      roleEmoji: role.emoji,
      roleDesc: role.desc,
      wishRank: wishRank,
      wishes: student.wishes
    };
  });

  appState.assignments = finalAssignments;
  saveToLocalStorage();

  renderUI();
  triggerCuteConfetti();
  showToast("🎉 공정 배정 완료! 모든 학생들의 1인 1역할이 희망 순위와 가위바위보를 통해 완벽히 배정되었습니다!");
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
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 320,
      y: canvas.height * 0.3 + (Math.random() - 0.5) * 120,
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
      p.vy += 0.4;
      p.vx *= 0.98;
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
// 5. [역할 우선 & 123번 학생 번호] 학급 희망 역할 조사/입력 시스템
// ==========================================
let currentWishesTab = 'role'; // 'role' (역할이 앞에 나옴) | 'student' (1번~24번 순)

function openWishesModal() {
  const modal = document.getElementById("wishes-modal");
  if (!modal) return;

  if (currentWishesTab === 'role') {
    renderWishesRoleTable();
  } else {
    renderWishesStudentTable();
  }

  modal.classList.add("active");
}

function closeWishesModal() {
  const modal = document.getElementById("wishes-modal");
  if (modal) modal.classList.remove("active");
}

/**
 * 희망 조사 탭 전환 (역할별 vs 학생별)
 */
function switchWishesTab(tab) {
  currentWishesTab = tab;

  const btnRole = document.getElementById("tab-wishes-role-btn");
  const btnStudent = document.getElementById("tab-wishes-student-btn");
  const containerRole = document.getElementById("wishes-role-view-container");
  const containerStudent = document.getElementById("wishes-student-view-container");
  const bannerRole = document.getElementById("wishes-banner-role");
  const bannerStudent = document.getElementById("wishes-banner-student");

  if (tab === 'role') {
    if (btnRole) btnRole.classList.add("active");
    if (btnStudent) btnStudent.classList.remove("active");
    if (containerRole) containerRole.style.display = "block";
    if (containerStudent) containerStudent.style.display = "none";
    if (bannerRole) bannerRole.style.display = "block";
    if (bannerStudent) bannerStudent.style.display = "none";
    renderWishesRoleTable();
  } else {
    if (btnStudent) btnStudent.classList.add("active");
    if (btnRole) btnRole.classList.remove("active");
    if (containerStudent) containerStudent.style.display = "block";
    if (containerRole) containerRole.style.display = "none";
    if (bannerStudent) bannerStudent.style.display = "block";
    if (bannerRole) bannerRole.style.display = "none";
    renderWishesStudentTable();
  }
}

/**
 * [핵심 기능] 탭 1: 역할 중심 희망 조사표 렌더링
 * 역할이 가장 앞 열에 나오고, 지원 학생이 1번, 2번, 3번 번호 순서로 정돈되어 나타남
 */
function renderWishesRoleTable() {
  const tbody = document.getElementById("wishes-role-tbody");
  if (!tbody) return;

  tbody.innerHTML = appState.roles.map((role) => {
    // 1지망 지원 학생 (1번부터 24번 번호 순서로 정렬, 0은 미선택)
    const applicants1 = appState.students
      .filter(s => Array.isArray(s.wishes) && s.wishes[0] > 0 && s.wishes[0] === role.id)
      .sort((a, b) => a.id - b.id);

    // 2지망 지원 학생 (번호 순 정렬)
    const applicants2 = appState.students
      .filter(s => Array.isArray(s.wishes) && s.wishes[1] > 0 && s.wishes[1] === role.id)
      .sort((a, b) => a.id - b.id);

    // 3지망 지원 학생 (번호 순 정렬)
    const applicants3 = appState.students
      .filter(s => Array.isArray(s.wishes) && s.wishes[2] > 0 && s.wishes[2] === role.id)
      .sort((a, b) => a.id - b.id);

    // 지원 상태 및 경쟁률 계산 (가위바위보 안내)
    const cap = role.capacity || 1;
    let statusHtml = '';
    if (applicants1.length > cap) {
      statusHtml = `
        <div class="badge-status-hot" title="정원보다 1지망 지원자가 많아 가위바위보가 발생합니다!">
          🔥 ${applicants1.length}명 몰림<br>
          <span style="font-size: 10.5px;">(${applicants1.length}:${cap} 가위바위보)</span>
        </div>
      `;
    } else if (applicants1.length === cap) {
      statusHtml = `
        <div class="badge-status-fit">
          🟢 ${applicants1.length}명 (정원 딱맞음)
        </div>
      `;
    } else if (applicants1.length > 0) {
      statusHtml = `
        <div class="badge-status-fit" style="background:#fef9c3; border-color:#fde047; color:#854d0e;">
          🟡 ${applicants1.length}명 (${cap - applicants1.length}자리 여유)
        </div>
      `;
    } else {
      statusHtml = `
        <div class="badge-status-empty">
          ⚪ 0명 지원
        </div>
      `;
    }

    const renderChipList = (list, rank) => {
      const rankClass = rank === 1 ? 'rank-1-chip' : (rank === 2 ? 'rank-2-chip' : 'rank-3-chip');
      const chips = list.map(s => `
        <span class="student-chip-tag ${rankClass}" onclick="openStudentWishEditor(${s.id})" title="${s.id}번 ${escapeHtml(s.name)} 친구의 희망 변경">
          <span class="chip-num">${s.id}번</span>
          <span class="chip-name">${escapeHtml(s.name)}</span>
          <button type="button" class="chip-remove" onclick="event.stopPropagation(); removeStudentWish(${s.id}, ${rank})" title="지원 해제">✕</button>
        </span>
      `).join("");

      return `
        <div class="applicant-chip-list">
          ${chips}
          <button type="button" class="btn-add-applicant" onclick="openAddApplicantModal(${role.id}, ${rank})">
            + 학생 추가
          </button>
        </div>
      `;
    };

    return `
      <tr>
        <!-- 역할명 & 모집 정원 (맨 앞) -->
        <td>
          <div class="role-cell-wrap">
            <div class="role-cell-main">
              <span class="role-cell-emoji">${role.emoji}</span>
              <span class="role-cell-title">${role.id}. ${escapeHtml(role.title)}</span>
            </div>
            <div class="role-cap-box">
              <span>정원:</span>
              <button type="button" class="btn-cap-adj" onclick="adjustRoleCapacity(${role.id}, -1)" title="정원 1명 줄이기">-</button>
              <strong style="color: #1e293b;">${cap}명</strong>
              <button type="button" class="btn-cap-adj" onclick="adjustRoleCapacity(${role.id}, 1)" title="정원 1명 늘리기">+</button>
            </div>
          </div>
        </td>

        <!-- 1지망 지원 학생 (123번) -->
        <td>
          ${renderChipList(applicants1, 1)}
        </td>

        <!-- 2지망 지원 학생 (123번) -->
        <td>
          ${renderChipList(applicants2, 2)}
        </td>

        <!-- 3지망 지원 학생 (123번) -->
        <td>
          ${renderChipList(applicants3, 3)}
        </td>

        <!-- 경쟁 현황 -->
        <td style="text-align: center;">
          ${statusHtml}
        </td>
      </tr>
    `;
  }).join("");
}

/**
 * 탭 2: 학생 번호순 희망 조사표 렌더링
 * 학생 번호 1번~24번 순으로 또박또박 1·2·3지망 역할 드롭다운 표출
 */
function renderWishesStudentTable() {
  const tbody = document.getElementById("wishes-student-tbody");
  if (!tbody) return;

  tbody.innerHTML = appState.students.map((student) => {
    const wish1 = student.wishes[0] || 0;
    const wish2 = student.wishes[1] || 0;
    const wish3 = student.wishes[2] || 0;
    const past = student.pastRole || 0;

    return `
      <tr data-student-id="${student.id}">
        <td style="text-align: center;">
          <div class="student-id-name-cell">
            <span class="student-number-circle">${student.id}</span>
            <strong>${student.id}번 ${escapeHtml(student.name)}</strong>
          </div>
        </td>
        <td>
          <select class="wish-select wish-1" onchange="validateWishesRow(${student.id})">
            ${generateRoleOptions(wish1)}
          </select>
        </td>
        <td>
          <select class="wish-select wish-2" onchange="validateWishesRow(${student.id})">
            ${generateRoleOptions(wish2)}
          </select>
        </td>
        <td>
          <select class="wish-select wish-3" onchange="validateWishesRow(${student.id})">
            ${generateRoleOptions(wish3)}
          </select>
        </td>
        <td>
          <select class="past-role-select">
            <option value="0">-- 없음 / 신규 --</option>
            ${generateRoleOptions(past, false)}
          </select>
        </td>
      </tr>
    `;
  }).join("");
}

/**
 * 역할 선택 옵션 생성 (역할 번호 및 정원 포함, 0은 미선택)
 */
function generateRoleOptions(selectedId, allowEmpty = true) {
  let emptyOpt = allowEmpty ? `<option value="0" ${!selectedId || selectedId === 0 ? 'selected' : ''}>-- 미선택 (선택 안 함) --</option>` : '';
  return emptyOpt + appState.roles.map(r => `
    <option value="${r.id}" ${r.id === selectedId ? 'selected' : ''}>
      #${r.id}. ${r.emoji} ${r.title} (정원 ${r.capacity}명)
    </option>
  `).join("");
}

/**
 * 역할별 희망 조사표에서 정원 즉시 조절 (+ / -)
 */
function adjustRoleCapacity(roleId, delta) {
  const role = appState.roles.find(r => r.id === roleId);
  if (!role) return;

  const currentCap = role.capacity || 1;
  const newCap = Math.max(1, currentCap + delta);
  role.capacity = newCap;

  saveToLocalStorage();
  renderWishesRoleTable();
  renderUI();
  showToast(`⚙️ '${role.title}' 역할의 정원이 ${newCap}명으로 변경되었습니다.`);
}

/**
 * 학생 개인 희망 역할 빠른 수정 팝업 열기
 */
function openStudentWishEditor(studentId) {
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;

  const modal = document.getElementById("student-wish-modal");
  const titleEl = document.getElementById("student-wish-editor-title");
  const idInput = document.getElementById("edit-wish-student-id");
  const sel1 = document.getElementById("edit-wish-1");
  const sel2 = document.getElementById("edit-wish-2");
  const sel3 = document.getElementById("edit-wish-3");
  const pastSel = document.getElementById("edit-past-role");

  if (titleEl) {
    titleEl.innerHTML = `<span>✏️</span> ${student.id}번 ${escapeHtml(student.name)} 학생 희망 역할 수정`;
  }
  if (idInput) idInput.value = student.id;

  const w1 = student.wishes[0] || 0;
  const w2 = student.wishes[1] || 0;
  const w3 = student.wishes[2] || 0;
  const past = student.pastRole || 0;

  if (sel1) sel1.innerHTML = generateRoleOptions(w1, true);
  if (sel2) sel2.innerHTML = generateRoleOptions(w2, true);
  if (sel3) sel3.innerHTML = generateRoleOptions(w3, true);
  if (pastSel) {
    pastSel.innerHTML = `<option value="0">-- 없음 / 신규 --</option>` + generateRoleOptions(past, false);
  }

  if (modal) modal.classList.add("active");
}

function closeStudentWishEditor() {
  const modal = document.getElementById("student-wish-modal");
  if (modal) modal.classList.remove("active");
}

function applyStudentWishEdit() {
  const idInput = document.getElementById("edit-wish-student-id");
  if (!idInput) return;

  const studentId = parseInt(idInput.value, 10);
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;

  const sel1 = document.getElementById("edit-wish-1");
  const sel2 = document.getElementById("edit-wish-2");
  const sel3 = document.getElementById("edit-wish-3");
  const pastSel = document.getElementById("edit-past-role");

  const v1 = parseInt(sel1.value, 10) || 0;
  const v2 = parseInt(sel2.value, 10) || 0;
  const v3 = parseInt(sel3.value, 10) || 0;

  if ((v1 > 0 && (v1 === v2 || v1 === v3)) || (v2 > 0 && v2 === v3)) {
    alert("한 학생이 동일한 역할을 1, 2, 3지망으로 중복 선택할 수 없습니다!\n서로 다른 역할을 골라주세요.");
    return;
  }

  student.wishes = [v1, v2, v3];
  student.pastRole = parseInt(pastSel.value, 10) || 0;

  saveToLocalStorage();
  closeStudentWishEditor();
  if (currentWishesTab === 'role') {
    renderWishesRoleTable();
  } else {
    renderWishesStudentTable();
  }
  renderUI();
  showToast(`✨ ${student.id}번 ${student.name} 친구의 희망 역할이 저장되었습니다.`);
}

/**
 * 역할별 희망 조사에서 특정 역할에 학생 추가 팝업 열기
 */
function openAddApplicantModal(roleId, rank) {
  const role = appState.roles.find(r => r.id === roleId);
  if (!role) return;

  const modal = document.getElementById("add-applicant-modal");
  const titleEl = document.getElementById("add-applicant-title");
  const descEl = document.getElementById("add-applicant-desc");
  const idInput = document.getElementById("add-applicant-role-id");
  const rankInput = document.getElementById("add-applicant-rank");
  const studentSelect = document.getElementById("add-applicant-student-select");

  if (idInput) idInput.value = roleId;
  if (rankInput) rankInput.value = rank;

  if (titleEl) {
    titleEl.innerHTML = `<span>➕</span> ${role.emoji} ${role.title} (${rank}지망 지원자 추가)`;
  }
  if (descEl) {
    descEl.textContent = `이 역할을 ${rank}지망으로 희망할 학생을 1번~24번 명단에서 선택해 주세요.`;
  }

  // 1번부터 24번까지 정렬된 학생 선택 드롭다운
  if (studentSelect) {
    studentSelect.innerHTML = appState.students
      .sort((a, b) => a.id - b.id)
      .map(s => {
        const curWishAtRank = s.wishes[rank - 1];
        const isCurrent = curWishAtRank === roleId;
        const curRole = appState.roles.find(r => r.id === curWishAtRank);
        const curRoleText = curRole ? ` (현재: ${curRole.title})` : '';

        return `
          <option value="${s.id}" ${isCurrent ? 'disabled' : ''}>
            ${s.id}번 ${escapeHtml(s.name)}${isCurrent ? ' (이미 선택됨)' : curRoleText}
          </option>
        `;
      }).join("");
  }

  if (modal) modal.classList.add("active");
}

function closeAddApplicantModal() {
  const modal = document.getElementById("add-applicant-modal");
  if (modal) modal.classList.remove("active");
}

function confirmAddApplicant() {
  const idInput = document.getElementById("add-applicant-role-id");
  const rankInput = document.getElementById("add-applicant-rank");
  const studentSelect = document.getElementById("add-applicant-student-select");

  if (!idInput || !rankInput || !studentSelect) return;

  const roleId = parseInt(idInput.value, 10);
  const rank = parseInt(rankInput.value, 10);
  const studentId = parseInt(studentSelect.value, 10);

  const student = appState.students.find(s => s.id === studentId);
  const role = appState.roles.find(r => r.id === roleId);
  if (!student || !role) return;

  const targetIdx = rank - 1;
  const oldWish = student.wishes[targetIdx];
  student.wishes[targetIdx] = roleId;

  // 만약 다른 지망과 중복되었다면 해당 지망을 기존 역할로 교체하여 중복 방지
  for (let i = 0; i < 3; i++) {
    if (i !== targetIdx && student.wishes[i] === roleId) {
      student.wishes[i] = oldWish || (appState.roles.find(r => r.id !== roleId && !student.wishes.includes(r.id))?.id || 1);
    }
  }

  saveToLocalStorage();
  closeAddApplicantModal();
  renderWishesRoleTable();
  renderUI();
  showToast(`👍 ${student.id}번 ${student.name} 친구가 '${role.title}'의 ${rank}지망으로 등록되었어요!`);
}

/**
 * 역할별 희망 조사에서 특정 학생의 지망 해제 (0으로 깨끗이 삭제)
 */
function removeStudentWish(studentId, rank) {
  const student = appState.students.find(s => s.id === studentId);
  if (!student) return;

  const targetIdx = rank - 1;
  const curRole = appState.roles.find(r => r.id === student.wishes[targetIdx]);
  const roleTitle = curRole ? curRole.title : '역할';

  student.wishes[targetIdx] = 0;

  saveToLocalStorage();
  renderWishesRoleTable();
  renderUI();
  showToast(`✕ ${student.id}번 ${student.name} 친구의 '${roleTitle}' ${rank}지망이 지워졌습니다.`);
}

/**
 * 모든 학생의 1·2·3지망 희망 역할을 전부 지우기 (초기화)
 */
function clearAllWishes() {
  if (!confirm("모든 학생의 1·2·3지망 희망 역할을 전부 지우시겠습니까?\n\n(1지망, 2지망, 3지망이 모두 깨끗하게 비워집니다.)")) return;

  appState.students.forEach(s => {
    s.wishes = [0, 0, 0];
  });

  saveToLocalStorage();
  if (currentWishesTab === 'role') {
    renderWishesRoleTable();
  } else {
    renderWishesStudentTable();
  }
  renderUI();
  showToast("🧹 학생들의 1·2·3지망 지원 내역이 모두 깨끗하게 지워졌습니다!");
}

/**
 * 동일한 역할 중복 선택 방지 유효성 검사 (학생별 테이블 탭용)
 */
function validateWishesRow(studentId) {
  const row = document.querySelector(`tr[data-student-id="${studentId}"]`) || event?.target?.closest("tr");
  if (!row) return;

  const sel1 = row.querySelector(".wish-1");
  const sel2 = row.querySelector(".wish-2");
  const sel3 = row.querySelector(".wish-3");

  const v1 = parseInt(sel1.value, 10) || 0;
  const v2 = parseInt(sel2.value, 10) || 0;
  const v3 = parseInt(sel3.value, 10) || 0;

  if ((v1 > 0 && (v1 === v2 || v1 === v3)) || (v2 > 0 && v2 === v3)) {
    showToast("⚠️ 한 학생이 동일한 역할을 중복 선택할 수 없습니다.");
    if (v1 === v2 && v2 > 0) {
      sel2.value = "0";
    }
    if ((v1 === v3 || v2 === v3) && v3 > 0) {
      sel3.value = "0";
    }
  }
}

/**
 * 학생 희망 역할 조사 내용 저장
 */
function saveWishesSettings() {
  if (currentWishesTab === 'student') {
    const rows = document.querySelectorAll("#wishes-student-tbody tr");
    if (rows.length > 0) {
      rows.forEach((row, idx) => {
        const sel1 = row.querySelector(".wish-1");
        const sel2 = row.querySelector(".wish-2");
        const sel3 = row.querySelector(".wish-3");
        const pastSel = row.querySelector(".past-role-select");

        if (appState.students[idx] && sel1 && sel2 && sel3) {
          appState.students[idx].wishes = [
            parseInt(sel1.value, 10),
            parseInt(sel2.value, 10),
            parseInt(sel3.value, 10)
          ];
          if (pastSel) {
            appState.students[idx].pastRole = parseInt(pastSel.value, 10) || 0;
          }
        }
      });
    }
  }

  saveToLocalStorage();
  closeWishesModal();
  renderUI();
  showToast("💾 학생 24명의 1·2·3지망 희망 역할이 안전하게 저장되었습니다!");
}

/**
 * 테스트 및 시뮬레이션을 위한 희망 역할 자동 예시 채우기
 */
function fillRandomWishes() {
  appState.students.forEach((student, idx) => {
    const shuffled = shuffleArray(appState.roles.map(r => r.id));
    student.wishes = [shuffled[0], shuffled[1], shuffled[2]];
    student.pastRole = shuffled[3];
  });

  if (currentWishesTab === 'role') {
    renderWishesRoleTable();
  } else {
    renderWishesStudentTable();
  }
  showToast("🎲 24명 학생들의 1·2·3지망 예시 데이터가 골고루 세팅되었습니다!");
}

// ==========================================
// 6. UI 렌더링
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
    
    // 지망 순위 뱃지 라벨
    let rankBadgeHtml = '';
    if (item.wishRank === 1) {
      rankBadgeHtml = `<span class="rank-badge rank-1">🥇 1지망 배정</span>`;
    } else if (item.wishRank === 2) {
      rankBadgeHtml = `<span class="rank-badge rank-2">🥈 2지망 배정</span>`;
    } else if (item.wishRank === 3) {
      rankBadgeHtml = `<span class="rank-badge rank-3">🥉 3지망 배정</span>`;
    } else {
      rankBadgeHtml = `<span class="rank-badge rank-other">🌱 잔여 역할</span>`;
    }

    const studentObj = appState.students.find(s => s.id === item.studentId);
    const wish1Role = studentObj ? appState.roles.find(r => r.id === studentObj.wishes[0])?.title : '';
    const wish2Role = studentObj ? appState.roles.find(r => r.id === studentObj.wishes[1])?.title : '';
    const wish3Role = studentObj ? appState.roles.find(r => r.id === studentObj.wishes[2])?.title : '';

    return `
      <div class="desk-card theme-${theme}">
        <div class="card-header-row">
          <div class="student-tag-group">
            <span class="student-number-circle">${item.studentId}</span>
            <span class="student-name-text">${item.studentId}번 ${escapeHtml(item.studentName)}</span>
          </div>
          <div>${rankBadgeHtml}</div>
        </div>

        <div class="cute-role-bubble">
          <div class="role-title-row">
            <span class="role-big-emoji">${item.roleEmoji || '⭐'}</span>
            <span class="role-title-label">${escapeHtml(item.roleTitle)}</span>
          </div>
          <p class="role-explain-text">${escapeHtml(item.roleDesc || '')}</p>
        </div>

        <div class="card-wishes-summary">
          <span>📋 희망순: 1지망(${wish1Role || '-'}) · 2지망(${wish2Role || '-'}) · 3지망(${wish3Role || '-'})</span>
        </div>

        <div class="card-action-btns">
          <button class="btn-card-mini-swap" onclick="openSwapModal(${item.studentId})" title="역할 변경 또는 맞교환">
            🔄 역할 맞바꾸기
          </button>
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
          <th style="width: 60px; text-align: center;">번호</th>
          <th style="width: 120px;">이름</th>
          <th style="width: 150px;">배정된 역할</th>
          <th style="width: 120px; text-align: center;">희망 순위</th>
          <th>담당 임무 (설명)</th>
          <th style="width: 90px; text-align: center;">관리</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((item) => {
          let rankBadge = '';
          if (item.wishRank === 1) rankBadge = '🥇 1지망';
          else if (item.wishRank === 2) rankBadge = '🥈 2지망';
          else if (item.wishRank === 3) rankBadge = '🥉 3지망';
          else rankBadge = '🌱 잔여';

          return `
            <tr>
              <td style="text-align: center; font-weight: 700; color: #ea580c; font-family: var(--font-display);">${item.studentId}번</td>
              <td style="font-weight: 700; color: #1f2937; font-family: var(--font-display); font-size: 15.5px;">${item.studentId}번 ${escapeHtml(item.studentName)}</td>
              <td>
                <span style="font-size: 18px; margin-right: 4px;">${item.roleEmoji || '⭐'}</span>
                <strong style="color: #374151; font-family: var(--font-display);">${escapeHtml(item.roleTitle)}</strong>
              </td>
              <td style="text-align: center; font-weight: 700; font-family: var(--font-display); color: #0284c7;">${rankBadge}</td>
              <td style="color: #4b5563; font-size: 13px;">${escapeHtml(item.roleDesc || '')}</td>
              <td style="text-align: center;">
                <button class="btn-card-mini-swap" onclick="openSwapModal(${item.studentId})">
                  바꾸기
                </button>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

// ==========================================
// 7. A4 교실 게시판 인쇄용 (24명 2열 배치)
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
    return items.map(item => {
      let wishStr = '';
      if (item.wishRank === 1) wishStr = '1지망';
      else if (item.wishRank === 2) wishStr = '2지망';
      else if (item.wishRank === 3) wishStr = '3지망';
      else wishStr = '잔여';

      return `
        <tr>
          <td class="col-num">${item.studentId}</td>
          <td class="col-name">${escapeHtml(item.studentName)}</td>
          <td class="col-role">${item.roleEmoji} ${escapeHtml(item.roleTitle)}</td>
          <td class="col-wish">${wishStr}</td>
          <td class="col-desc">${escapeHtml(item.roleDesc)}</td>
          <td class="col-check">□</td>
        </tr>
      `;
    }).join("");
  }

  printTable1El.innerHTML = generateRows(leftCol);
  printTable2El.innerHTML = generateRows(rightCol);
}

function handlePrint() {
  if (appState.assignments.length === 0) {
    showToast("⚠️ 먼저 [🎲 AI 희망 역할 배정하기]를 눌러 배정을 완료해 주세요!");
    return;
  }
  updatePrintSheet();
  window.print();
}

// ==========================================
// 8. 개별 역할 맞교환 (선생님 수동 조정)
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
        roleDesc: appState.assignments[targetStudentIdx].roleDesc,
        wishRank: appState.assignments[targetStudentIdx].wishRank
      };

      appState.assignments[targetStudentIdx].roleId = appState.assignments[partnerIdx].roleId;
      appState.assignments[targetStudentIdx].roleTitle = appState.assignments[partnerIdx].roleTitle;
      appState.assignments[targetStudentIdx].roleEmoji = appState.assignments[partnerIdx].roleEmoji;
      appState.assignments[targetStudentIdx].roleDesc = appState.assignments[partnerIdx].roleDesc;
      appState.assignments[targetStudentIdx].wishRank = 'other';

      appState.assignments[partnerIdx].roleId = tempRole.roleId;
      appState.assignments[partnerIdx].roleTitle = tempRole.roleTitle;
      appState.assignments[partnerIdx].roleEmoji = tempRole.roleEmoji;
      appState.assignments[partnerIdx].roleDesc = tempRole.roleDesc;
      appState.assignments[partnerIdx].wishRank = 'other';

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
      appState.assignments[targetStudentIdx].wishRank = 'other';
      showToast(`✨ ${appState.assignments[targetStudentIdx].studentName} 친구의 역할이 '${selectedRole.title}'(으)로 바뀌었어요!`);
    }
  }

  saveToLocalStorage();
  renderUI();
  closeSwapModal();
}

// ==========================================
// 9. 명단 및 역할 관리 (정원 설정 포함)
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
      <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #64748b;">
        <span>정원:</span>
        <input type="number" class="manage-role-cap" value="${role.capacity || 1}" min="1" max="10" style="width: 50px; padding: 4px; text-align: center;">
      </div>
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
    desc: "담당 역할을 성실하게 수행해요.",
    capacity: 1
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
      appState.students = lines.map((name, i) => {
        const existing = appState.students[i];
        return {
          id: i + 1,
          name: name,
          wishes: existing ? existing.wishes : [1, 2, 3],
          pastRole: existing ? existing.pastRole : 0
        };
      });
    }
  }

  const roleEmojiInputs = document.querySelectorAll(".manage-role-emoji");
  const roleTitleInputs = document.querySelectorAll(".manage-role-title");
  const roleCapInputs = document.querySelectorAll(".manage-role-cap");
  const roleDescInputs = document.querySelectorAll(".manage-role-desc");

  const updatedRoles = [];
  roleTitleInputs.forEach((input, i) => {
    const title = input.value.trim();
    if (title) {
      updatedRoles.push({
        id: i + 1,
        title: title,
        emoji: roleEmojiInputs[i] ? roleEmojiInputs[i].value.trim() || '⭐' : '⭐',
        desc: roleDescInputs[i] ? roleDescInputs[i].value.trim() : '',
        capacity: roleCapInputs[i] ? Math.max(1, parseInt(roleCapInputs[i].value, 10) || 1) : 1
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
  if (!confirm("우리 반 기본 24명 명단과 역할로 초기화할까요?")) return;

  appState.students = [...DEFAULT_STUDENTS];
  appState.roles = [...DEFAULT_ROLES];
  appState.termName = "2026학년도 2학기";
  appState.assignments = [];
  saveToLocalStorage();
  closeManageModal();
  renderUI();
  showToast("🔄 우리 반 24명 기본 데이터로 재설정되었어요!");
}

// ==========================================
// 10. 구글 스프레드시트 연동
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
    showToast("⚠️ 저장할 배정 결과가 없어요. 먼저 역할을 배정해 주세요!");
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
    showToast("⚠️ 먼저 [🎲 AI 희망 역할 배정하기]를 눌러 배정해 주세요!");
    return;
  }

  let csvContent = "\uFEFF";
  csvContent += "번호,학생 이름,배정된 역할,희망 순위,이모지,역할 설명,학급,학기\n";
  appState.assignments.forEach(item => {
    const wishStr = typeof item.wishRank === 'number' ? `${item.wishRank}지망` : '잔여역할';
    csvContent += `"${item.studentId}","${item.studentName}","${item.roleTitle}","${wishStr}","${item.roleEmoji}","${item.roleDesc}","${appState.className}","${appState.termName}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `우리반_1인1역할_배정결과_${appState.className}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("📥 엑셀용 CSV 파일로 다운로드되었어요!");
}

// ==========================================
// 11. 유틸리티 & 토스트
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
// 12. 초기화 및 이벤트 리스너 등록
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
  const btnOpenWishes = document.getElementById("btn-open-wishes");
  const searchInput = document.getElementById("search-input");

  if (btnShuffle) btnShuffle.addEventListener("click", startAIAssignment);
  if (btnPrint) btnPrint.addEventListener("click", handlePrint);
  if (btnSheetLoad) btnSheetLoad.addEventListener("click", loadFromGoogleSheets);
  if (btnSheetSave) btnSheetSave.addEventListener("click", saveToGoogleSheets);
  if (btnManage) btnManage.addEventListener("click", openManageModal);
  if (btnExportCsv) btnExportCsv.addEventListener("click", exportToCSV);
  if (btnOpenWishes) btnOpenWishes.addEventListener("click", openWishesModal);

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("배정된 결과를 초기화하시겠습니까?")) {
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
window.assignRoles = startAIAssignment;
window.startAIAssignment = startAIAssignment;
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

// 희망 역할 조사 관련 바인딩
window.openWishesModal = openWishesModal;
window.closeWishesModal = closeWishesModal;
window.switchWishesTab = switchWishesTab;
window.renderWishesRoleTable = renderWishesRoleTable;
window.renderWishesStudentTable = renderWishesStudentTable;
window.adjustRoleCapacity = adjustRoleCapacity;
window.openStudentWishEditor = openStudentWishEditor;
window.closeStudentWishEditor = closeStudentWishEditor;
window.applyStudentWishEdit = applyStudentWishEdit;
window.openAddApplicantModal = openAddApplicantModal;
window.closeAddApplicantModal = closeAddApplicantModal;
window.confirmAddApplicant = confirmAddApplicant;
window.removeStudentWish = removeStudentWish;
window.validateWishesRow = validateWishesRow;
window.saveWishesSettings = saveWishesSettings;
window.fillRandomWishes = fillRandomWishes;
window.clearAllWishes = clearAllWishes;

// 가위바위보 동점 모달 관련 바인딩
window.toggleRPSWinner = toggleRPSWinner;
window.confirmRPSWinnersAndResume = confirmRPSWinnersAndResume;
window.closeRPSPauseModal = closeRPSPauseModal;

// ==========================================
// 13. PWA (Progressive Web App) 앱 설치 & 오프라인 기능
// ==========================================
let deferredPWAInstallPrompt = null;

// Service Worker 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('PWA Service Worker registered:', reg.scope);
    }).catch((err) => {
      console.warn('PWA Service Worker registration skipped:', err);
    });
  });
}

// 브라우저 앱 설치 프롬프트 이벤트 캐치 (Chrome, Android, Edge 등)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPWAInstallPrompt = e;
  const btnInstall = document.getElementById('btn-install-app');
  if (btnInstall) {
    btnInstall.style.display = 'inline-flex';
  }
});

window.addEventListener('appinstalled', () => {
  deferredPWAInstallPrompt = null;
  const btnInstallText = document.getElementById('btn-install-text');
  if (btnInstallText) btnInstallText.textContent = '앱 설치 완료 ✨';
  showToast('🎉 우리 반 1인 1역할 앱이 홈 화면에 성공적으로 설치되었습니다!');
});

function openPWAInstallModal() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone) {
    showToast('✨ 이미 독립형 전용 앱으로 실행 중입니다!');
    return;
  }

  const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  const guideAndroid = document.getElementById('pwa-guide-android');
  const guideIOS = document.getElementById('pwa-guide-ios');
  const btnTrigger = document.getElementById('btn-pwa-trigger-install');

  if (isIOS) {
    if (guideAndroid) guideAndroid.style.display = 'none';
    if (guideIOS) guideIOS.style.display = 'block';
    if (btnTrigger) btnTrigger.style.display = 'none';
  } else {
    if (guideAndroid) guideAndroid.style.display = 'block';
    if (guideIOS) guideIOS.style.display = 'none';
    if (btnTrigger) btnTrigger.style.display = 'inline-flex';
  }

  const modal = document.getElementById('pwa-install-modal');
  if (modal) modal.classList.add('active');
}

function closePWAInstallModal() {
  const modal = document.getElementById('pwa-install-modal');
  if (modal) modal.classList.remove('active');
}

async function triggerPWAInstall() {
  if (deferredPWAInstallPrompt) {
    deferredPWAInstallPrompt.prompt();
    const { outcome } = await deferredPWAInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('🚀 앱 설치를 진행합니다!');
      closePWAInstallModal();
    }
    deferredPWAInstallPrompt = null;
  } else {
    alert("스마트폰에서는 브라우저 메뉴의 [홈 화면에 추가]를,\nPC에서는 브라우저 주소창 우측의 [설치 ⊕] 버튼을 눌러주세요!");
  }
}

// 오프라인 / 온라인 네트워크 상태 감지
function checkOnlineStatus() {
  const badge = document.getElementById('offline-badge');
  if (!badge) return;
  if (!navigator.onLine) {
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
}
window.addEventListener('online', checkOnlineStatus);
window.addEventListener('offline', checkOnlineStatus);

// PWA 바인딩
window.openPWAInstallModal = openPWAInstallModal;
window.closePWAInstallModal = closePWAInstallModal;
window.triggerPWAInstall = triggerPWAInstall;
