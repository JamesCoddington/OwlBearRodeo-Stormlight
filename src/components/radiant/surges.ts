import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import { renderListField } from "../shared/list-field.ts";
import type { Surge } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

function renderSurgeCard(
  index: number,
  surge: Surge,
  store: Store,
): HTMLElement {
  const card = el("div", { className: "surge-card" });
  const title = el("div", { className: "surge-card-title" }, `Surge ${index + 1}`);
  card.appendChild(title);

  function updateSurge(partial: Partial<Surge>): void {
    const surges = [...store.get().surges] as [Surge, Surge];
    surges[index] = { ...surges[index], ...partial };
    store.updateNested("surges", surges);
  }

  const fields = el("div", { className: "surge-fields" });

  // Name - full width
  const nameField = renderEditableField("Name", surge.name, (v) => updateSurge({ name: v }), "Surge name");
  nameField.classList.add("surge-field-full");
  fields.appendChild(nameField);

  // Effect - full width
  const effectField = renderEditableField("Effect", surge.effect, (v) => updateSurge({ effect: v }), "Effect");
  effectField.classList.add("surge-field-full");
  fields.appendChild(effectField);

  // Activation & Mod
  fields.appendChild(
    renderEditableField("Activation", surge.activation, (v) => updateSurge({ activation: v })),
  );
  fields.appendChild(
    renderEditableField("Mod", surge.mod, (v) => updateSurge({ mod: v })),
  );

  // Size & Die
  fields.appendChild(
    renderEditableField("Size", surge.size, (v) => updateSurge({ size: v })),
  );
  fields.appendChild(
    renderEditableField("Die", surge.die, (v) => updateSurge({ die: v })),
  );

  card.appendChild(fields);

  // Talents
  const talentsTitle = el("div", {
    className: "field-label",
    style: "margin-top: 6px",
  }, "Talents");
  card.appendChild(talentsTitle);
  card.appendChild(
    renderListField(
      [...surge.talents],
      (items) => updateSurge({ talents: items }),
      "Surge talent...",
    ),
  );

  return card;
}

export function renderSurges(store: Store): HTMLElement {
  const container = el("div");
  const data = store.get();

  container.appendChild(renderSurgeCard(0, data.surges[0], store));
  container.appendChild(renderSurgeCard(1, data.surges[1], store));

  return container;
}
