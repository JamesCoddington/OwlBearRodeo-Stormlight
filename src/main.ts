import OBR from "@owlbear-rodeo/sdk";
import { initApp } from "./app.ts";
import type { GMContext } from "./app.ts";
import { Store } from "./state/store.ts";
import { loadCharacter, setupAutoSave } from "./state/persistence.ts";
import { checkIsGM, loadPartyMembers } from "./state/party.ts";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/stats.css";
import "./styles/details.css";
import "./styles/radiant.css";

async function startApp(isOBR: boolean): Promise<void> {
  const character = await loadCharacter(isOBR);
  const store = new Store(character);

  let gmContext: GMContext | undefined;

  if (isOBR) {
    try {
      const isGM = await checkIsGM();
      if (isGM) {
        const currentPlayerId = OBR.player.id;
        const partyMembers = await loadPartyMembers(currentPlayerId);
        gmContext = { currentPlayerId, partyMembers };
      }
    } catch {
      // GM check failed — continue without GM context
    }
  }

  const root = document.querySelector<HTMLDivElement>("#app")!;
  initApp(root, store, gmContext);

  setupAutoSave(store, isOBR);
}

// Try OBR first — if it fires, we're inside the extension iframe.
// If it doesn't fire within 1 second, assume standalone dev mode.
let obrReady = false;

OBR.onReady(() => {
  obrReady = true;
  startApp(true);
});

setTimeout(() => {
  if (!obrReady) {
    startApp(false);
  }
}, 1000);
