import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MobileUnitSchedule.module.css";

import scheduleHeaderImage from "../../../assets/officer/officer_schedule/schedule_header.svg";
import startDateImage from "../../../assets/officer/officer_schedule/date_set.svg";
import endDateImage from "../../../assets/officer/officer_schedule/date_set_t.svg";
import stateInputImage from "../../../assets/officer/officer_schedule/state-input-section.svg";
import actionAreaImage from "../../../assets/officer/officer_schedule/date_set_th.svg";
import homeBottomIcon from "../../../assets/mobile/main/homeBottom.svg";
import contactBottomIcon from "../../../assets/mobile/main/contactBottom.svg";
import dutyBottomIcon from "../../../assets/mobile/main/dutyBottom.svg";
import alarmBottomIcon from "../../../assets/mobile/main/alarmBottom.svg";
import settingBottomIcon from "../../../assets/mobile/main/settingBottom.svg";

const MONTH_OPTIONS = ["월", ...Array.from({ length: 12 }, (_, index) => `${index + 1}월`)];
const DAY_OPTIONS = ["일", ...Array.from({ length: 31 }, (_, index) => `${index + 1}일`)];

function SelectBox({ value, onChange, options, label }) {
  return (
    <div className={styles.selectBox}>
      <select value={value} onChange={onChange} className={styles.select} aria-label={label}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

export default function MobileUnitSchedule() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ startMonth: "월", startDay: "일", endMonth: "월", endDay: "일", state: "상황" });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  return (
    <div className={styles.container}>
      <div className={styles.phoneScreen}>
        <header className={styles.header}>
          <img src={scheduleHeaderImage} alt="Schedule 부대일정 설정" />
          <button type="button" className={styles.headerBackButton} onClick={() => navigate("/soldier/mobile/main")} aria-label="뒤로가기" />
          <button type="button" className={styles.headerNoticeButton} aria-label="알림" />
        </header>

        <main className={styles.main}>
          <section className={styles.dateSection}>
            <div className={styles.dateRow}>
              <img src={startDateImage} alt="" className={styles.background} />
              <div className={styles.labelBox}><strong>Day</strong><span>부터</span></div>
              <SelectBox label="시작 월" value={form.startMonth} onChange={update("startMonth")} options={MONTH_OPTIONS} />
              <SelectBox label="시작 일" value={form.startDay} onChange={update("startDay")} options={DAY_OPTIONS} />
            </div>
            <div className={styles.dateRow}>
              <img src={endDateImage} alt="" className={styles.background} />
              <div className={styles.labelBox}><strong>Day</strong><span>까지</span></div>
              <SelectBox label="종료 월" value={form.endMonth} onChange={update("endMonth")} options={MONTH_OPTIONS} />
              <SelectBox label="종료 일" value={form.endDay} onChange={update("endDay")} options={DAY_OPTIONS} />
            </div>
          </section>

          <section className={styles.stateSection}>
            <img src={stateInputImage} alt="" className={styles.background} />
            <div className={styles.stateInner}>
              <div className={styles.labelBox}><strong>State</strong><span>신청사유</span></div>
              <SelectBox label="신청 사유" value={form.state} onChange={update("state")} options={["상황", "훈련", "외박", "외출", "휴가"]} />
            </div>
          </section>

          <section className={styles.actionSection}>
            <img src={actionAreaImage} alt="" className={styles.background} />
            <button type="button">제출</button>
            <button type="button" onClick={() => navigate("/soldier/mobile/main")}>취소</button>
          </section>
        </main>

        <nav className={styles.bottomNav} aria-label="하단 메뉴">
          <button type="button" onClick={() => navigate("/soldier/mobile/main")}><img src={homeBottomIcon} alt="Home" /></button>
          <button type="button"><img src={contactBottomIcon} alt="Contact" /></button>
          <button type="button" onClick={() => navigate("/soldier/mobile/duty-check")}><img src={dutyBottomIcon} alt="Duty" /></button>
          <button type="button" onClick={() => navigate("/soldier/mobile/state")}><img src={alarmBottomIcon} alt="Alarm" /></button>
          <button
            type="button"
            className={styles.activeNavButton}
            onClick={() => navigate("/officer/mobile-schedule")}
          >
            <img src={settingBottomIcon} alt="setting" />
          </button>
        </nav>
      </div>
    </div>
  );
}
