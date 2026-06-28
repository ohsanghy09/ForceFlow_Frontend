import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./officer_Schedule.module.css";
import aiBackIcon from "../../../assets/officer/ai_soilder/ai_back.svg";
import aiLogIcon from "../../../assets/officer/ai_soilder/AI_log.svg";
import aiNameIcon from "../../../assets/officer/ai_soilder/AI_name.svg";
import {
  confirmSchedule,
  createPreview,
  getCandidates,
  getSetting,
  saveSetting,
} from "../../../api/workSchedules";

const DUTY_TYPES = ["불침번", "위병소", "당직", "탄약고 경계"];
const STATUS_OPTIONS = ["외진", "외출", "외박", "휴가", "훈련", "교육", "입원"];
const ROLE_OPTIONS = ["소총수", "취사병", "운전병", "통신병", "의무병"];

const emptySetting = {
  dutyType: "불침번",
  description: "생활관 야간 경계 근무",
  timeSlots: [
    { slotOrder: 1, startTime: "22:00", endTime: "00:00", requiredCount: 1, allowedRoles: ["소총수", "취사병", "운전병"] },
    { slotOrder: 2, startTime: "00:00", endTime: "02:00", requiredCount: 1, allowedRoles: ["소총수", "취사병", "운전병"] },
    { slotOrder: 3, startTime: "02:00", endTime: "04:00", requiredCount: 1, allowedRoles: ["소총수", "취사병", "운전병"] },
    { slotOrder: 4, startTime: "04:00", endTime: "06:00", requiredCount: 1, allowedRoles: ["소총수", "취사병", "운전병"] },
  ],
  lookbackDays: 7,
  preventConsecutive: true,
  maxDutyCount: 4,
  excludeStatuses: ["휴가", "외출", "외박", "훈련", "입원", "외진"],
};

const toInputTime = (value = "") => value.slice(0, 5);
const toApiTime = (value = "") => value.length === 5 ? `${value}:00` : value;
const today = new Date().toLocaleDateString("sv-SE");

function normalizeSetting(data = {}) {
  return {
    ...emptySetting,
    ...data,
    timeSlots: (data.timeSlots || emptySetting.timeSlots).map((slot, index) => ({
      ...slot,
      slotOrder: slot.slotOrder ?? index + 1,
      startTime: toInputTime(slot.startTime),
      endTime: toInputTime(slot.endTime),
      allowedRoles: slot.allowedRoles || [],
    })),
    excludeStatuses: data.excludeStatuses || [],
  };
}

