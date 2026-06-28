import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './officer_dashboard.module.css';
import { fetchSoldierData } from '../../../../api/soldiers';

import dashboardIcon from '../../../../assets/officer/personnel_status/dashboard.svg';
import backButtonIcon from '../../../../assets/officer/personnel_status/polygon-1.svg';
import chickIcon from '../../../../assets/officer/personnel_status/chick-icon.svg';
import rankSgtIcon from '../../../../assets/officer/personnel_status/rank-sgt.svg';
import rankCplIcon from '../../../../assets/officer/personnel_status/rank-cpl.svg';
import rankPfcIcon from '../../../../assets/officer/personnel_status/rank-pfc.svg';

const TABLE_HEADERS = ['군번', '성명', '계급', '보직', '상태', '폰번호'];

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [soldierData, setSoldierData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadSoldiers = async () => {
      try {
        const data = await fetchSoldierData();

        if (!ignore) {
          setSoldierData(data);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setErrorMessage('병사 정보를 불러오지 못했습니다.');
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

  const renderRankCell = (rankName) => {
    const rankConfig = {
      병장: {
        icon: rankSgtIcon,
        cellStyle: styles.rankSgt,
        iconStyle: styles.rankSgtIcon,
      },
      상병: {
        icon: rankCplIcon,
        cellStyle: styles.rankCpl,
        iconStyle: styles.rankNormalIcon,
      },
      일병: {
        icon: rankPfcIcon,
        cellStyle: styles.rankPfc,
        iconStyle: styles.rankNormalIcon,
      },
      이병: {
        icon: chickIcon,
        cellStyle: styles.rankPvt,
        iconStyle: styles.rankNormalIcon,
      },
    };

    const config = rankConfig[rankName];

    if (!config) {
      return <div className={styles.tableCell}>{rankName}</div>;
    }

    return (
      <div className={`${styles.rankCell} ${config.cellStyle}`}>
        <div className={styles.rankIconBox}>
          <img
            src={config.icon}
            alt={rankName}
            className={`${styles.rankIcon} ${config.iconStyle}`}
          />
        </div>

        <div
          className={
            rankName === '이병'
              ? styles.rankTextDark
              : styles.rankTextLight
          }
        >
          {rankName}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate('/officer/main')}
            aria-label="메인 화면으로 이동"
          >
            <img
              src={backButtonIcon}
              alt="메인 화면으로 이동"
              className={styles.backIcon}
            />
          </button>

          <div className={styles.titleWrapper}>
            <div className={styles.mainTitle}>DashBoard</div>
            <div className={styles.subTitle}>부대현황 대시보드</div>
          </div>

          <img
            src={dashboardIcon}
            alt="대시보드"
            className={styles.headerIcon}
          />
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

                {!isLoading && !errorMessage && soldierData.map((soldier, index) => (
                  <div
                    className={styles.tableRow}
                    key={soldier.user_id ?? `${soldier.service_number}-${index}`}
                  >
                    <div className={styles.tableCell}>
                      {soldier.service_number}
                    </div>

                    <div className={styles.tableCell}>
                      {soldier.name}
                    </div>

                    {renderRankCell(soldier.rank_name)}

                    <div className={styles.tableCell}>
                      {soldier.role}
                    </div>

                    <div className={styles.tableCell}>
                      {soldier.current_status}
                    </div>

                    <div className={styles.tableCell}>
                      {soldier.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
