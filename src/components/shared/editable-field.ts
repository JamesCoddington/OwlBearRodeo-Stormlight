import { el } from "../../utils/dom.ts";

function autoResize(textarea: HTMLTextAreaElement): void {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

export function renderEditableField(
  label: string,
  value: string,
  onChange: (value: string) => void,
  placeholder?: string,
): HTMLElement {
  const row = el("div", { className: "field-row" });
  const labelEl = el("span", { className: "field-label" }, label);
  const textarea = el("textarea", {
    className: "field-input field-input-grow",
    placeholder: placeholder ?? "",
    rows: "1",
  }) as HTMLTextAreaElement;
  textarea.value = value;
  textarea.addEventListener("input", () => {
    autoResize(textarea);
    onChange(textarea.value);
  });
  // Size to content on initial render
  requestAnimationFrame(() => autoResize(textarea));
  row.append(labelEl, textarea);
  return row;
}
