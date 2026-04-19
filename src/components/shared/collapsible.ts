import { el } from "../../utils/dom.ts";

export function renderCollapsible(
  title: string,
  defaultOpen: boolean,
  buildContent: (body: HTMLElement) => void,
): HTMLElement {
  const wrapper = el("div", {
    className: defaultOpen ? "collapsible" : "collapsible collapsed",
  });

  const header = el("div", { className: "collapsible-header" });
  const arrow = el("span", { className: "collapsible-arrow" }, "\u25BC");
  const titleEl = document.createTextNode(title);
  header.append(arrow, titleEl);

  header.addEventListener("click", () => {
    const wasCollapsed = wrapper.classList.contains("collapsed");
    wrapper.classList.toggle("collapsed");
    if (wasCollapsed) {
      body.querySelectorAll<HTMLTextAreaElement>("textarea").forEach((ta) => {
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight}px`;
      });
    }
  });

  const body = el("div", { className: "collapsible-body" });
  buildContent(body);

  wrapper.append(header, body);
  return wrapper;
}
