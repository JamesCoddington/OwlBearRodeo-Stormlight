import { el } from "./utils/dom.ts";
import { renderHeader } from "./components/header.ts";
import { renderTabs } from "./components/tabs.ts";
import { renderStatsPage } from "./components/stats/stats-page.ts";
import { renderDetailsPage } from "./components/details/details-page.ts";
import { renderRadiantPage } from "./components/radiant/radiant-page.ts";
import type { Store } from "./state/store.ts";

export function initApp(root: HTMLElement, store: Store): void {
  root.innerHTML = "";

  const header = renderHeader(store);
  const tabBar = renderTabs(["Stats", "Details", "Radiant"], onTabChange);
  const content = el("div", { className: "tab-content" });

  root.append(header, tabBar, content);

  const pages = [renderStatsPage, renderDetailsPage, renderRadiantPage];

  function onTabChange(index: number): void {
    content.innerHTML = "";
    pages[index](content, store);
  }

  // Start on Stats tab
  onTabChange(0);
}
