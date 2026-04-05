import type { CharacterSheet } from "../models/character.ts";

type Listener = () => void;

export class Store {
  private character: CharacterSheet;
  private listeners: Set<Listener> = new Set();

  constructor(initial: CharacterSheet) {
    this.character = initial;
  }

  get(): CharacterSheet {
    return this.character;
  }

  update(partial: Partial<CharacterSheet>): void {
    this.character = { ...this.character, ...partial };
    this.notify();
  }

  updateNested<K extends keyof CharacterSheet>(
    key: K,
    value: CharacterSheet[K],
  ): void {
    this.character = { ...this.character, [key]: value };
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const fn of this.listeners) {
      fn();
    }
  }
}
