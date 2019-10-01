import { Constants} from "./constants";
import { DropDown } from "./dropdown";
import { RadioRow } from "./radiorow";
import { Slider } from "./slider";
import { StatBar } from "./statbar";

export class Controls {
    public base: HTMLElement;

    // sort type, item count, render delay, data type.
    public dropdownChoice: string;
    public count: number;
    public delay: number;
    public dataType: string;

    // number of swaps, from up on high.
    private swaps: number = 0;
    private swapCount: StatBar;

    // compares
    private compares: number = 0;
    private compareCount: StatBar;

    // and accesses.
    private accesses: number = 0;
    private accessCount: StatBar;

    private updateCallback: () => void;

    public warningAnswer: HTMLElement;

    constructor(
        base: HTMLElement,
        sorts: string[],
        count: number,
        delay: number,
        dataType: string,
        updateCallback: (controls: Controls) => () => void,
    ) {
        this.base = base;
        this.dropdownChoice = sorts[0];
        this.count = count;
        this.delay = delay;
        this.dataType = dataType;

        // callback used for updates.
        this.updateCallback = updateCallback(this);

        // sort choice dropdown and label
        this.base.appendChild(
            new DropDown(
                "sorting algorithm",
                sorts,
                this.onDropDownUpdate(),
            ).element
        );

        // warning label about slow sorts.
        let warning = this.createRow("warningBox");

        let warningQuestion = document.createElement("h4");
        warningQuestion.innerHTML = "inefficient sort?";

        this.warningAnswer = document.createElement("p");
        let defaultValue = Constants.slow_sorts.indexOf(this.dropdownChoice) === -1;
        this.warningAnswer.innerHTML = `${defaultValue ? "no" : "yes"}`;

        warning.appendChild(warningQuestion);
        warning.appendChild(this.warningAnswer);

        this.base.appendChild(warning);

        this.base.appendChild(
            new RadioRow(
                "data type",
                Constants.supported_data_types,
                Constants.RANDOM,
                this.onRadioRowUpdate(),
            ).element
        );

        // item slider bar
        this.base.appendChild(new Slider(
            "item count",
            20,
            120,
            this.count,
            this.onItemSliderUpdate(),
        ).element);

        // delay slider bar
        this.base.appendChild(new Slider(
            "render delay (ms)",
            1,
            500,
            this.delay,
            this.onDelaySliderUpdate(),
        ).element);

        // color swatches and counts of array actions.
        let statsContainer = this.createRow("statsContainer");

        // we need to access the counts later,
        // so those alone become class elements.

        // swaps!
        this.swapCount = new StatBar(
            statsContainer,
            Constants.SWAP_COLOR,
            "swaps",
            this.swaps,
        );

        // compares!
        this.compareCount = new StatBar(
            statsContainer,
            Constants.COMPARE_COLOR,
            "compares",
            this.compares,
        );

        // accesses!
        this.accessCount = new StatBar(
            statsContainer,
            Constants.ACCESS_COLOR,
            "accesses/assigns",
            this.accesses,
        );
    }

    public createRow(className: string="sortControlRow"): HTMLElement {
        let row = document.createElement("div");
        row.className = className;
        this.base.appendChild(row);
        return row;
    }

    // callbacks for dropdowns.
    public onDropDownUpdate(): (event: Event) => void {
        return (event: any) => {
            let sort = event.target.value;
            this.dropdownChoice = sort;

            if (Constants.slow_sorts.indexOf(sort) === -1) {
                this.warningAnswer.innerHTML = "no";
            } else {
                this.warningAnswer.innerHTML = "yes";
            }

            this.updateCallback();
        };
    }

    // callbacks for sliders.
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


    public onRadioRowUpdate(): (value: string) => () => void {
        return (value: string) => {
            return () => {
                this.dataType = value;
                this.updateCallback();
            };
        };
    }

    // methods to update swaps/compares/accesses.
    public updateSwapCount(): void {
        this.swaps += 1;
        this.swapCount.setValue(this.swaps);
    }

    public updateCompareCount(): void {
        this.compares += 1;
        this.compareCount.setValue(this.compares);
    }

    public updateAccessCount(): void {
        this.accesses += 1;
        this.accessCount.setValue(this.accesses);
    }

    // reset all counters.
    public resetCounters(): void {
        this.swaps = 0;
        this.swapCount.setValue(this.swaps);

        this.compares = 0;
        this.compareCount.setValue(this.compares);

        this.accesses = 0;
        this.accessCount.setValue(this.accesses);
    }
}
