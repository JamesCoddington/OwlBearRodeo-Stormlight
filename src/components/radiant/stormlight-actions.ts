import { el } from "../../utils/dom.ts";

interface ActionDef {
  name: string;
  description: string;
}

const STORMLIGHT_ACTIONS: ActionDef[] = [
  {
    name: "Enhance (1)",
    description:
      "Spend 1 Investiture to become Enhanced [Strength +1] and Enhanced [Speed +1] until the end of your next turn. You can spend 1 Investiture as \u25B7 to maintain this effect for another round.",
  },
  {
    name: "Breathe Stormlight (2)",
    description:
      "Draw Stormlight from infused spheres within 5 ft. Recover Investiture up to your max.",
  },
  {
    name: "Regenerate (\u25B7)",
    description:
      "Spend 1 Investiture to recover health equal to 1d6 + your current tier. You can use this even while Unconscious.",
  },
];

const SPREN_ACTIONS: ActionDef[] = [
  {
    name: "Covert Scouting (2 Focus)",
    description: "Stealthily scout an area within spren bond range.",
  },
  {
    name: "Oath Encouragement (\u25B7 or \u21BB, 2 Focus)",
    description:
      "Gain an advantage on your next test to face self-doubt, fear, or your obstacle.",
  },
  {
    name: "Test Assistance (\u25B7 or \u21BB, 1 Focus)",
    description:
      "Grants an advantage on tests related to this spren's knowledge and philosophy.",
  },
  {
    name: "Sudden Warning (3 Focus)",
    description: "Alert you to imminent danger (no action required).",
  },
  {
    name: "Translation (2, 2 Focus)",
    description:
      "For one minute, translate spoken and signed Rosharan language.",
  },
];

function renderActionBlock(title: string, actions: ActionDef[]): HTMLElement {
  const wrapper = el("div");
  const titleEl = el("div", { className: "section-title" }, title);
  wrapper.appendChild(titleEl);

  for (const action of actions) {
    const card = el("div", { className: "stormlight-action" });
    const name = el("div", { className: "stormlight-action-name" }, action.name);
    const desc = el("div", { className: "stormlight-action-desc" }, action.description);
    card.append(name, desc);
    wrapper.appendChild(card);
  }

  return wrapper;
}

export function renderStormlightActions(): HTMLElement {
  const container = el("div");
  container.appendChild(renderActionBlock("Stormlight Actions", STORMLIGHT_ACTIONS));
  container.appendChild(renderActionBlock("Spren Actions", SPREN_ACTIONS));
  return container;
}
