export function useRewardedController(_adsReady: boolean) {
  return {
    isRewardedLoaded: true,
    showRewarded: (onReward: () => void) => {
      // In dev/web mode, trigger reward immediately
      onReward();
    },
  };
}
