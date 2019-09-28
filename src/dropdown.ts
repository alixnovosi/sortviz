export class DropDown {
    public element: HTMLSelectElement;

    constructor(
        base: HTMLElement,
        options: string[],
        onUpdate: (event: Event) => void,
    ) {
        this.element = document.createElement("select");

        for (let option of options) {
            let option_element = document.createElement("option");
            option_element.value = option;
            option_element.text = option;
            this.element.appendChild(option_element);
        }

        this.element.addEventListener("change", onUpdate);

        base.appendChild(this.element);
    }
}
