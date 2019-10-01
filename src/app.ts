import { Controls } from "./controls";
import { Constants } from "./constants";
import { Sort } from "./sorts";
import { SortData, SortStepper } from "./sortstepper";

import "./styles/main.scss";

class App {
    private base: HTMLElement;

    private controls: Controls;

    // primary canvas.
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private height: number = 1200;
    private width: number = 1600;

    // store here so we can pass to controls and sortstepper on initialization.
    private count: number = 100;
    private delay: number = 50;
    private dataType: string = Constants.RANDOM;

    // to store whether we need to reset the board/actions.
    private reset: boolean = true;

    private interval_id: any;

    private bgColor: string = "#CCCCFF";
    private lineColor: string = "#111122";
    private highlightColor: string = "#EFEFFF";

    public sort_stepper: SortStepper;
    public sort: Sort;
    public sort_type: string;

    constructor() {
        this.base = <HTMLElement>document.getElementById("app");

        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");

        this.base.appendChild(this.canvas);

        let div = <HTMLElement>document.createElement("div");
        div.className = "sortControlsBox";
        this.base.appendChild(div);
        this.controls = new Controls(
            div,
            Constants.supported_sorts,
            this.count,
            this.delay,
            this.dataType,
            this.onReload(),
        )

        this.sort_type = Constants.QUICKSORT;
    }

    private gameLoop(): void {
        clearInterval(this.interval_id);

        this.interval_id = setInterval(
            () => this.render(),
            this.delay,
        );
    }

    public setup(): void {
        if (this.reset) {
            this.sort_stepper = new SortStepper(
                {
                    ...new SortData(),
                    width: this.canvas.width,
                    height: this.canvas.height,
                    ctx: this.ctx,
                    count: this.count,
                    data_type: this.dataType,

                    swapCallback: this.swapCallback(),
                    compareCallback: this.compareCallback(),
                    accessCallback: this.accessCallback(),
                },
            );

            this.sort = new Sort(this.sort_type, this.sort_stepper);
            this.sort.run();
            this.sort_stepper.reset_items();

            this.controls.resetCounters();
        }

        this.gameLoop();
    }

    private render(): void {
        let res = this.sort_stepper.render();

        if (!res) {
            clearInterval(this.interval_id);
        }
    }

    private onReload(): (controls: Controls) => () => void {
        return (controls: Controls) => {
            return () => {
                let oldsort = this.sort_type;
                let oldcount = this.count;
                let olddelay = this.delay;
                let olddatatype = this.dataType;

                this.sort_type = controls.dropdownChoice;
                this.count = controls.count;
                this.delay = controls.delay;
                this.dataType = controls.dataType;

                this.reset = false;
                if (oldsort !== this.sort_type ||
                    oldcount !== this.count ||
                    olddatatype !== this.dataType) {
                    this.reset = true;
                }

                this.setup();
            };
        };
    }

    private swapCallback(): () => void {
        return () => {
            this.controls.updateSwapCount();
        };
    }

    private compareCallback(): () => void {
        return () => {
            this.controls.updateCompareCount();
        };
    }

    private accessCallback(): () => void {
        return () => {
            this.controls.updateAccessCount();
        };
    }
}

window.onload = () => {
    let app = new App();

    app.setup();
}
