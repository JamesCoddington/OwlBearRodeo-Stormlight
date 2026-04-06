import { el } from "./utils/dom.ts";
import { renderHeader } from "./components/header.ts";
import { renderTabs } from "./components/tabs.ts";
import { renderStatsPage } from "./components/stats/stats-page.ts";
import { renderDetailsPage } from "./components/details/details-page.ts";
import { renderRadiantPage } from "./components/radiant/radiant-page.ts";
import { renderGMPlayerBar } from "./components/gm-player-tabs.ts";
import { onPartyChange } from "./state/party.ts";
import type { PartyMember } from "./state/party.ts";
import { Store } from "./state/store.ts";

export interface GMContext {
  currentPlayerId: string;
  partyMembers: PartyMember[];
}

export function initApp(root: HTMLElement, store: Store, gmContext?: GMContext): void {
  root.innerHTML = "";

  let partyMembers = gmContext?.partyMembers ?? [];
  let viewingId: string | null = null;
  let gmBar: ReturnType<typeof renderGMPlayerBar> | null = null;

  const sheetContainer = el("div", { className: "sheet-container" });

  const pages = [renderStatsPage, renderDetailsPage, renderRadiantPage];

  function renderSheet(targetStore: Store, readonly: boolean): void {
    sheetContainer.innerHTML = "";
    sheetContainer.classList.toggle("viewing-mode", readonly);

    const header = renderHeader(targetStore);
    const tabBar = renderTabs(["Stats", "Details", "Radiant"], onTabChange);
    const content = el("div", { className: "tab-content" });

    sheetContainer.append(header, tabBar, content);

    function onTabChange(index: number): void {
      content.innerHTML = "";
      pages[index](content, targetStore);
    }

    onTabChange(0);
  }

  function handleSelectPlayer(memberId: string | null): void {
    viewingId = memberId;
    gmBar?.update(partyMembers, viewingId);

    if (memberId === null) {
      renderSheet(store, false);
    } else {
      const member = partyMembers.find((m) => m.id === memberId);
      if (member?.sheet) {
        renderSheet(new Store(member.sheet), true);
      } else {
        sheetContainer.innerHTML = "";
        sheetContainer.classList.remove("viewing-mode");
        const name = member?.name ?? "This player";
        sheetContainer.appendChild(
          el("div", { className: "gm-no-sheet" }, `${name} hasn't loaded their sheet yet.`),
        );
      }
    }
  }

  if (gmContext) {
    gmBar = renderGMPlayerBar(handleSelectPlayer);
    root.appendChild(gmBar.element);

    onPartyChange((members) => {
      partyMembers = members;
      gmBar?.update(members, viewingId);

      // If currently viewing a player whose data just updated, refresh the view
      if (viewingId !== null) {
        const member = members.find((m) => m.id === viewingId);
        if (member?.sheet) {
          renderSheet(new Store(member.sheet), true);
        }
      }
    }, gmContext.currentPlayerId);
  }

  root.appendChild(sheetContainer);
  renderSheet(store, false);
}
