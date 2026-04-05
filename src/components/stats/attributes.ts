import { el } from "../../utils/dom.ts";
import { renderNumberInput } from "../shared/number-input.ts";
import type { Attributes, AttributePair } from "../../models/character.ts";

interface AttrDef {
  key: keyof Attributes;
  label: string;
}

const groups: { title: string; attrs: AttrDef[] }[] = [
  {
    title: "Physical",
    attrs: [
      { key: "strength", label: "STR" },
      { key: "speed", label: "SPD" },
    ],
  },
  {
    title: "Cognitive",
    attrs: [
      { key: "intellect", label: "INT" },
      { key: "willpower", label: "WIL" },
    ],
  },
  {
    title: "Spiritual",
    attrs: [
      { key: "awareness", label: "AWA" },
      { key: "presence", label: "PRE" },
    ],
  },
];

export function renderAttributes(
  attributes: Attributes,
  onChange: (updated: Attributes) => void,
): HTMLElement {
  const container = el("div", { className: "attribute-groups" });

  for (const group of groups) {
    const groupEl = el("div", { className: "attribute-group" });
    const title = el("div", { className: "attribute-group-title" }, group.title);
    groupEl.appendChild(title);

    const rowsContainer = el("div", { className: "attribute-group-rows" });

    for (const attr of group.attrs) {
      const row = el("div", { className: "attribute-row" });
      const nameEl = el("span", { className: "attribute-name" }, attr.label);

      const vals = el("div", { className: "attribute-values" });

      const scoreInput = renderNumberInput(
        attributes[attr.key].score,
        (v) => {
          const updated = {
            ...attributes,
            [attr.key]: { ...attributes[attr.key], score: v } as AttributePair,
          };
          onChange(updated);
        },
        "attribute-score",
      );

      const defLabel = el("span", { className: "attribute-def-label" }, "DEF");

      const defInput = renderNumberInput(
        attributes[attr.key].defense,
        (v) => {
          const updated = {
            ...attributes,
            [attr.key]: { ...attributes[attr.key], defense: v } as AttributePair,
          };
          onChange(updated);
        },
        "attribute-defense",
      );

      vals.append(scoreInput, defLabel, defInput);
      row.append(nameEl, vals);
      rowsContainer.appendChild(row);
    }

    groupEl.appendChild(rowsContainer);
    container.appendChild(groupEl);
  }

  return container;
}
