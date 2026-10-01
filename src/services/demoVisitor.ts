import type { UserProfile } from '../types/user';
import { earnedPoints, earnedStamps, newProgress, sanitizeProgress, TRAIL_POINTS, type TrailProgress } from './trailGame';

export const demoVisitor: UserProfile = {
  id: 'demo-visitor-001',
  name: 'Demo Visitor',
  email: 'demo.visitor@example.invalid',
  role: 'visitor',
};

export type PointsActivity = {
  id: string;
  type: 'earned' | 'spent';
  points: number;
  description: string;
  createdAt: string;
};

export type RewardRedemption = {
  id: string;
  requestId: string;
  rewardId: string;
  rewardName: string;
  pointsSpent: number;
  createdAt: string;
  status: 'ready' | 'used';
};

export type DemoVisitorAccount = {
  user: UserProfile;
  progress: TrailProgress;
  stampIds: string[];
  pointsBalance: number;
  pointsEarned: number;
  gameBonusAwarded: boolean;
  rewardsVersion: 1;
  pointsActivity: PointsActivity[];
  redemptions: RewardRedemption[];
  storageAvailable: boolean;
};

const ACCOUNT_KEY = `mint-visitor-account:${demoVisitor.id}`;
const OLD_PROGRESS_KEY = 'mint-toy-time-machine-progress';
export const DEMO_VISITOR_UPDATED = 'mint-demo-visitor-updated';
export const DEMO_VISITOR_ACCOUNT_KEY = ACCOUNT_KEY;

const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function cleanActivity(value: unknown): PointsActivity[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    if (!isRecord(item) || (item.type !== 'earned' && item.type !== 'spent')
      || typeof item.id !== 'string' || typeof item.description !== 'string'
      || typeof item.createdAt !== 'string' || !Number.isSafeInteger(item.points)
      || Number(item.points) <= 0) return [];
    return [{
      id: item.id,
      type: item.type,
      points: Number(item.points),
      description: item.description,
      createdAt: item.createdAt,
    }];
  });
}

function cleanRedemptions(value: unknown): RewardRedemption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.requestId !== 'string'
      || typeof item.rewardId !== 'string' || typeof item.rewardName !== 'string'
      || typeof item.createdAt !== 'string' || !Number.isSafeInteger(item.pointsSpent)
      || Number(item.pointsSpent) <= 0 || (item.status !== 'ready' && item.status !== 'used')) return [];
    return [{
      id: item.id,
      requestId: item.requestId,
      rewardId: item.rewardId,
      rewardName: item.rewardName,
      pointsSpent: Number(item.pointsSpent),
      createdAt: item.createdAt,
      status: item.status,
    }];
  });
}

function makeInitialAccount(progress: TrailProgress): DemoVisitorAccount {
  const gamePoints = earnedPoints(progress);
  const now = new Date().toISOString();
  return {
    user: demoVisitor,
    progress,
    stampIds: earnedStamps(progress),
    pointsBalance: gamePoints,
    pointsEarned: gamePoints,
    gameBonusAwarded: gamePoints > 0,
    rewardsVersion: 1,
    pointsActivity: gamePoints > 0
      ? [{ id: makeId(), type: 'earned', points: gamePoints, description: 'Toy Time Machine completion bonus', createdAt: now }]
      : [],
    redemptions: [],
    storageAvailable: true,
  };
}

function migrateProgress(value: unknown): TrailProgress {
  const sanitized = sanitizeProgress(value);
  if (!isRecord(value) || !Array.isArray(value.completedQuestionIds)
    || !Array.isArray(value.selectedQuestionIds)) return sanitized;

  const compatible = sanitizeProgress({ ...value, version: sanitized.version });
  return earnedPoints(compatible) > 0 ? compatible : sanitized;
}

