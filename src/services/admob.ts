/**
 * Represents the result of a rewarded ad.
 */
export interface RewardedAdResult {
  /**
   * Indicates whether the user successfully watched the rewarded ad.
   */
  rewarded: boolean;
  /**
   * The amount of reward the user earned.
   */
  rewardAmount: number;
}

/**
 * Asynchronously shows a rewarded ad to the user.
 *
 * @returns A promise that resolves to a RewardedAdResult object.
 */
export async function showRewardedAd(): Promise<RewardedAdResult> {
  // TODO: Implement this by calling AdMob API.

  return {
    rewarded: true,
    rewardAmount: 10,
  };
}
