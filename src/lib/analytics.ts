type GtagFn = (
  command: 'event' | 'config' | 'js' | 'set',
  targetOrEventName: string,
  params?: Record<string, string | number | boolean>
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string>
) {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    return;
  }
  window.gtag?.('event', eventName, params);
}

export const analytics = {
  selectDonem: (donem: 'donem_1' | 'donem_2') =>
    trackEvent('select_donem', { donem }),

  selectYariyil: (yariyil: 'guz' | 'bahar') =>
    trackEvent('select_yariyil', { yariyil }),

  toggleTheme: (theme: 'dark' | 'light') =>
    trackEvent('toggle_theme', { theme }),

  clearScores: (donem: string, yariyil: string) =>
    trackEvent('clear_scores', { donem, yariyil }),

  scoreEntered: (donem: string, yariyil: string) =>
    trackEvent('score_entered', { donem, yariyil }),
};
