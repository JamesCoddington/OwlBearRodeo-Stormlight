import { el } from "../../utils/dom.ts";

function autoResize(textarea: HTMLTextAreaElement): void {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

export function renderListField(
  items: string[],
  onChange: (items: string[]) => void,
  placeholder?: string,
): HTMLElement {
  const wrapper = el("div", { className: "list-field" });

  function rebuild(): void {
    wrapper.innerHTML = "";
    const current = [...items];

    current.forEach((item, i) => {
      const row = el("div", { className: "list-field-item" });
      const input = el("textarea", {
        className: "field-input field-input-grow",
        placeholder: placeholder ?? "",
        rows: "1",
      }) as HTMLTextAreaElement;
      input.value = item;
      input.addEventListener("input", () => {
        autoResize(input);
        items[i] = input.value;
        onChange([...items]);
      });
      requestAnimationFrame(() => autoResize(input));

      const removeBtn = el("button", { className: "list-field-remove" }, "\u00D7");
      removeBtn.addEventListener("click", () => {
        items.splice(i, 1);
        onChange([...items]);
        rebuild();
      });

      row.append(input, removeBtn);
      wrapper.appendChild(row);
    });

    const addBtn = el("button", { className: "list-field-add" }, "+ Add");
    addBtn.addEventListener("click", () => {
      items.push("");
      onChange([...items]);
      rebuild();
    });
    wrapper.appendChild(addBtn);
  }

  rebuild();
  return wrapper;
}
