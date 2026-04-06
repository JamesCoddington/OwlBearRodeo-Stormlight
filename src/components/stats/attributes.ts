import { el } from "../../utils/dom.ts";
import { renderNumberInput } from "../shared/number-input.ts";
import type { Attributes } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

interface GroupDef {
  title: string;
  first: { key: keyof Attributes; label: string };
  second: { key: keyof Attributes; label: string };
  defenseKey: keyof Attributes;
}

const groups: GroupDef[] = [
  {
    title: "Physical",
    first: { key: "strength", label: "Strength" },
    second: { key: "speed", label: "Speed" },
    defenseKey: "physicalDefense",
  },
  {
    title: "Cognitive",
    first: { key: "intellect", label: "Intellect" },
    second: { key: "willpower", label: "Willpower" },
    defenseKey: "cognitiveDefense",
  },
  {
    title: "Spiritual",
    first: { key: "awareness", label: "Awareness" },
    second: { key: "presence", label: "Presence" },
    defenseKey: "spiritualDefense",
  },
];

function scoreCell(
  label: string,
  value: number,
  onChange: (v: number) => void,
): HTMLInputElement {
  const cell = el("div", { className: "attr-cell" });
  cell.appendChild(el("div", { className: "attr-cell-label" }, label));
  const input = renderNumberInput(value, onChange, "attr-score-input") as HTMLInputElement;
  cell.appendChild(input);
  // Return the cell but expose the input via a property for syncing
  (cell as unknown as { _input: HTMLInputElement })._input = input;
  return cell as unknown as HTMLInputElement;
}

function defenseCell(
  groupTitle: string,
  value: number,
): { el: HTMLElement; input: HTMLInputElement } {
  const cell = el("div", { className: "attr-cell attr-cell-defense" });
  cell.appendChild(el("div", { className: "attr-cell-label" }, `${groupTitle} DEF`));
  const input = renderNumberInput(value, () => {}, "attr-defense-input") as HTMLInputElement;
  input.readOnly = true;
  input.title = "Auto-calculated: stat1 + stat2 + 10";
  cell.appendChild(input);
  return { el: cell, input };
}

export function renderAttributes(
  store: Store,
  onChange: (updated: Attributes) => void,
): HTMLElement {
  const container = el("div", { className: "attribute-groups" });
  const defenseInputs: { key: keyof Attributes; input: HTMLInputElement }[] = [];
  const scoreInputs: { key: keyof Attributes; input: HTMLInputElement }[] = [];

  for (const group of groups) {
    const attributes = store.get().attributes;
    const row = el("div", { className: "attribute-group-row" });

    const firstCell = scoreCell(group.first.label, attributes[group.first.key] as number, (v) =>
      onChange({ ...store.get().attributes, [group.first.key]: v }),
    );
    scoreInputs.push({ key: group.first.key, input: (firstCell as unknown as { _input: HTMLInputElement })._input });
    row.appendChild(firstCell as unknown as HTMLElement);

    const secondCell = scoreCell(group.second.label, attributes[group.second.key] as number, (v) =>
      onChange({ ...store.get().attributes, [group.second.key]: v }),
    );
    scoreInputs.push({ key: group.second.key, input: (secondCell as unknown as { _input: HTMLInputElement })._input });
    row.appendChild(secondCell as unknown as HTMLElement);

    const defense = defenseCell(group.title, attributes[group.defenseKey] as number);
    defenseInputs.push({ key: group.defenseKey, input: defense.input });
    row.appendChild(defense.el);

    container.appendChild(row);
  }

  store.subscribe(() => {
    const attrs = store.get().attributes;
    for (const { key, input } of scoreInputs) {
      if (document.activeElement !== input) {
        const latest = String(attrs[key] as number);
        if (input.value !== latest) input.value = latest;
      }
    }
    for (const { key, input } of defenseInputs) {
      const latest = String(attrs[key] as number);
      if (input.value !== latest) input.value = latest;
    }
  });

  return container;
}
