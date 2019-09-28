const NORMAL_COLOR: string = "#80BFFF";
const SWAP_COLOR: string = "#DE2C2C";
const INDEX_COLOR: string = "#24782E";
const COMPARE_COLOR: string = "#143A42";

export class SortData {
    public ctx: CanvasRenderingContext2D;

    public height: number;
    public width: number;

    constructor() { }
}

class Bar {
    value: number;
    color: string;

    constructor(value: number, color: string) {
        this.value = value;
        this.color = color;
    }
}

export class SortStepper {
    public data: SortData;

    public lambda_q: (() => void)[] = [];

    public items: Bar[] = [];
    public untouched_items: Bar[] = [];
    public count: number = 20;

    private line_color: string = "#0E151C";
    private fill_color: string = NORMAL_COLOR;

    constructor(data: SortData) {
        this.data = data;

        let high_cap = Math.floor(this.data.height * 0.90);
        let low_cap = Math.floor(this.data.height * 0.10);

        for (let i = 0; i < this.count; i++) {
            let value = Math.floor(Math.random() * (high_cap-low_cap) + low_cap);
            this.items.push(
                new Bar(value, this.fill_color),
            );

            // store a copy of every item, so we can play actions back later.
            this.untouched_items.push(
                new Bar(value, this.fill_color),
            );
        }
    }

    public render(): void {
        this.data.ctx.clearRect(0, 0, this.data.width, this.data.height);
        let bar_width = this.data.width / (this.count);
        let x_pos = 0;
        for (let item of this.items) {
            this.data.ctx.beginPath();
            this.data.ctx.strokeStyle = this.line_color;
            this.data.ctx.lineWidth = 3;
            this.data.ctx.fillStyle = item.color;
            this.data.ctx.rect(x_pos, item.value, bar_width, this.data.height-item.value);
            this.data.ctx.stroke();
            this.data.ctx.fill();
            x_pos += bar_width;
        }

        let func: () => void = this.lambda_q.shift();
        if (func) {
            func();
        }
    }

    // compare elements.
    // return pos if first > second
    //        0 if first == second
    //        neg if first < second
    public compare(first: number, second: number): number {
        this.lambda_q.push(
            () => {
                this.items[first].color = COMPARE_COLOR;
                this.items[second].color = COMPARE_COLOR;
            }
        );
        this.lambda_q.push(
            () => {
                this.items[first].color = NORMAL_COLOR;
                this.items[second].color = NORMAL_COLOR;
            }
        );

        return this.items[first].value - this.items[second].value;
    }

    // access element and show this happened.
    public access(index: number): number {
        this.lambda_q.push(
            () => {
                this.items[index].color = INDEX_COLOR;
            }
        );
        this.lambda_q.push(
            () => {
                this.items[index].color = NORMAL_COLOR;
            }
        );

        return this.items[index].value;
    }

    // swap two elements with a color change.
    public swap(first: number, second: number): void {
        if (first < 0 || first >= this.items.length ||
                second < 0 || second >= this.items.length) {
            return;
        }

        if (first == second) {
            return;
        }

        // change colors, perform swap, change colors back.
        this.lambda_q.push(
            () => {
                this.items[first].color = SWAP_COLOR;
                this.items[second].color = SWAP_COLOR;
            }
        );
        this.lambda_q.push(
            () => {
                [this.items[first], this.items[second]] = [this.items[second], this.items[first]];
            }
        );
        this.lambda_q.push(
            () => {
                this.items[second].color = NORMAL_COLOR;
                this.items[first].color = NORMAL_COLOR;
            }
        );

        [this.items[first], this.items[second]] = [this.items[second], this.items[first]];
    }

    public reset_items() {
        this.items = [];
        for (let item of this.untouched_items) {
            this.items.push(
                new Bar(item.value, item.color)
            );
        }
    }
}
