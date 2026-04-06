import { el } from "../../utils/dom.ts";
import { renderResourceBar } from "../shared/resource-bar.ts";
import { renderNumberInput } from "../shared/number-input.ts";
import type { Resource } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

export function renderResources(store: Store): HTMLElement {
  const section = el("div", { className: "resources-section" });
  const data = store.get();

  const healthBar = renderResourceBar("Health", "health", data.health, (r: Resource) =>
    store.update({ health: r }),
  );
  const healthCurrentInput = healthBar.querySelector<HTMLInputElement>(".resource-current");
  const healthMaxInput = healthBar.querySelector<HTMLInputElement>(".resource-max");
  section.appendChild(healthBar);

  const focusBar = renderResourceBar("Focus", "focus", data.focus, (r: Resource) =>
    store.update({ focus: r }),
  );
  const focusCurrentInput = focusBar.querySelector<HTMLInputElement>(".resource-current");
  // Focus max is auto-calculated (2 + Willpower) — make it read-only and keep it synced
  const focusMaxInput = focusBar.querySelector<HTMLInputElement>(".resource-max");
  if (focusMaxInput) {
    focusMaxInput.readOnly = true;
    focusMaxInput.title = "Auto-calculated: 2 + Willpower";
    store.subscribe(() => {
      const latest = String(store.get().focus.max);
      if (focusMaxInput.value !== latest) focusMaxInput.value = latest;
    });
  }
  section.appendChild(focusBar);
  const investitureBar = renderResourceBar("Investiture", "investiture", data.investiture, (r: Resource) =>
    store.update({ investiture: r }),
  );
  const investitureCurrentInput = investitureBar.querySelector<HTMLInputElement>(".resource-current");
  // Investiture max is auto-calculated (2 + higher of Awareness or Presence)
  const investitureMaxInput = investitureBar.querySelector<HTMLInputElement>(".resource-max");
  if (investitureMaxInput) {
    investitureMaxInput.readOnly = true;
    investitureMaxInput.title = "Auto-calculated: 2 + higher of Awareness or Presence";
    store.subscribe(() => {
      const latest = String(store.get().investiture.max);
      if (investitureMaxInput.value !== latest) investitureMaxInput.value = latest;
    });
  }
  section.appendChild(investitureBar);

  const deflectRow = el("div", { className: "deflect-row" });
  const deflectLabel = el("span", { className: "resource-label" }, "Deflect");
  const deflectInput = renderNumberInput(data.deflect, (v) =>
    store.update({ deflect: v }),
  );
  deflectRow.append(deflectLabel, deflectInput);
  section.appendChild(deflectRow);

  store.subscribe(() => {
    const d = store.get();
    if (healthCurrentInput && document.activeElement !== healthCurrentInput) {
      healthCurrentInput.value = String(d.health.current);
    }
    if (healthMaxInput && document.activeElement !== healthMaxInput) {
      healthMaxInput.value = String(d.health.max);
    }
    if (focusCurrentInput && document.activeElement !== focusCurrentInput) {
      focusCurrentInput.value = String(d.focus.current);
    }
    if (investitureCurrentInput && document.activeElement !== investitureCurrentInput) {
      investitureCurrentInput.value = String(d.investiture.current);
    }
    if (document.activeElement !== deflectInput) {
      deflectInput.value = String(d.deflect);
    }
  });

  return section;
}
