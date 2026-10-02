/**
 * Page-wide translation for the visitor side.
 *
 * Many components write their text in English only. Rather than editing each one, this watches
 * the page and swaps any English text (and placeholder / aria-label / title / alt attributes)
 * for its translation from the visitor dictionaries. Text with no translation stays in English.
 *
 * It only ever changes the text inside existing nodes, never the page structure, so React keeps
 * working normally. The English original of every changed node is remembered, so switching back
 * to English (or to another language) restores it.
 *
 * Mark an element with data-no-translate to leave its contents alone (e.g. text typed by people).
 */
import type { ChatLanguage } from '../../types/help';
import { translateVisitorText } from './visitorStrings';
import { translateVisitorPattern } from './visitorStringsExtra';

const ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'alt'];
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'NOSCRIPT']);

interface Shown {
  /** The English text the component wrote. */
  source: string;
  /** What is on the page now. */
  shown: string;
}

const textRecords = new WeakMap<Text, Shown>();
const attributeRecords = new WeakMap<Element, Map<string, Shown>>();

let language: ChatLanguage = 'en';
let observer: MutationObserver | null = null;

/** Development aid: English text seen on screen that has no translation yet. */
const missing: Set<string> | undefined = import.meta.env.DEV ? new Set<string>() : undefined;
if (missing) (window as unknown as { __mintMissing?: Set<string> }).__mintMissing = missing;

function translate(source: string): string {
  const core = source.trim();
  if (!core || !/[A-Za-z]/.test(core)) return source;

  let result = translateVisitorText(core, language);
  if (result === core) {
    result = translateVisitorPattern(core, language, (piece) => translateVisitorText(piece, language)) ?? core;
  }
  if (result === core) {
    missing?.add(core);
    return source;
  }
  const start = source.indexOf(core);
  return source.slice(0, start) + result + source.slice(start + core.length);
}

function isSkipped(element: Element | null): boolean {
  return !element || SKIP_TAGS.has(element.tagName) || element.closest('[data-no-translate]') !== null;
}

/** Works out the English source of a value, given what we last put there. */
function resolve(current: string, record: Shown | undefined): Shown {
  const source = record && current === record.shown ? record.source : current;
  return { source, shown: language === 'en' ? source : translate(source) };
}

function applyText(node: Text): void {
  if (isSkipped(node.parentElement)) return;
  const current = node.nodeValue ?? '';
  const next = resolve(current, textRecords.get(node));
  textRecords.set(node, next);
  if (next.shown !== current) node.nodeValue = next.shown;
}

function applyAttribute(element: Element, name: string): void {
  const current = element.getAttribute(name);
  if (current === null || isSkipped(element)) return;
  let records = attributeRecords.get(element);
  if (!records) {
    records = new Map();
    attributeRecords.set(element, records);
  }
  const next = resolve(current, records.get(name));
  records.set(name, next);
  if (next.shown !== current) element.setAttribute(name, next.shown);
}

function applyElement(element: Element): void {
  for (const name of ATTRIBUTES) applyAttribute(element, name);
}

function applyTree(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) return applyText(root as Text);
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  applyElement(root as Element);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) applyText(node as Text);
    else applyElement(node as Element);
  }
}

function onMutations(mutations: MutationRecord[]): void {
  for (const mutation of mutations) {
    if (mutation.type === 'characterData') applyTree(mutation.target);
    else if (mutation.type === 'attributes' && mutation.attributeName) {
      applyAttribute(mutation.target as Element, mutation.attributeName);
    } else mutation.addedNodes.forEach(applyTree);
  }
}

/** Shows the whole page in this language, and keeps new content in it too. 'en' restores English. */
export function applyPageLanguage(next: ChatLanguage): void {
  language = next;
  applyTree(document.body);
  if (!observer) {
    observer = new MutationObserver(onMutations);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRIBUTES,
    });
  }
}
