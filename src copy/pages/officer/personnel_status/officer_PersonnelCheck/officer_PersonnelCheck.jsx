import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./officer_PersonnelCheck.module.css";
import { fetchInUnitSoldierData } from "../../../../api/soldiers";

import backButtonIcon from "../../../../assets/officer/personnel_status/polygon-1.svg";
import soldierIcon from "../../../../assets/officer/personnel_status/soldier.svg";
import chickIcon from "../../../../assets/officer/personnel_status/chick-icon.svg";
import rankSgtIcon from "../../../../assets/officer/personnel_status/rank-sgt.svg";
import rankCplIcon from "../../../../assets/officer/personnel_status/rank-cpl.svg";
import rankPfcIcon from "../../../../assets/officer/personnel_status/rank-pfc.svg";

const TABLE_HEADERS = ["군번", "성명", "계급", "보직", "상태", "폰번호"];

const getStatusClassName = (status) => {
  switch (status) {
    case "훈련":
      return styles.trainingRow;
    case "외박":
      return styles.stayOutRow;
    case "외출":
      return styles.goOutRow;
    case "휴가":
    case "휴가자":
      return styles.vacationRow;
    default:
      return styles.defaultRow;
  }
};

const rankConfig = {
  병장: {
    icon: rankSgtIcon,
    cellStyle: "rankSgt",
    iconStyle: "rankSgtIcon",
  },
  상병: {
    icon: rankCplIcon,
    cellStyle: "rankCpl",
    iconStyle: "rankNormalIcon",
  },
  일병: {
    icon: rankPfcIcon,
    cellStyle: "rankPfc",
    iconStyle: "rankNormalIcon",
  },
  이병: {
    icon: chickIcon,
    cellStyle: "rankPvt",
    iconStyle: "rankNormalIcon",
  },
};

function getRankCell(rankName) {
  const config = rankConfig[rankName];

  if (!config) {
    return {
      className: "",
      content: <span className={styles.rankTextDark}>{rankName}</span>,
    };
  }

  return {
    className: styles[config.cellStyle],
    content: (
      <div className={styles.rankBadge}>
        <div className={styles.rankIconBox}>
          <img
            src={config.icon}
            alt={rankName}
            className={`${styles.rankIcon} ${styles[config.iconStyle]}`}
          />
        </div>
        <span
          className={
            rankName === "이병" ? styles.rankTextDark : styles.rankTextLight
          }
        >
          {rankName}
        </span>
      </div>
    ),
  };
}

function OfficerPersonnelCheck() {
  const navigate = useNavigate();
  const [soldierData, setSoldierData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadSoldiers = async () => {
      try {
        const data = await fetchInUnitSoldierData();

        if (!ignore) {
          setSoldierData(data);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setErrorMessage("병사 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadSoldiers();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backButtonIcon} alt="뒤로가기" className={styles.backIcon} />
        </button>

        <div className={styles.titleBox}>
          <h1 className={styles.title}>Personnel Check</h1>
          <p className={styles.subTitle}>실시간 병력산출 조회</p>
        </div>

        <div className={styles.headerIconBox}>
          <img src={soldierIcon} alt="병사 아이콘" className={styles.headerIcon} />
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.tableHorizontalArea}>
          <div className={styles.tableVerticalArea}>
            <div className={styles.table}>
              <div className={styles.tableHeaderGrid}>
                {TABLE_HEADERS.map((header) => (
                  <div key={header} className={styles.tableHeaderCell}>
                    {header}
                  </div>
                ))}
              </div>

              {isLoading && (
                <div className={styles.tableMessage}>불러오는 중...</div>
              )}

              {!isLoading && errorMessage && (
                <div className={styles.tableMessage}>{errorMessage}</div>
              )}

              {!isLoading && !errorMessage && soldierData.map((soldier, index) => {
                const rankBadge = getRankCell(soldier.rank_name);

                return (
                  <div
                    key={soldier.user_id ?? `${soldier.service_number}-${index}`}
                    className={`${styles.tableRowGrid} ${getStatusClassName(
                      soldier.current_status
                    )}`}
                  >
                    <div className={styles.tableCell}>{soldier.service_number}</div>
                    <div className={styles.tableCell}>{soldier.name}</div>
                    <div className={`${styles.rankCell} ${rankBadge.className}`}>
                      {rankBadge.content}
                    </div>
                    <div className={styles.tableCell}>{soldier.role}</div>
                    <div className={styles.tableCell}>{soldier.current_status}</div>
                    <div className={styles.tableCell}>{soldier.phone}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OfficerPersonnelCheck;
