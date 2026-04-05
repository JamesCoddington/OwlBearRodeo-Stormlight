import { el } from "../../utils/dom.ts";

export function renderNumberInput(
  value: number,
  onChange: (value: number) => void,
  className?: string,
): HTMLInputElement {
  const input = el("input", {
    className: `number-input ${className ?? ""}`.trim(),
    type: "number",
  });
  input.value = String(value);
  input.addEventListener("input", () => {
    onChange(parseInt(input.value) || 0);
  });
  return input;
}
