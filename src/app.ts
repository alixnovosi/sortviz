import { Controls } from "./controls";
import { SortData, SortStepper } from "./sortstepper";
import { Sort } from "./sorts";

import "./styles/main.scss";

class App {
    private base: HTMLElement;

    private controls: Controls;

    // primary canvas.
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private height: number = 900;
    private width: number = 1600;

    // store here so we can pass to controls and sortstepper on initialization.
    private count: number = 120;
    private delay: number = 10;

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
            [
                Sort.QUICKSORT,
                Sort.HEAPSORT,
                Sort.STOOGESORT,
            ],
            this.count,
            this.delay,
            this.onReload(),
        )

        this.sort_type = Sort.QUICKSORT;
    }

    private gameLoop(): void {
        clearInterval(this.interval_id);

        this.interval_id = setInterval(
            () => this.render(),
            this.delay,
        );
    }

    public setup(): void {
        this.sort_stepper = new SortStepper(
            {
                ...new SortData(),
                width: this.canvas.width,
                height: this.canvas.height,
                ctx: this.ctx,
                count: this.count,
            },
        );

        this.sort = new Sort(this.sort_type, this.sort_stepper);
        this.sort.run();
        this.sort_stepper.reset_items();

        this.gameLoop();
    }

    private render(): void {
        this.sort_stepper.render();
    }

    private onReload(): (controls: Controls) => () => void {
        return (controls: Controls) => {
            return () => {
                this.sort_type = controls.dropdownChoice;
                this.count = controls.count;
                this.delay = controls.delay;
                this.setup();
            };
        };
    }
}

window.onload = () => {
    let app = new App();

    app.setup();
}
