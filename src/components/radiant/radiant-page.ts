import { renderCollapsible } from "../shared/collapsible.ts";
import { renderStormlightActions } from "./stormlight-actions.ts";
import { renderIdeals } from "./ideals.ts";
import { renderSpren } from "./spren.ts";
import { renderSurges } from "./surges.ts";
import type { Store } from "../../state/store.ts";

export function renderRadiantPage(container: HTMLElement, store: Store): void {
  // Stormlight & Spren Actions
  container.appendChild(
    renderCollapsible("Actions Reference", false, (body) => {
      body.appendChild(renderStormlightActions());
    }),
  );

  // Ideals
  container.appendChild(renderIdeals(store));

  // Spren
  container.appendChild(renderSpren(store));

  // Surges
  container.appendChild(
    renderCollapsible("Surges", true, (body) => {
      body.appendChild(renderSurges(store));
    }),
  );
}
