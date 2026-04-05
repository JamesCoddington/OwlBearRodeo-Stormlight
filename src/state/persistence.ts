import OBR from "@owlbear-rodeo/sdk";
import type { CharacterSheet } from "../models/character.ts";
import { createDefaultCharacter } from "../models/defaults.ts";
import type { Store } from "./store.ts";
import { debounce } from "../utils/debounce.ts";

const STORAGE_KEY_PREFIX = "stormlight-character-";
const OBR_METADATA_KEY = "com.stormlight-sheet/character";

interface StorageEnvelope {
  version: number;
  timestamp: number;
  data: CharacterSheet;
}

function getPlayerId(isOBR: boolean): string {
  if (isOBR) {
    try {
      return OBR.player.id;
    } catch {
      return "local";
    }
  }
  return "local";
}

export async function loadCharacter(isOBR: boolean): Promise<CharacterSheet> {
  const playerId = getPlayerId(isOBR);

  // Try localStorage
  const localRaw = localStorage.getItem(STORAGE_KEY_PREFIX + playerId);
  const localEnvelope: StorageEnvelope | null = localRaw
    ? JSON.parse(localRaw)
    : null;

  // Try OBR metadata (only when running inside OBR)
  let obrEnvelope: StorageEnvelope | null = null;
  if (isOBR) {
    try {
      const metadata = await OBR.player.getMetadata();
      const stored = metadata[OBR_METADATA_KEY];
      if (stored && typeof stored === "object") {
        obrEnvelope = stored as StorageEnvelope;
      }
    } catch {
      // OBR metadata not available
    }
  }

  // Use whichever is more recent
  if (localEnvelope && obrEnvelope) {
    return localEnvelope.timestamp > obrEnvelope.timestamp
      ? localEnvelope.data
      : obrEnvelope.data;
  }
  return localEnvelope?.data ?? obrEnvelope?.data ?? createDefaultCharacter();
}

function saveToLocalStorage(playerId: string, data: CharacterSheet): void {
  const envelope: StorageEnvelope = {
    version: data.version,
    timestamp: Date.now(),
    data,
  };
  localStorage.setItem(
    STORAGE_KEY_PREFIX + playerId,
    JSON.stringify(envelope),
  );
}

async function saveToOBR(data: CharacterSheet): Promise<void> {
  const envelope: StorageEnvelope = {
    version: data.version,
    timestamp: Date.now(),
    data,
  };
  try {
    await OBR.player.setMetadata({ [OBR_METADATA_KEY]: envelope });
  } catch {
    // OBR save failed silently
  }
}

export function setupAutoSave(store: Store, isOBR: boolean): void {
  const playerId = getPlayerId(isOBR);

  const debouncedLocal = debounce(() => {
    saveToLocalStorage(playerId, store.get());
  }, 500);

  const debouncedOBR = isOBR
    ? debounce(() => {
        saveToOBR(store.get());
      }, 2000)
    : null;

  store.subscribe(() => {
    debouncedLocal();
    debouncedOBR?.();
  });
}
