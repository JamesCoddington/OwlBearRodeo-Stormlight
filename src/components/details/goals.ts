import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import type { Goal } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

const MAX_GOAL_BUBBLES = 3;

function autoResize(textarea: HTMLTextAreaElement): void {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

export function renderGoals(store: Store): HTMLElement {
  const container = el("div");

  function rebuild(): void {
    container.innerHTML = "";
    const data = store.get();

    const poGrid = el("div", { className: "purpose-obstacle" });
    poGrid.appendChild(
      renderEditableField("Purpose", data.purpose, (v) => store.update({ purpose: v }), "Your purpose"),
    );
    poGrid.appendChild(
      renderEditableField("Obstacle", data.obstacle, (v) => store.update({ obstacle: v }), "Your obstacle"),
    );
    container.appendChild(poGrid);

    const goalsTitle = el("div", { className: "section-title" }, "Goals");
    container.appendChild(goalsTitle);

    data.goals.forEach((goal: Goal, i: number) => {
      const row = el("div", { className: "goal-row" });

      const textarea = el("textarea", {
        className: "field-input field-input-grow",
        placeholder: "Enter a goal...",
        rows: "1",
      }) as HTMLTextAreaElement;
      textarea.value = goal.text;
      textarea.addEventListener("input", () => {
        autoResize(textarea);
        const updated = [...store.get().goals];
        updated[i] = { ...updated[i], text: textarea.value };
        store.updateNested("goals", updated);
      });
      requestAnimationFrame(() => autoResize(textarea));

      const bubblesEl = el("div", { className: "skill-bubbles" });
      let currentAchieved = goal.achieved;
      const bubbleEls: HTMLElement[] = [];

      for (let b = 1; b <= MAX_GOAL_BUBBLES; b++) {
        const bubble = el("button", { className: "skill-bubble", type: "button" });
        bubble.classList.toggle("filled", b <= currentAchieved);
        const idx = b;
        bubble.addEventListener("click", () => {
          currentAchieved = currentAchieved === idx ? idx - 1 : idx;
          bubbleEls.forEach((bel, bi) => bel.classList.toggle("filled", bi < currentAchieved));
          const updated = [...store.get().goals];
          updated[i] = { ...updated[i], achieved: currentAchieved };
          store.updateNested("goals", updated);
        });
        bubbleEls.push(bubble);
        bubblesEl.appendChild(bubble);
      }

      const removeBtn = el("button", { className: "list-field-remove" }, "\u00D7");
      removeBtn.addEventListener("click", () => {
        const updated = [...store.get().goals];
        updated.splice(i, 1);
        store.updateNested("goals", updated);
        rebuild();
      });

      row.append(textarea, bubblesEl, removeBtn);
      container.appendChild(row);
    });

    const addBtn = el("button", { className: "list-field-add" }, "+ Add Goal");
    addBtn.addEventListener("click", () => {
      const updated = [...store.get().goals, { text: "", achieved: 0 }];
      store.updateNested("goals", updated);
      rebuild();
    });
    container.appendChild(addBtn);
  }

  rebuild();
  store.subscribe(() => {
    if (!container.contains(document.activeElement)) rebuild();
  });

  return container;
}
