import "./state.css";
import { useNavigate } from "react-router-dom";

import homeBottomIcon from "../../../../assets/mobile/main/homeBottom.svg";
import contactBottomIcon from "../../../../assets/mobile/main/contactBottom.svg";
import dutyBottomIcon from "../../../../assets/mobile/main/dutyBottom.svg";
import alarmBottomIcon from "../../../../assets/mobile/main/alarmBottom.svg";
import settingBottomIcon from "../../../../assets/mobile/main/settingBottom.svg";
import soldierIcon from "../../../../assets/mobile/state/soldierIcon.svg";
import notificationIcon from "../../../../assets/mobile/state/notificationIcon.svg";
import messageIcon from "../../../../assets/mobile/state/messageIcon.svg";

const notifications = Array.from({ length: 8 }, (_, index) => index);

export default function State() {
  const navigate = useNavigate();

  return (
    <div className="state-container">
      <div className="state-page">

      <header className="state-header">
        <button
          className="state-back"
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate("/soldier/mobile/main")}
        ></button>

        <img className="state-soldier-icon" src={soldierIcon} alt="" />

        <div className="state-title">
          <h1>State</h1>
          <p>병사상태</p>
        </div>

        <img className="state-bell" src={notificationIcon} alt="" />
      </header>

      <main className="notification-area">
        <section className="notification-title">
          <div>
            <h2>Notification</h2>
            <p>알림</p>
          </div>

          <img className="title-message-icon" src={messageIcon} alt="" />
        </section>

        <div className="notification-list">
          {notifications.map((item) => (
            <article className="notification-row" key={item}>
              <div className="notification-card">
                <strong>알림</strong>
                <p>승인 알립니다. 확인바랍니다.</p>
              </div>

              <button className="notification-action" type="button">
                <img src={messageIcon} alt="" />
              </button>
            </article>
          ))}
        </div>
      </main>

      <nav className="state-bottom-nav">
        <Nav
          icon={homeBottomIcon}
          text="Home"
          onClick={() => navigate("/soldier/mobile/main")}
        />
        <Nav icon={contactBottomIcon} text="Contact" />
        <Nav
          icon={dutyBottomIcon}
          text="Duty"
          onClick={() => navigate("/soldier/mobile/duty-check")}
        />
        <Nav
          icon={alarmBottomIcon}
          text="Alarm"
          active
          onClick={() => navigate("/soldier/mobile/state")}
        />
        <Nav
          icon={settingBottomIcon}
          text="setting"
          onClick={() => navigate("/officer/mobile-schedule")}
        />
      </nav>

      </div>
    </div>
  );
}

function Nav({ icon, text, active, onClick }) {
  return (
    <div
      className={`state-nav-item ${active ? "active" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <img src={icon} alt="" />
      <p>{text}</p>
    </div>
  );
}
