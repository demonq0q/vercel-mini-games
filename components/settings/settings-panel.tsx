'use client';

import { useMemo, useState } from 'react';
import styles from './settings-panel.module.css';
import { useSiteSettings } from './site-settings-provider';

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const { settings, setThemeMode, togglePreferMobileLayout, toggleReducedMotion } = useSiteSettings();

  const summaryItems = useMemo(() => {
    return [
      settings.themeMode === 'midnight' ? '深空主题' : '极光主题',
      settings.preferMobileLayout ? '移动端优先' : '标准布局',
      settings.reducedMotion ? '减少动效' : '标准动效',
    ];
  }, [settings.preferMobileLayout, settings.reducedMotion, settings.themeMode]);

  return (
    <section className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
      <button className={styles.trigger} type="button" onClick={() => setOpen((currentOpen) => !currentOpen)}>
        <span className={styles.triggerTitle}>统一设置</span>
        <span className={styles.triggerText}>{open ? '收起' : '展开'}</span>
      </button>

      <div className={styles.summaryRow}>
        {summaryItems.map((item) => (
          <span key={item} className={styles.summaryChip}>
            {item}
          </span>
        ))}
      </div>

      {open ? (
        <div className={styles.body}>
          <section className={styles.section}>
            <span className={styles.label}>主题风格</span>
            <div className={styles.segmentedGroup}>
              <button
                className={`${styles.segmentedButton} ${settings.themeMode === 'midnight' ? styles.segmentedButtonActive : ''}`}
                type="button"
                onClick={() => setThemeMode('midnight')}
              >
                深空
              </button>
              <button
                className={`${styles.segmentedButton} ${settings.themeMode === 'aurora' ? styles.segmentedButtonActive : ''}`}
                type="button"
                onClick={() => setThemeMode('aurora')}
              >
                极光
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.settingRow}>
              <div>
                <span className={styles.label}>移动端优先布局</span>
                <p className={styles.description}>优先显示更大的触控按钮、底部控制区和紧凑信息编排。</p>
              </div>
              <button className={styles.toggleButton} type="button" onClick={togglePreferMobileLayout}>
                {settings.preferMobileLayout ? '已开启' : '已关闭'}
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.settingRow}>
              <div>
                <span className={styles.label}>减少动效</span>
                <p className={styles.description}>适合对连续动画、悬浮位移或闪动不敏感的浏览习惯。</p>
              </div>
              <button className={styles.toggleButton} type="button" onClick={toggleReducedMotion}>
                {settings.reducedMotion ? '已开启' : '已关闭'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

