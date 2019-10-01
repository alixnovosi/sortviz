import { Util } from "./util";

export class RadioRow {
    public element: HTMLElement;

    constructor(
        rowName: string,
        values: string[],
        defaultValue: string,
        callback: (value: string) => () => void,
    ) {
        this.element = document.createElement("div");
        this.element.className = "radioContainer";

        let labelElem = document.createElement("h4");
        labelElem.innerHTML = rowName;
        this.element.appendChild(labelElem);

        let buttonContainer = document.createElement("div");
        buttonContainer.className = "radioButtonRow";
        this.element.appendChild(buttonContainer);

        for (let value of values) {
            let parsedValue = Util.textFilter(value);
            let inputElem = document.createElement("input");

            inputElem.checked = false;
            if (value === defaultValue) {
                inputElem.checked = true;
            }

            inputElem.type = "radio";
            inputElem.name = rowName;
            inputElem.value = value;
            inputElem.id = parsedValue;
            inputElem.addEventListener("click", callback(value));

            let inputLabel = document.createElement("label");
            inputLabel.setAttribute("for", parsedValue);
            inputLabel.innerHTML = parsedValue;

            buttonContainer.appendChild(inputElem);
            buttonContainer.appendChild(inputLabel);
        }
    }
}