function OfficerSchedule() {
  const navigate = useNavigate();
  const loadedOnce = useRef(false);
  const [unitId, setUnitId] = useState(2);
  const [setting, setSetting] = useState(emptySetting);
  const [activeView, setActiveView] = useState("setting");
  const [dutyDate, setDutyDate] = useState(today);
  const [preview, setPreview] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [candidateResult, setCandidateResult] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState(null);

  const totalRequired = useMemo(
    () => setting.timeSlots.reduce((sum, slot) => sum + Number(slot.requiredCount || 0), 0),
    [setting.timeSlots],
  );

  const announce = (message, type = "success") => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 3200);
  };

  const loadSetting = async () => {
    setBusy("load");
    try {
      const data = await getSetting(unitId, setting.dutyType);
      setSetting(normalizeSetting(data));
      announce("저장된 초기 설정을 불러왔습니다.");
    } catch (error) {
      announce(error.message, "error");
    } finally {
      setBusy("");
    }
  };

  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;
    loadSetting();
    // 최초 1회만 서버 설정을 동기화합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSlot = (index, key, value) => {
    setSetting((current) => ({
      ...current,
      timeSlots: current.timeSlots.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [key]: value } : slot,
      ),
    }));
  };

  const toggleRole = (slotIndex, role) => {
    const roles = setting.timeSlots[slotIndex].allowedRoles;
    updateSlot(slotIndex, "allowedRoles", roles.includes(role)
      ? roles.filter((item) => item !== role)
      : [...roles, role]);
  };

  const toggleStatus = (status) => {
    setSetting((current) => ({
      ...current,
      excludeStatuses: current.excludeStatuses.includes(status)
        ? current.excludeStatuses.filter((item) => item !== status)
        : [...current.excludeStatuses, status],
    }));
  };

  const settingPayload = () => ({
    dutyType: setting.dutyType,
    description: setting.description,
    timeSlots: setting.timeSlots.map((slot, index) => ({
      slotOrder: index + 1,
      startTime: toApiTime(slot.startTime),
      endTime: toApiTime(slot.endTime),
      requiredCount: Number(slot.requiredCount),
      allowedRoles: slot.allowedRoles,
    })),
    lookbackDays: Number(setting.lookbackDays),
    preventConsecutive: setting.preventConsecutive,
    maxDutyCount: Number(setting.maxDutyCount),
    excludeStatuses: setting.excludeStatuses,
  });

  const handleSave = async () => {
    setBusy("save");
    try {
      const data = await saveSetting(unitId, settingPayload());
      setSetting(normalizeSetting(data));
      announce("초기 설정을 저장했습니다.");
    } catch (error) {
      announce(error.message, "error");
    } finally {
      setBusy("");
    }
  };

  const handlePreview = async () => {
    setBusy("preview");
    try {
      const data = await createPreview({ unitId: Number(unitId), dutyDate, dutyType: setting.dutyType });
      setPreview(data);
      setActiveView("preview");
      setSelectedRow(data.assignments?.[0] || { slotOrder: 1 });
      setCandidateResult(null);
      announce("AI 추천 근무표를 생성했습니다.");
    } catch (error) {
      announce(error.message, "error");
    } finally {
      setBusy("");
    }
  };

  const searchCandidates = async () => {
    const slotOrder = selectedRow?.slotOrder || 1;
    setBusy("candidates");
    try {
      const data = await getCandidates({
        unitId: Number(unitId), dutyDate, dutyType: setting.dutyType, slotOrder, keyword,
      });
      setCandidateResult(data);
    } catch (error) {
      announce(error.message, "error");
    } finally {
      setBusy("");
    }
  };

  const replaceSoldier = (candidate) => {
    if (!preview || !selectedRow) return;
    const updatedRow = { ...selectedRow, userId: candidate.userId, name: candidate.name, rankName: candidate.rankName, role: candidate.role, aiReason: "관리자 직접 배정" };
    setPreview((current) => ({
      ...current,
      assignments: current.assignments.map((assignment) =>
        assignment.slotOrder === selectedRow.slotOrder && assignment.userId === selectedRow.userId
          ? updatedRow
          : assignment,
      ),
    }));
    setSelectedRow(updatedRow);
    announce(`${candidate.name} 병사로 교체했습니다.`);
  };

  const handleConfirm = async () => {
    if (!preview) return;
    setBusy("confirm");
    try {
      const data = await confirmSchedule({
        recommendationId: preview.recommendationId,
        unitId: Number(unitId),
        dutyDate,
        dutyType: setting.dutyType,
        requiredCount: preview.requiredCount ?? totalRequired,
        startTime: preview.startTime,
        endTime: preview.endTime,
        assignments: preview.assignments.map((item) => ({
          slotOrder: item.slotOrder,
          userId: item.userId,
          startTime: item.startTime,
          endTime: item.endTime,
          aiReason: item.aiReason,
        })),
      });
      setPreview((current) => ({
        ...current,
        ...data,
        assignments: data.assignments?.length ? data.assignments : current.assignments,
      }));
      announce("근무표 승인이 완료되었습니다.");
    } catch (error) {
      announce(error.message, "error");
    } finally {
      setBusy("");
    }
  };

  const addSlot = () => {
    const last = setting.timeSlots.at(-1);
    setSetting((current) => ({
      ...current,
      timeSlots: [...current.timeSlots, {
        slotOrder: current.timeSlots.length + 1,
        startTime: last?.endTime || "00:00",
        endTime: "02:00",
        requiredCount: 1,
        allowedRoles: ["소총수"],
      }],
    }));
  };

  const candidates = candidateResult?.candidates || [];

  return (
    <div className={styles.page}>
      {notice && <div className={`${styles.toast} ${styles[notice.type]}`}>{notice.message}</div>}

      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate("/officer/main")} aria-label="뒤로가기">
          <img src={aiBackIcon} alt="" aria-hidden="true" />
        </button>
        <div className={styles.brand}>
          <img src={aiNameIcon} alt="AI WORK" />
          <span>AI 근무편성</span>
        </div>
        <img className={styles.spark} src={aiLogIcon} alt="" aria-hidden="true" />
      </header>

      <main className={styles.workspace}>
        <section className={styles.controlBar}>
          <div className={styles.controlTitle}>
            <span className={styles.eyebrow}>FORCE FLOW</span>
            <h1>근무 편성 워크스페이스</h1>
          </div>
          <label><span>부대 ID</span><input type="number" min="1" value={unitId} onChange={(event) => setUnitId(event.target.value)} /></label>
          <label><span>근무 유형</span><select value={setting.dutyType} onChange={(event) => setSetting({ ...setting, dutyType: event.target.value })}>{DUTY_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button className={styles.outlineButton} onClick={loadSetting} disabled={busy === "load"}>{busy === "load" ? "조회 중" : "설정 조회"}</button>
        </section>

        <div className={styles.tabs}>
          <button className={activeView === "setting" ? styles.activeTab : ""} onClick={() => setActiveView("setting")}><b>01</b> 초기 설정</button>
          <button className={activeView === "preview" ? styles.activeTab : ""} onClick={() => setActiveView("preview")}><b>02</b> AI 미리보기 {preview && <i />}</button>
        </div>

        <div className={styles.contentGrid}>
          <section className={styles.mainPanel}>
            {activeView === "setting" ? (
              <>
                <div className={styles.panelHeading}>
                  <div><span>근무 규칙</span><h2>{setting.dutyType} 초기 설정</h2></div>
                  <div className={styles.summary}><strong>{setting.timeSlots.length}</strong><span>시간대</span><strong>{totalRequired}</strong><span>필요 인원</span></div>
                </div>

                <div className={styles.formGrid}>
                  <label className={styles.wide}><span>설명</span><input value={setting.description} onChange={(event) => setSetting({ ...setting, description: event.target.value })} placeholder="근무 설명을 입력하세요" /></label>
                  <label><span>최근 근무 조회 기간</span><div className={styles.suffix}><input type="number" min="1" value={setting.lookbackDays} onChange={(event) => setSetting({ ...setting, lookbackDays: event.target.value })} /><em>일</em></div></label>
                  <label><span>기간 내 최대 근무</span><div className={styles.suffix}><input type="number" min="1" value={setting.maxDutyCount} onChange={(event) => setSetting({ ...setting, maxDutyCount: event.target.value })} /><em>회</em></div></label>
                  <label className={styles.toggleLabel}><span>연속 근무 차단</span><button type="button" className={`${styles.toggle} ${setting.preventConsecutive ? styles.on : ""}`} onClick={() => setSetting({ ...setting, preventConsecutive: !setting.preventConsecutive })}><i /><b>{setting.preventConsecutive ? "ON" : "OFF"}</b></button></label>
                </div>

                <div className={styles.subHeading}><div><span>TIME SLOTS</span><h3>시간대별 편성 기준</h3></div><button className={styles.textButton} onClick={addSlot}>＋ 시간대 추가</button></div>
                <div className={styles.slotList}>
                  {setting.timeSlots.map((slot, index) => (
                    <article className={styles.slotCard} key={`${slot.slotOrder}-${index}`}>
                      <div className={styles.slotNumber}>{String(index + 1).padStart(2, "0")}</div>
                      <label><span>시작</span><input type="time" value={slot.startTime} onChange={(event) => updateSlot(index, "startTime", event.target.value)} /></label>
                      <span className={styles.arrow}>→</span>
                      <label><span>종료</span><input type="time" value={slot.endTime} onChange={(event) => updateSlot(index, "endTime", event.target.value)} /></label>
                      <label className={styles.count}><span>인원</span><input type="number" min="1" value={slot.requiredCount} onChange={(event) => updateSlot(index, "requiredCount", event.target.value)} /></label>
                      <div className={styles.roles}><span>허용 보직</span><div>{ROLE_OPTIONS.map((role) => <button type="button" key={role} className={slot.allowedRoles.includes(role) ? styles.selectedChip : ""} onClick={() => toggleRole(index, role)}>{role}</button>)}</div></div>
                      {setting.timeSlots.length > 1 && <button className={styles.remove} onClick={() => setSetting((current) => ({ ...current, timeSlots: current.timeSlots.filter((_, i) => i !== index) }))} aria-label="시간대 삭제">×</button>}
                    </article>
                  ))}
                </div>

                <div className={styles.excluded}><span>배정 제외 상태</span><div>{STATUS_OPTIONS.map((status) => <button type="button" key={status} className={setting.excludeStatuses.includes(status) ? styles.selectedChip : ""} onClick={() => toggleStatus(status)}>{status}</button>)}</div></div>
              </>
            ) : (
              <>
                <div className={styles.panelHeading}>
                  <div><span>AI RECOMMENDATION</span><h2>{setting.dutyType} 추천 근무표</h2></div>
                  {preview && <div className={`${styles.statusBadge} ${preview.status === "승인" ? styles.approved : ""}`}>{preview.status || "미리보기"}</div>}
                </div>
                <div className={styles.previewTools}>
                  <label><span>근무 날짜</span><input type="date" value={dutyDate} onChange={(event) => setDutyDate(event.target.value)} /></label>
                  <button className={styles.orangeButton} onClick={handlePreview} disabled={busy === "preview"}>{busy === "preview" ? "AI 편성 중..." : "✦ AI 미리보기 생성"}</button>
                </div>
                {preview?.warningMessage && <div className={styles.warning}>⚠ {preview.warningMessage}</div>}
                {preview?.assignments?.length ? (
                  <div className={styles.tableWrap}><table><thead><tr><th>순서</th><th>시간</th><th>군번</th><th>성명</th><th>계급</th><th>보직</th><th>배정 근거</th></tr></thead><tbody>{preview.assignments.map((row, index) => <tr key={`${row.slotOrder}-${row.userId}-${index}`} className={selectedRow === row || (selectedRow?.slotOrder === row.slotOrder && selectedRow?.userId === row.userId) ? styles.selectedRow : ""} onClick={() => { setSelectedRow(row); setCandidateResult(null); }}><td><b>{String(row.slotOrder).padStart(2, "0")}</b></td><td>{toInputTime(row.startTime)} – {toInputTime(row.endTime)}</td><td>{row.militaryNumber || row.serviceNumber || row.userId}</td><td><strong>{row.name}</strong></td><td>{row.rankName}</td><td>{row.role}</td><td>{row.aiReason || "AI 기준 충족"}</td></tr>)}</tbody></table></div>
                ) : <div className={styles.emptyState}><span>✦</span><h3>아직 생성된 근무표가 없습니다</h3><p>날짜를 선택하고 AI 미리보기를 생성해 주세요.</p><button className={styles.orangeButton} onClick={handlePreview}>미리보기 생성</button></div>}
              </>
            )}
          </section>

          <aside className={styles.candidatePanel}>
            <div className={styles.asideHeading}><span>PERSONNEL</span><h2>병사 후보 검색</h2><p>근무 행을 선택한 뒤 후보를 검색하고 교체할 수 있습니다.</p></div>
            <div className={styles.selectedSlot}><span>선택 시간대</span><strong>{selectedRow ? `${selectedRow.slotOrder}번 · ${toInputTime(selectedRow.startTime || setting.timeSlots[selectedRow.slotOrder - 1]?.startTime)}–${toInputTime(selectedRow.endTime || setting.timeSlots[selectedRow.slotOrder - 1]?.endTime)}` : "근무 행을 선택하세요"}</strong></div>
            <div className={styles.searchBox}><input value={keyword} onChange={(event) => setKeyword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && searchCandidates()} placeholder="이름을 입력하세요" /><button onClick={searchCandidates} disabled={!preview || busy === "candidates"} aria-label="후보 검색">⌕</button></div>
            <div className={styles.candidateList}>
              {!candidateResult ? <div className={styles.searchGuide}><div>⌕</div><strong>{preview ? "교체할 근무 행을 선택하세요" : "미리보기를 먼저 생성하세요"}</strong><p>적합도와 최근 근무 피로도를 함께 확인할 수 있습니다.</p></div>
                : candidates.length ? candidates.map((candidate) => <button key={candidate.userId} className={styles.candidateCard} disabled={!candidate.eligible} onClick={() => replaceSoldier(candidate)}><div className={styles.avatar}>{candidate.name?.slice(-1)}</div><div><strong>{candidate.name} <small>{candidate.rankName}</small></strong><span>{candidate.role} · 최근 {candidate.recentDutyCount}회</span><em>{candidate.currentStatus}</em></div><div className={`${styles.eligibility} ${!candidate.eligible ? styles.ineligible : ""}`}>{candidate.eligible ? "배정 가능" : "배정 불가"}<small>피로도 {candidate.recentDutyFatigueScore}</small></div></button>)
                  : <div className={styles.searchGuide}><div>–</div><strong>검색 결과가 없습니다</strong><p>다른 이름으로 검색해 보세요.</p></div>}
            </div>
          </aside>
        </div>

        <footer className={styles.footer}>
          <div><span>UNIT {unitId}</span><strong>{setting.dutyType} · 총 {totalRequired}명</strong></div>
          {activeView === "setting" ? <div><button className={styles.ghostButton} onClick={() => setSetting(emptySetting)}>초기화</button><button className={styles.orangeButton} onClick={handlePreview} disabled={busy === "preview"}>AI 미리보기</button><button className={styles.primaryButton} onClick={handleSave} disabled={busy === "save"}>{busy === "save" ? "저장 중..." : "설정 저장"}</button></div>
            : <div><button className={styles.ghostButton} onClick={() => setActiveView("setting")}>설정 수정</button><button className={styles.orangeButton} onClick={handlePreview}>다시 생성</button><button className={styles.primaryButton} onClick={handleConfirm} disabled={!preview || busy === "confirm"}>{busy === "confirm" ? "승인 중..." : "근무표 승인"}</button></div>}
        </footer>
      </main>
    </div>
  );
}

export default OfficerSchedule;
