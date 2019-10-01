export class StatBar {
    private element: HTMLElement;
    private swatch: HTMLDivElement;
    private statName: HTMLElement;
    private countItem: HTMLElement;

    constructor(
        container: HTMLElement,
        color: string,
        label: string,
        initValue: number,
    ) {
        this.element = container;

        this.swatch = document.createElement("div");
        this.swatch.style.backgroundColor = color;
        this.swatch.className = "swatch";
        this.element.appendChild(this.swatch);

        this.statName = document.createElement("p");
        this.statName.innerHTML = label;
        this.element.appendChild(this.statName);

        this.countItem = document.createElement("p");
        this.countItem.innerHTML = `${initValue}`;
        this.element.appendChild(this.countItem);
    }

    public setValue(value: number): void {
        this.countItem.innerHTML = `${value}`;
    }
}
