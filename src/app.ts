import { SortData, SortStepper } from "./sortstepper";

import "./styles/main.scss";

class App {
    private base: HTMLElement;

    // primary canvas.
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private height: number = 900;
    private width: number = 1600;

    private bgColor: string = "#CCCCFF";
    private lineColor: string = "#111122";
    private highlightColor: string = "#EFEFFF";

    public sort_stepper: SortStepper;

    constructor() {
        this.base = <HTMLElement>document.getElementById("app");

        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");

        this.base.appendChild(this.canvas);

        this.sort_stepper = new SortStepper(
            {
                ...new SortData(),
                width: this.canvas.width,
                height: this.canvas.height,
                ctx: this.ctx,
            },
        );
    }

    private gameLoop(): void {
        this.render();

        setTimeout(this.bindRequestAnimationFrame(), 500);
    }

    private bindRequestAnimationFrame(): () => void {
        return () => {
            requestAnimationFrame(this.gameLoop.bind(this));
        };
    }

    public setup(): void {
        this.initCanvas();
        this.gameLoop();
    }

    private initCanvas(): void {
    }

    private render(): void {
        this.sort_stepper.render();
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.onload = () => {
    let app = new App();

    app.setup();
}
