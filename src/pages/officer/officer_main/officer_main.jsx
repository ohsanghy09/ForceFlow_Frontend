import { useNavigate } from "react-router-dom";
import styles from "./officer_main.module.css";
import heroImg from "../../../assets/officer/officer_main/image-bg.png";
import aiLogo from "../../../assets/web-logo.svg";
import armyLogo from "../../../assets/army-logo.svg";
import armyIcon from "../../../assets/appLog/army.svg";
import mainLog1Icon from "../../../assets/officer/officer_main/main_log1.svg";
import mainLog2Icon from "../../../assets/officer/officer_main/main_log2.svg";
import mainLog4Icon from "../../../assets/officer/officer_main/main_log44.svg";
import mainLog5Icon from "../../../assets/officer/officer_main/main_log5.svg";
import mainLog6Icon from "../../../assets/officer/officer_main/main_log6.svg";
import mainLog7Icon from "../../../assets/officer/officer_main/main_log7.svg";
import ganbuIcon from "../../../assets/officer/officer_main/ganbu.svg";
import sosIcon from "../../../assets/appLog/SOS.svg";
import mainAlarmIcon from "../../../assets/officer/officer_main/main_alarm.svg";


function OfficerMain() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div
        className={styles.dashboard}
        style={{
          "--hero-image": `url(${heroImg})`,
        }}
      >
        {/* 상단 헤더 */}
        <header className={styles.hero}>
          <div className={styles["left-logo"]}>
            <div className={styles["logo-emblem"]}>
              <img
                src={aiLogo}
                alt="국방 AI 로고"
                className={styles["logo-image"]}
              />
            </div>
          </div>

          <div className={styles["right-logo"]}>
            <img
              src={armyLogo}
              alt="국방 로고"
              className={styles["logo-image"]}
            />
          </div>

          <div className={styles["hero-title-area"]}>
            <p>국방 AI 인원 종합 시스템</p>
            <h1>A Military Coprehensive</h1>
          </div>

          {/* 인사 문구 + 우측 아이콘 */}
          <div className={styles["hello-area"]}>
            <p>안녕하세요 임채훈 예비역 소령님</p>
            <img
              src={ganbuIcon}
              alt=""
              aria-hidden="true"
              className={styles["hello-person-icon"]}
            />
          </div>

          <nav className={styles["main-nav"]}>
            <div className={styles["nav-empty"]} />
            <button className={styles["nav-button"]}>HOME</button>
            <button className={styles["nav-button"]}>PERSONNEL</button>
            <button className={styles["nav-button"]}>
              APPROVAL
            </button>
            <button
              className={`${styles["nav-icon"]} ${styles["nav-alarm"]}`}
              aria-label="alarm"
            >
              <img src={sosIcon} alt="" aria-hidden="true" />
            </button>
            <button
              className={`${styles["nav-icon"]} ${styles["nav-user"]}`}
              aria-label="user"
            >
              <img src={mainAlarmIcon} alt="" aria-hidden="true" />
            </button>
          </nav>
        </header>

        {/* 비상 소집 */}
        <section className={styles["emergency-section"]}>
          <div className={styles["emergency-left"]}>
            <div className={styles["plus-icon"]} />
            <img
              src={mainLog5Icon}
              alt=""
              aria-hidden="true"
              className={styles["siren-icon"]}
            />
          </div>

          <div className={styles["emergency-right"]}>
            <div className={styles["emergency-text"]}>
              <h2>
                <span className={styles["emergency-main-text"]}>
                  Emergency Call Button
                </span>
                <span className={styles["emergency-warning-text"]}>
                  *Do not use Outside of Emergency*
                </span>
              </h2>

              <p>
                <span className={styles["emergency-main-sub"]}>
                  병사 긴급 소집 확인버튼
                </span>
                <span className={styles["emergency-warning-sub"]}>
                  *긴급 시 외 사용금지*
                </span>
              </p>
            </div>

            <button className={styles["emergency-button"]}>비상 소집</button>
          </div>
        </section>

        {/* 기능 영역 */}
        <section className={`${styles.feature} ${styles["feature-ai"]}`}>
          <img
            src={mainLog1Icon}
            alt=""
            aria-hidden="true"
            className={`${styles["feature-icon"]} ${styles["main-log-icon"]}`}
          />

          <div
            className={`${styles["feature-text"]} ${styles["feature-text-top"]}`}
          >
            <h3>AI Organization Of Work</h3>
            <p>AI 근무 편성</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/officer/schedule")}
            className={`${styles["go-button"]} ${styles["go-button-top"]}`}
          >
            바로가기
          </button>
        </section>

        <section className={`${styles.feature} ${styles["feature-personnel"]}`}>
          <img
            src={armyIcon}
            alt=""
            aria-hidden="true"
            className={`${styles["feature-icon"]} ${styles["army-icon"]}`}
          />

          <div
            className={`${styles["feature-text"]} ${styles["feature-text-top"]}`}
          >
            <h3>Personnel Check</h3>
            <p>실시간 병력 산출 및 조회</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/officer/personnel-check")}
            className={`${styles["go-button"]} ${styles["go-button-top"]}`}
          >
            바로가기
          </button>
        </section>

        <section className={`${styles.feature} ${styles["feature-schedule"]}`}>
          <img
            src={mainLog2Icon}
            alt=""
            aria-hidden="true"
            className={`${styles["feature-icon"]} ${styles["main-log-icon"]}`}
          />

          <div
            className={`${styles["feature-text"]} ${styles["feature-text-bottom"]}`}
          >
            <h3>Schedule</h3>
            <p>일정 관리</p>
          </div>

          <button
            className={`${styles["go-button"]} ${styles["go-button-bottom"]}`}
          >
            바로가기
          </button>
        </section>

        <section className={`${styles.feature} ${styles["feature-dashboard"]}`}>
          <img
            src={mainLog4Icon}
            alt=""
            aria-hidden="true"
            className={`${styles["feature-icon"]} ${styles["main-log-icon"]}`}
          />

          <div
            className={`${styles["feature-text"]} ${styles["feature-text-bottom"]}`}
          >
            <h3>DashBoard</h3>
            <p>부대현황 대시보드</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/officer/dashboard")}
            className={`${styles["go-button"]} ${styles["go-button-bottom"]}`}
          >
            바로가기
          </button>
        </section>

        {/* 하단 조회 영역 */}
        <section className={styles["bottom-section"]}>
          <div className={styles["bottom-text"]}>
            <h3>Check The Real-Time 1st Platoon Troops</h3>
            <p>임채훈 예비역 소령님 실시간 병력 확인</p>
          </div>

          <button
            className={`${styles["bottom-card"]} ${styles["bottom-schedule"]}`}
          >
            <div className={styles["bottom-card-icon"]}>
              <img
                src={mainLog6Icon}
                alt=""
                aria-hidden="true"
                className={styles["bottom-main-icon"]}
              />
            </div>
            <p>소대 일정 조회</p>
          </button>

          <button
            className={`${styles["bottom-card"]} ${styles["bottom-personnel"]}`}
          >
            <div className={styles["bottom-card-icon"]}>
              <img
                src={mainLog7Icon}
                alt=""
                aria-hidden="true"
                className={styles["bottom-main-icon"]}
              />
            </div>
            <p>소대 병력 조회</p>
          </button>
        </section>
      </div>
    </div>
  );
}

export default OfficerMain;
