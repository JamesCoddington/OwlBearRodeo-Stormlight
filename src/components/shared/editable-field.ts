import { el } from "../../utils/dom.ts";

export function renderEditableField(
  label: string,
  value: string,
  onChange: (value: string) => void,
  placeholder?: string,
): HTMLElement {
  const row = el("div", { className: "field-row" });
  const labelEl = el("span", { className: "field-label" }, label);
  const input = el("input", {
    className: "field-input",
    type: "text",
    placeholder: placeholder ?? "",
  });
  input.value = value;
  input.addEventListener("input", () => onChange(input.value));
  row.append(labelEl, input);
  return row;
}
