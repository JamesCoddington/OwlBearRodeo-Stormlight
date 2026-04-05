import { el } from "../../utils/dom.ts";
import type { Resource } from "../../models/character.ts";

export function renderResourceBar(
  label: string,
  colorClass: string,
  resource: Resource,
  onChange: (updated: Resource) => void,
): HTMLElement {
  const wrapper = el("div", { className: `resource-bar ${colorClass}` });

  const labelEl = el("span", { className: "resource-label" }, label);

  const values = el("div", { className: "resource-values" });
  const currentInput = el("input", {
    className: "resource-current",
    type: "number",
  });
  currentInput.value = String(resource.current);

  const sep = el("span", { className: "separator" }, "/");

  const maxInput = el("input", {
    className: "resource-max",
    type: "number",
  });
  maxInput.value = String(resource.max);

  values.append(currentInput, sep, maxInput);

  const track = el("div", { className: "resource-track" });
  const fill = el("div", { className: "resource-fill" });

  function updateFill(): void {
    const max = parseInt(maxInput.value) || 0;
    const cur = parseInt(currentInput.value) || 0;
    const pct = max > 0 ? Math.min(100, (cur / max) * 100) : 0;
    fill.style.width = `${pct}%`;
  }

  updateFill();
  track.appendChild(fill);

  currentInput.addEventListener("input", () => {
    updateFill();
    onChange({
      current: parseInt(currentInput.value) || 0,
      max: parseInt(maxInput.value) || 0,
    });
  });
  maxInput.addEventListener("input", () => {
    updateFill();
    onChange({
      current: parseInt(currentInput.value) || 0,
      max: parseInt(maxInput.value) || 0,
    });
  });

  wrapper.append(labelEl, values, track);
  return wrapper;
}
