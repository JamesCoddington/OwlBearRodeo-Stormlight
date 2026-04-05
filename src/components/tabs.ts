import { el } from "../utils/dom.ts";

export function renderTabs(
  labels: string[],
  onTabChange: (index: number) => void,
): HTMLElement {
  const bar = el("div", { className: "tab-bar" });

  const buttons = labels.map((label, i) => {
    const btn = el("button", {}, label);
    if (i === 0) btn.classList.add("active");
    btn.addEventListener("click", () => {
      for (const b of buttons) b.classList.remove("active");
      btn.classList.add("active");
      onTabChange(i);
    });
    return btn;
  });

  for (const btn of buttons) bar.appendChild(btn);
  return bar;
}