function migrateAccount(value: unknown, fallbackProgress: TrailProgress): DemoVisitorAccount {
  if (!isRecord(value)) return makeInitialAccount(fallbackProgress);
  let progress = migrateProgress(value.progress);

  if (value.rewardsVersion !== 1) {
    // Older demo accounts derived their points solely from completed game progress.
    // Carry that one-time award forward and never grant it again during replay.
    if (!earnedPoints(progress) && Number.isSafeInteger(value.points) && Number(value.points) >= TRAIL_POINTS) {
      progress = newProgress();
      progress = { ...progress, completedQuestionIds: [...progress.selectedQuestionIds] };
    }
    return makeInitialAccount(progress);
  }

  const activity = cleanActivity(value.pointsActivity);
  const redemptions = cleanRedemptions(value.redemptions);
  const spent = redemptions.reduce((sum, entry) => sum + entry.pointsSpent, 0);
  const gameBonusAwarded = value.gameBonusAwarded === true || earnedPoints(progress) > 0;
  const earnedPointsTotal = Number.isSafeInteger(value.pointsEarned) && Number(value.pointsEarned) >= 0
    ? Number(value.pointsEarned)
    : activity.filter(entry => entry.type === 'earned').reduce((sum, entry) => sum + entry.points, 0);
  const balanceFromLedger = Math.max(0, earnedPointsTotal - spent);
  const balance = Number.isSafeInteger(value.pointsBalance) && Number(value.pointsBalance) >= 0
    ? Math.min(Number(value.pointsBalance), balanceFromLedger)
    : balanceFromLedger;
  return {
    user: demoVisitor,
    progress,
    stampIds: earnedStamps(progress),
    pointsBalance: balance,
    pointsEarned: earnedPointsTotal,
    gameBonusAwarded,
    rewardsVersion: 1,
    pointsActivity: activity,
    redemptions,
    storageAvailable: true,
  };
}

function notifyUpdated() {
  window.dispatchEvent(new Event(DEMO_VISITOR_UPDATED));
}

function persist(account: DemoVisitorAccount): DemoVisitorAccount {
  try {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    notifyUpdated();
  } catch (error) {
    console.error('Could not save demo visitor rewards to browser storage.', error);
    return { ...account, storageAvailable: false };
  }
  return { ...account, storageAvailable: true };
}

export function readDemoVisitorAccount(): DemoVisitorAccount {
  try {
    const saved = localStorage.getItem(ACCOUNT_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      const migrated = migrateAccount(parsed, newProgress());
      if (!isRecord(parsed) || parsed.rewardsVersion !== 1) return persist(migrated);
      return migrated;
    }
    const earlier = localStorage.getItem(OLD_PROGRESS_KEY);
    const account = makeInitialAccount(earlier ? sanitizeProgress(JSON.parse(earlier)) : newProgress());
    return persist(account);
  } catch (error) {
    console.error('Could not read demo visitor rewards from browser storage.', error);
    return { ...makeInitialAccount(newProgress()), storageAvailable: false };
  }
}

export function saveDemoVisitorProgress(progress: TrailProgress): DemoVisitorAccount {
  const cleanProgress = sanitizeProgress(progress);
  const account = readDemoVisitorAccount();
  const gameComplete = earnedPoints(cleanProgress) > 0;
  let next: DemoVisitorAccount = {
    ...account,
    progress: cleanProgress,
    stampIds: earnedStamps(cleanProgress),
  };

  if (gameComplete && !account.gameBonusAwarded) {
    const createdAt = new Date().toISOString();
    next = {
      ...next,
      pointsBalance: account.pointsBalance + earnedPoints(cleanProgress),
      pointsEarned: account.pointsEarned + earnedPoints(cleanProgress),
      gameBonusAwarded: true,
      pointsActivity: [...account.pointsActivity, {
        id: makeId(),
        type: 'earned',
        points: earnedPoints(cleanProgress),
        description: 'Toy Time Machine completion bonus',
        createdAt,
      }],
    };
  }

  return persist(next);
}

export function saveDemoVisitorAccount(account: DemoVisitorAccount): DemoVisitorAccount {
  return persist(account);
}
