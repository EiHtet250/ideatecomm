import {
  readDemoVisitorAccount,
  saveDemoVisitorAccount,
  type DemoVisitorAccount,
  type RewardRedemption,
} from './demoVisitor';

export type Reward = {
  id: string;
  name: string;
  icon: string;
  description: string;
  cost: number;
  stock: number;
  terms: string;
  demoOnly?: boolean;
};

export const REWARDS: Reward[] = [
  {
    id: 'small-gift',
    name: 'Small children’s gift',
    icon: '🎁',
    description: 'Choose a small surprise such as stickers, a pencil, or a mini activity kit.',
    cost: 10,
    stock: 100,
    terms: 'One small gift per redemption, subject to availability. Choose from eligible gifts at the counter.',
  },
  {
    id: 'ticket-discount',
    name: '20% off one museum admission ticket',
    icon: '🎟️',
    description: 'A proposed demo discount for one museum admission ticket.',
    cost: 15,
    stock: 100,
    terms: 'Valid for one admission ticket. Cannot be combined with other discounts. Demo only; confirm all real terms before launch.',
  },
  {
    id: 'fairprice-voucher',
    name: 'S$5 FairPrice voucher (demo proposal)',
    icon: '🛍️',
    description: 'A proposed demo reward only; this is not an issued voucher or an official FairPrice partnership.',
    cost: 20,
    stock: 50,
    terms: 'Demo-only proposal. No voucher code is issued and no real-world value is provided. Not an official FairPrice partnership.',
    demoOnly: true,
  },
];

export function rewardStockRemaining(account: DemoVisitorAccount, reward: Reward): number {
  const redeemed = account.redemptions.filter(entry => entry.rewardId === reward.id).length;
  return Math.max(0, reward.stock - redeemed);
}

export type RedeemResult =
  | { success: true; redemption: RewardRedemption; account: DemoVisitorAccount; duplicate: boolean }
  | { success: false; reason: 'missing' | 'unavailable' | 'insufficient' | 'storage' };

const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function redeemReward(rewardId: string, requestId: string): RedeemResult {
  const account = readDemoVisitorAccount();
  const previous = account.redemptions.find(item => item.requestId === requestId);
  if (previous) return { success: true, redemption: previous, account, duplicate: true };

  const reward = REWARDS.find(item => item.id === rewardId);
  if (!reward) return { success: false, reason: 'missing' };

  const stock = rewardStockRemaining(account, reward);
  if (stock <= 0) return { success: false, reason: 'unavailable' };
  if (account.pointsBalance < reward.cost) return { success: false, reason: 'insufficient' };

  const createdAt = new Date().toISOString();
  const redemption: RewardRedemption = {
    id: `DEMO-${makeId()}`,
    requestId,
    rewardId,
    rewardName: reward.name,
    pointsSpent: reward.cost,
    createdAt,
    status: 'ready',
  };
  const next: DemoVisitorAccount = {
    ...account,
    pointsBalance: account.pointsBalance - reward.cost,
    redemptions: [redemption, ...account.redemptions],
    pointsActivity: [{
      id: makeId(),
      type: 'spent',
      points: reward.cost,
      description: `Redeemed: ${reward.name}`,
      createdAt,
    }, ...account.pointsActivity],
  };
  const saved = saveDemoVisitorAccount(next);
  if (!saved.storageAvailable) return { success: false, reason: 'storage' };
  return { success: true, redemption, account: saved, duplicate: false };
}
