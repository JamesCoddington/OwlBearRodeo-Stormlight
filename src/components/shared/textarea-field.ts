import { el } from "../../utils/dom.ts";

export function renderTextareaField(
  label: string,
  value: string,
  onChange: (value: string) => void,
  placeholder?: string,
): HTMLElement {
  const wrapper = el("div");
  const title = el("div", { className: "section-title" }, label);
  const textarea = el("textarea", {
    className: "textarea-field",
    placeholder: placeholder ?? "",
  });
  textarea.value = value;
  textarea.addEventListener("input", () => onChange(textarea.value));
  wrapper.append(title, textarea);
  return wrapper;
}
