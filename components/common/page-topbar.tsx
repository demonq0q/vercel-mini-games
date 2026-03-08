import Link from 'next/link';
import { SettingsPanel } from '@/components/settings/settings-panel';
import styles from './page-topbar.module.css';

type PageTopbarProps = {
  subtitle: string;
};

export function PageTopbar({ subtitle }: PageTopbarProps) {
  return (
    <div className={styles.root}>
      <Link className={styles.brandPanel} href="/">
        <span className={styles.brandMark}>OSS</span>
        <span className={styles.brandTextWrap}>
          <strong className={styles.brandTitle}>Vercel 在线网页小游戏</strong>
          <span className={styles.brandSubtitle}>{subtitle}</span>
        </span>
      </Link>

      <div className={styles.settingsWrap}>
        <SettingsPanel />
      </div>
    </div>
  );
}
