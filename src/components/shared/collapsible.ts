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
    wrapper.classList.toggle("collapsed");
  });

  const body = el("div", { className: "collapsible-body" });
  buildContent(body);

  wrapper.append(header, body);
  return wrapper;
}
