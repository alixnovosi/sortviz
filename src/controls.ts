import { Constants} from "./constants";
import { DropDown } from "./dropdown";
import { Slider } from "./slider";

export class Controls {
    public base: HTMLElement;

    // sort type, item count, render delay.
    public dropdownChoice: string;
    public count: number;
    public delay: number;

    // number of swaps, from up on high.
    private swaps: number = 0;
    private swapCount: HTMLElement;

    // compares
    private compares: number = 0;
    private compareCount: HTMLElement;

    // and accesses.
    private accesses: number = 0;
    private accessCount: HTMLElement;

    private updateCallback: () => void;

    public warning: HTMLElement;

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

        let dropdownRow = this.createRow();

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
            "this is an inefficient sort!<br>" +
            "it's recommended that you keep items < 40 and delay < 100 or so.";
        this.warning.className = "hidden";

        this.base.appendChild(this.warning);

        // number of items to sort count and slider bar.
        let itemsLabel = document.createElement("h4");
        itemsLabel.innerHTML = "item count";
        this.base.appendChild(itemsLabel);

        let itemSliderRow = this.createRow();

        let slider = new Slider(
            itemSliderRow,
            20,
            120,
            this.count,
            this.onItemSliderUpdate(),
        )

        // delay slider bar
        let delayLabel = document.createElement("h4");
        delayLabel.innerHTML = "render delay (ms)";
        this.base.appendChild(delayLabel);

        let delaySliderRow = this.createRow();

        let delaySlider = new Slider(
            delaySliderRow,
            1,
            500,
            this.delay,
            this.onDelaySliderUpdate(),
        )


        // color swatches and counts of array actions.
        let statsContainer = this.createRow("statsContainer");

        // swaps!
        let swapSwatch = document.createElement("div");
        swapSwatch.style.backgroundColor = Constants.SWAP_COLOR;
        statsContainer.appendChild(swapSwatch);

        let swapSwatchName = document.createElement("h5");
        swapSwatchName.innerHTML = "swaps";
        statsContainer.appendChild(swapSwatchName);

        // we need to access this directly later.
        this.swapCount = document.createElement("h5");
        this.swapCount.innerHTML = `${this.swaps}`;
        statsContainer.appendChild(this.swapCount);

        // compares!
        let compareSwatch = document.createElement("div");
        compareSwatch.style.backgroundColor = Constants.COMPARE_COLOR;
        statsContainer.appendChild(compareSwatch);

        let compareSwatchName = document.createElement("h5");
        compareSwatchName.innerHTML = "compares";
        statsContainer.appendChild(compareSwatchName);

        this.compareCount = document.createElement("h5");
        this.compareCount.innerHTML = `${this.compares}`;
        statsContainer.appendChild(this.compareCount);

        // accesses!
        let accessSwatch = document.createElement("div");
        accessSwatch.style.backgroundColor = Constants.ACCESS_COLOR;
        statsContainer.appendChild(accessSwatch);

        let accessSwatchName = document.createElement("h5");
        accessSwatchName.innerHTML = "accesses";
        statsContainer.appendChild(accessSwatchName);

        this.accessCount = document.createElement("h5");
        this.accessCount.innerHTML = `${this.accesses}`;
        statsContainer.appendChild(this.accessCount);

        // callback used for updates.
        this.updateCallback = updateCallback(this);
    }

    public createRow(className: string="sortControlRow"): HTMLElement {
        let row = document.createElement("div");
        row.className = className;
        this.base.appendChild(row);
        return row;
    }

    public onDropDownUpdate(): (event: Event) => void {
        return (event: any) => {
            let sort = event.target.value;
            this.dropdownChoice = sort;

            if (Constants.slow_sorts.indexOf(sort) === -1) {
                this.warning.className = "hidden warning";
            } else {
                this.warning.className = "warning";
            }

            this.updateCallback();
        };
    }

    public onItemSliderUpdate(): (label: HTMLLabelElement) => (event: Event) => void {
        return (label: HTMLLabelElement) => {
            return (event: any) => {
                label.innerHTML = event.target.value;
                this.count = event.target.value;
                this.updateCallback();
            };
        };
    }

    public onDelaySliderUpdate(): (label: HTMLLabelElement) => (event: Event) => void {
        return (label: HTMLLabelElement) => {
            return (event: any) => {
                label.innerHTML = event.target.value;
                this.delay = event.target.value;
                this.updateCallback();
            };
        };
    }

    // methods to update swaps/compares/accesses.
    public updateSwapCount(): void {
        this.swaps += 1;
        this.swapCount.innerHTML = `${this.swaps}`;
    }

    public updateCompareCount(): void {
        this.compares += 1;
        this.compareCount.innerHTML = `${this.compares}`;
    }

    public updateAccessCount(): void {
        this.accesses += 1;
        this.accessCount.innerHTML = `${this.accesses}`;
    }

    // reset all counters.
    public resetCounters(): void {
        this.swaps = 0;
        this.swapCount.innerHTML = `${this.swaps}`;

        this.compares = 0;
        this.compareCount.innerHTML = `${this.compares}`;

        this.accesses = 0;
        this.accessCount.innerHTML = `${this.accesses}`;
    }
}
