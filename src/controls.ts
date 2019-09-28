import { DropDown } from "./dropdown";
import { Slider } from "./slider";
import { Sort } from "./sorts";

// some constants.
const HORIZONTAL_AXIS: string = "horizontalAxis";
const VERTICAL_AXIS: string = "verticalAxis";

export class Controls {
    public base: HTMLElement;

    public dropdownChoice: string;
    public count: number;
    public delay: number;

    public warning: HTMLElement;

    private reloadButton: HTMLButtonElement;

    constructor(
        base: HTMLElement,
        sorts: string[],
        count: number,
        delay: number,
        updateCallback: (controls: Controls) => () => void,
    ) {
        this.base = base;

        // sort choice dropdown and label
        let sortingLabel = document.createElement("h4");
        sortingLabel.innerHTML = "sorting algorithm";
        this.base.appendChild(sortingLabel);

        let dropdownRow = document.createElement("div");
        dropdownRow.className = "sortControlRow";

        this.dropdownChoice = sorts[0];
        this.count = count;
        this.delay = delay;

        let dropdown = new DropDown(
            dropdownRow,
            sorts,
            this.onDropDownUpdate(),
        );

        this.base.appendChild(dropdownRow);

        // sort choice dropdown and label
        this.warning = document.createElement("h5");
        this.warning.innerHTML = "warning!<br>" +
            "this is an inefficient search!<br>" +
            "it's recommended that you keep items < 40 and delay < 100 or so.";
        this.warning.className = "hidden";

        this.base.appendChild(this.warning);

        // number of items to sort count and slider bar.
        let itemsLabel = document.createElement("h4");
        itemsLabel.innerHTML = "item count";
        this.base.appendChild(itemsLabel);

        let itemSliderRow = document.createElement("div");
        itemSliderRow.className = "sortControlRow";
        this.base.appendChild(itemSliderRow);

        let slider = new Slider(
            itemSliderRow,
            20,
            120,
            this.count,
            this.onItemSliderUpdate(),
        )

        // delay slider bar
        let delaySliderRow = document.createElement("div");
        delaySliderRow.className = "sortControlRow";
        this.base.appendChild(delaySliderRow);

        let delayLabel = document.createElement("h4");
        delayLabel.innerHTML = "render delay (milliseconds)";
        this.base.appendChild(delayLabel);

        let delaySlider = new Slider(
            delaySliderRow,
            1,
            500,
            this.delay,
            this.onDelaySliderUpdate(),
        )

        this.base.appendChild(delaySliderRow);

        // reload button, to apply changes.
        this.reloadButton = document.createElement("button");
        this.reloadButton.className = "reload";
        this.reloadButton.name = "reload"
        this.reloadButton.innerHTML = "Reload";

        this.base.appendChild(this.reloadButton);

        this.reloadButton.addEventListener("click", updateCallback(this));
    }

    public onDropDownUpdate(): (event: Event) => void {
        return (event: any) => {
            let sort = event.target.value;
            this.dropdownChoice = sort;

            if (Sort.slow_sorts.indexOf(sort) === -1) {
                this.warning.className = "hidden warning";
            } else {
                this.warning.className = "warning";
            }
        };
    }

    public onItemSliderUpdate(): (label: HTMLLabelElement) => (event: Event) => void {
        return (label: HTMLLabelElement) => {
            return (event: any) => {
                label.innerHTML = event.target.value;
                this.count = event.target.value;
            };
        };
    }

    public onDelaySliderUpdate(): (label: HTMLLabelElement) => (event: Event) => void {
        return (label: HTMLLabelElement) => {
            return (event: any) => {
                label.innerHTML = event.target.value;
                this.delay = event.target.value;
            };
        };
    }
}
