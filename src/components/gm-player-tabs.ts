import { el } from "../utils/dom.ts";
import type { PartyMember } from "../state/party.ts";

export interface GMPlayerBar {
  element: HTMLElement;
  update(members: PartyMember[], viewingId: string | null): void;
}

export function renderGMPlayerBar(
  onSelect: (memberId: string | null) => void,
): GMPlayerBar {
  const bar = el("div", { className: "gm-player-bar" });

  function rebuild(members: PartyMember[], viewingId: string | null): void {
    bar.innerHTML = "";

    const label = el("span", { className: "gm-bar-label" }, "Viewing:");
    bar.appendChild(label);

    const ownBtn = el(
      "button",
      { className: viewingId === null ? "gm-player-btn active" : "gm-player-btn" },
      "\u2605 Mine",
    );
    ownBtn.addEventListener("click", () => onSelect(null));
    bar.appendChild(ownBtn);

    for (const member of members) {
      const btn = el(
        "button",
        {
          className:
            viewingId === member.id ? "gm-player-btn active" : "gm-player-btn",
        },
        member.name || "Unknown Player",
      );
      btn.addEventListener("click", () => onSelect(member.id));
      bar.appendChild(btn);
    }
  }

  rebuild([], null);

  return {
    element: bar,
    update(members: PartyMember[], viewingId: string | null): void {
      rebuild(members, viewingId);
    },
  };
}
