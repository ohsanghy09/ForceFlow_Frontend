import "./main.css";
import { useNavigate } from "react-router-dom";

import phoneIcon from "../../../../assets/mobile/main/phone.svg";
import messageIcon from "../../../../assets/mobile/main/message.svg";
import gunIcon from "../../../../assets/mobile/main/gun.svg";
import scheduleIcon from "../../../../assets/mobile/main/schedule.svg";
import homeBottomIcon from "../../../../assets/mobile/main/homeBottom.svg";
import contactBottomIcon from "../../../../assets/mobile/main/contactBottom.svg";
import dutyBottomIcon from "../../../../assets/mobile/main/dutyBottom.svg";
import alarmBottomIcon from "../../../../assets/mobile/main/alarmBottom.svg";
import settingBottomIcon from "../../../../assets/mobile/main/settingBottom.svg";

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <div className="main-page">

      <section className="contact-section">
        <div className="contact-left">
          <img className="contact-icon" src={phoneIcon} alt="" />

          <div>
            <h2>Contact</h2>
            <p>소대 긴급 연락</p>
          </div>
        </div>

        <button type="button">긴급 연락</button>
      </section>

      <div className="menu-container">
        <Menu
          icon={messageIcon}
          title="Approval"
          desc="부대 승인 및 알림"
          onClick={() => navigate("/soldier/mobile/state")}
        />

        <Menu
          icon={gunIcon}
          title="Schedule"
          desc="부대일정 설정"
          onClick={() => navigate("/officer/mobile-schedule")}
        />

        <Menu
          icon={scheduleIcon}
          title="Duty Check"
          desc="근무 확인"
          onClick={() => navigate("/soldier/mobile/duty-check")}
        />
      </div>

      <nav className="bottom-nav">
        <Nav
          icon={homeBottomIcon}
          text="Home"
          active
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

function Menu({ icon, title, desc, onClick }) {
  return (
    <div className="menu-item">
      <div className="menu-left">
        <span className="menu-icon-frame">
          <img className="menu-icon" src={icon} alt="" />
        </span>

        <div>
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
      </div>

      <button type="button" onClick={onClick}>
        바로가기
      </button>
    </div>
  );
}

function Nav({ icon, text, active, onClick }) {
  return (
    <div
      className={`nav-item ${active ? "active" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <img src={icon} alt="" />
      <p>{text}</p>
    </div>
  );
}
