import { trailStops } from '../data/trailStops';
import type { TrailQuestion, TrailStop } from '../types/trail';

export const TRAIL_VERSION = 'toy-time-machine-demo-3';
export const TRAIL_POINTS = 20;
export const demoQrCodes: Record<string, string> = {
  'moon-rocket': 'MINT-SPACE-001',
  'robot-dalek': 'MINT-SPACE-002',
  'aqua-jet': 'MINT-SPACE-003',
  'comet-rover': 'MINT-DEMO-SPACE-004',
  'orbit-scout': 'MINT-DEMO-SPACE-005',
};

export type TrailProgress = { version: string; completedQuestionIds: string[]; selectedQuestionIds: string[] };
const knownIds = new Set(trailStops.flatMap(stop => stop.questions.map(question => question.id)));
const questionCountPerStop = 5;
const questionTypes: TrailQuestion['type'][] = ['find', 'name', 'blank', 'multiple-choice'];

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export const newProgress = (): TrailProgress => ({
  version: TRAIL_VERSION,
  completedQuestionIds: [],
  selectedQuestionIds: trailStops.flatMap(stop => selectQuestions(stop).map(question => question.id)),
});

function selectQuestions(stop: TrailStop): TrailQuestion[] {
  const toyIds = shuffled([...new Set(stop.questions.map(question => question.exhibitId))]);
  const toyCount = Math.random() < 0.5 ? 4 : 5;
  const selectedToyIds = toyIds.slice(0, toyCount);
  const firstFourTypes = shuffled(questionTypes);
  const selected: TrailQuestion[] = selectedToyIds.slice(0, 4).map((exhibitId, index) =>
    stop.questions.find(question => question.exhibitId === exhibitId && question.type === firstFourTypes[index])!,
  );

  if (toyCount === 5) {
    const exhibitId = selectedToyIds[4];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    selected.push(stop.questions.find(question => question.exhibitId === exhibitId && question.type === type)!);
  } else {
    const repeatedToy = selectedToyIds[Math.floor(Math.random() * selectedToyIds.length)];
    const usedType = selected.find(question => question.exhibitId === repeatedToy)!.type;
    const repeatType = shuffled(questionTypes.filter(type => type !== usedType))[0];
    selected.push(stop.questions.find(question => question.exhibitId === repeatedToy && question.type === repeatType)!);
  }

  return shuffled(selected);
}

export function sanitizeProgress(value: unknown): TrailProgress {
  if (!value || typeof value !== 'object') return newProgress();
  const candidate = value as Partial<TrailProgress>;
  if (candidate.version !== TRAIL_VERSION || !Array.isArray(candidate.completedQuestionIds) || !Array.isArray(candidate.selectedQuestionIds)) return newProgress();
  const selectedQuestionIds = [...new Set(candidate.selectedQuestionIds.filter(
    (id): id is string => typeof id === 'string' && knownIds.has(id),
  ))];
  const validSelection = trailStops.every(stop => {
    const selected = selectedQuestionIds.flatMap(id => stop.questions.filter(question => question.id === id));
    const selectedToyIds = new Set(selected.map(question => question.exhibitId));
    const selectedTypes = new Set(selected.map(question => question.type));
    return selected.length === questionCountPerStop
      && selectedToyIds.size >= 4
      && selected.every(question => selected.filter(item => item.exhibitId === question.exhibitId).length <= 2)
      && questionTypes.every(type => selectedTypes.has(type));
  });
  if (selectedQuestionIds.length !== questionCountPerStop * trailStops.length || !validSelection) return newProgress();
  return {
    version: TRAIL_VERSION,
    completedQuestionIds: [...new Set(candidate.completedQuestionIds.filter(
      (id): id is string => typeof id === 'string' && knownIds.has(id),
    ))],
    selectedQuestionIds,
  };
}

export function currentQuestion(progress: TrailProgress): { stop: TrailStop; question: TrailQuestion } | null {
  for (const id of progress.selectedQuestionIds) {
    if (progress.completedQuestionIds.includes(id)) continue;
    const stop = trailStops.find(item => item.questions.some(question => question.id === id));
    const question = stop?.questions.find(item => item.id === id);
    if (stop && question) return { stop, question };
  }
  return null;
}

export const earnedStamps = (progress: TrailProgress) =>
  trailStops.filter(stop => {
    const selectedIds = progress.selectedQuestionIds.filter(id => stop.questions.some(question => question.id === id));
    return selectedIds.length > 0 && selectedIds.every(id => progress.completedQuestionIds.includes(id));
  }).map(stop => stop.stampId);

export const earnedPoints = (progress: TrailProgress) =>
  earnedStamps(progress).length === trailStops.length ? TRAIL_POINTS : 0;

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/[‐‑–—-]/g, ' ')
  .replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();

export function checkAnswer(question: TrailQuestion, answer: string): boolean {
  if (question.type === 'find') return answer.trim() === demoQrCodes[question.exhibitId];
  return (question.answers ?? []).some(valid => normalize(valid) === normalize(answer));
}

export function answerQuestion(progress: TrailProgress, answer: string): { correct: boolean; progress: TrailProgress } {
  const active = currentQuestion(progress);
  if (!active || !checkAnswer(active.question, answer)) return { correct: false, progress };
  return { correct: true, progress: sanitizeProgress({
    ...progress, completedQuestionIds: [...progress.completedQuestionIds, active.question.id],
  }) };
}
