export class Slider {
    public element: HTMLElement;

    public value: number;

    constructor(
        titleLabel: string,
        min: number,
        max: number,
        init: number,
        callback: (label: HTMLLabelElement) => (event: Event) => void,
    ) {
        this.element = document.createElement("div");
        this.element.className = "slideContainer";

        let titleElem = document.createElement("h4");
        titleElem.innerHTML = titleLabel;
        this.element.appendChild(titleElem);

        this.value = init;

        let input = document.createElement("input");
        input.type = "range";
        input.min = `${min}`;
        input.max = `${max}`;
        input.value = `${this.value}`;
        input.className = "slider";

        this.element.appendChild(input);

        let labelElement = document.createElement("label");
        labelElement.innerHTML = `${this.value}`;
        labelElement.className = "sliderLabel";

        this.element.appendChild(labelElement);

        this.element.addEventListener("change", callback(labelElement));
    }
}
