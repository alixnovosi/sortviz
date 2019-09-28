export class Slider {
    public element: HTMLElement;

    public value: number;

    constructor(
        base: HTMLElement,
        min: number,
        max: number,
        value: number,
        onUpdate: (label: HTMLLabelElement) => (event: Event) => void,
    ) {
        this.element = document.createElement("div");
        this.element.className = "slideContainer";

        this.value = value;

        let input = document.createElement("input");
        input.type = "range";
        input.min = `${min}`;
        input.max = `${max}`;
        input.value = `${this.value}`;
        input.className = "slider";

        this.element.appendChild(input);

        let label = document.createElement("label");
        label.innerHTML = `${this.value}`;
        label.className = "sliderLabel";

        this.element.appendChild(label);

        this.element.addEventListener("change", onUpdate(label));

        base.appendChild(this.element);
    }
}
