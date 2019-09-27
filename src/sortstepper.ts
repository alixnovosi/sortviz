const NORMAL_COLOR: string = "#80BFFF";
const SWAP_COLOR: string = "#DE2C2C";
const INDEX_COLOR: string = "#24782E";

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

    private lambda_q: (() => void)[] = [];

    public items: Bar[] = [];
    public count: number = 120;

    private line_color: string = "#0E151C";
    private fill_color: string = NORMAL_COLOR;

    constructor(data: SortData) {
        this.data = data;

        for (let i = 0; i < this.count; i++) {
            this.items.push(
                new Bar(Math.floor(Math.random() * this.data.height), this.fill_color),
            );
        }

        for (let i = 0; i < 10; i++) {
            let first = Math.floor(Math.random() * this.items.length);
            let second = Math.floor(Math.random() * this.items.length);

            this.swap(first, second);
        }
        for (let i = 0; i < 10; i++) {
            let first = Math.floor(Math.random() * this.items.length);

            this.access(first);
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

    // access element and show this happened.
    public async access(index: number): Promise<void> {
        if (index < 0 || index >= this.items.length) {
            return;
        }

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
    }

    // swap two elements with a color change.
    public async swap(first: number, second: number): Promise<void> {
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

        while (this.lambda_q.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}
