import { Util } from "./util";

export class DropDown {
    public element: HTMLElement;

    constructor(
        titleLabel: string,
        options: string[],
        onUpdate: (event: Event) => void,
    ) {
        this.element = document.createElement("div");
        this.element.className = "dropdownContainer";

        let labelElem = document.createElement("h4");
        labelElem.innerHTML = titleLabel;
        this.element.appendChild(labelElem);

        let select = document.createElement("select");

        for (let option of options) {
            let option_element = document.createElement("option");
            option_element.value = option;
            option_element.text = Util.textFilter(option);
            select.appendChild(option_element);
        }

        this.element.appendChild(select);

        this.element.addEventListener("change", onUpdate);
    }
}
