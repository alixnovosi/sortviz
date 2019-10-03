import { Constants } from "./constants";

export class SortData {
    public ctx: CanvasRenderingContext2D;

    public height: number;
    public width: number;

    // count of items.
    public count: number;

    // whether data is random, or sorted in one of several ways.
    public data_type: string;

    // callbacks to update stats in controls box.
    public swapCallback: () => void;
    public compareCallback: () => void;
    public accessCallback: () => void;

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

    private line_color: string = "#0E151C";
    private fill_color: string = Constants.NORMAL_COLOR;

    constructor(data: SortData) {
        this.data = data;
        let bar_spacing = this.data.height / (this.data.count);

        // generate data.
        let raw_data: number[] = [];
        let val = bar_spacing;
        for (let i = 0; i < this.data.count; i++) {
            raw_data.push(val);
            val += bar_spacing;
        }

        // arrange for whatever data type we're doing.
        let nums: number[] = [];
        if (this.data.data_type === Constants.SORTED) {
            nums = raw_data;

        } else if (this.data.data_type === Constants.NEARLY_SORTED) {
            nums = raw_data;
            // call 90% sorted nearly sorted.
            let brokenum = Math.floor(nums.length * 0.10);
            for (let i = 0; i < brokenum; i++) {
                let j = Math.floor(Math.random() * nums.length);
                let k = Math.floor(Math.random() * nums.length);

                [nums[j], nums[k]] = [nums[k], nums[j]];
            }

        } else if (this.data.data_type === Constants.RANDOM) {
            for (let i = 0; i < this.data.count; i++) {
                let index = Math.floor(Math.random() * raw_data.length);
                let value = raw_data.splice(index, 1)[0];
                nums.push(value);
            }

        } else if (this.data.data_type === Constants.REVERSED) {
            nums = raw_data;
            for (let i=0; i < Math.floor(raw_data.length/2); i++) {
                let rev_i = nums.length-1-i;
                [nums[i], nums[rev_i]] = [nums[rev_i], nums[i]];
            }

        // default.
        } else {
            nums = raw_data;
        }

        for (let i = 0; i < this.data.count; i++) {
            this.items.push(
                new Bar(nums[i], this.fill_color),
            );

            // store a copy of every item, so we can play actions back later.
            this.untouched_items.push(
                new Bar(nums[i], this.fill_color),
            );
        }
    }

    public render(): boolean {
        this.data.ctx.clearRect(0, 0, this.data.width, this.data.height);
        let bar_width = this.data.width / (this.data.count);
        let x_pos = 0;
        for (let item of this.items) {
            this.data.ctx.beginPath();
            this.data.ctx.strokeStyle = this.line_color;
            this.data.ctx.lineWidth = 3;
            this.data.ctx.fillStyle = item.color;
            this.data.ctx.rect(x_pos, this.data.height-item.value, bar_width, item.value);
            this.data.ctx.stroke();
            this.data.ctx.fill();
            x_pos += bar_width;
        }

        let func: () => void = this.lambda_q.shift();
        if (func) {
            func();
            return true;
        }

        return false;
    }

    // compare elements.
    // return pos if first > second
    //        0 if first == second
    //        neg if first < second
    public compare(first: number, second: number): number {
        this.lambda_q.push(
            () => {
                this.items[first].color = Constants.COMPARE_COLOR;
                this.items[second].color = Constants.COMPARE_COLOR;
            }
        );
        this.lambda_q.push(
            () => {
                this.items[first].color = Constants.NORMAL_COLOR;
                this.items[second].color = Constants.NORMAL_COLOR;
                this.data.compareCallback();
            }
        );

        return this.items[first].value - this.items[second].value;
    }

    // access element and show this happened.
    public access(index: number): number {
        this.lambda_q.push(
            () => {
                this.items[index].color = Constants.ACCESS_COLOR;
            }
        );
        this.lambda_q.push(
            () => {
                this.items[index].color = Constants.NORMAL_COLOR;
                this.data.accessCallback();
            }
        );

        return this.items[index].value;
    }

    // set element at index.
    // only shellsort uses this so far, so we duplicate access color.
    public assign(index: number, value: number): void {
        this.lambda_q.push(
            () => {
                this.items[index].color = Constants.ACCESS_COLOR;
            }
        );
        this.lambda_q.push(
            () => {
                this.items[index].value = value;
            }
        );
        this.lambda_q.push(
            () => {
                this.items[index].color = Constants.NORMAL_COLOR;
                this.data.accessCallback();
            }
        );

        this.items[index].value = value;
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
                this.items[first].color = Constants.SWAP_COLOR;
                this.items[second].color = Constants.SWAP_COLOR;
            }
        );
        this.lambda_q.push(
            () => {
                [this.items[first], this.items[second]] = [this.items[second], this.items[first]];
            }
        );
        this.lambda_q.push(
            () => {
                this.items[second].color = Constants.NORMAL_COLOR;
                this.items[first].color = Constants.NORMAL_COLOR;
                this.data.swapCallback();
            }
        );

        [this.items[first], this.items[second]] = [this.items[second], this.items[first]];
    }

    // swap two blocks of elements with a color change.
    public swap_block(first_list: number[], second_list: number[]): void {
        if (first_list.length !== second_list.length) {
            return;
        }
        let actual_swap = () => {
            for (let i = 0; i < first_list.length; i++) {
                let first = first_list[i];
                let second = second_list[i];
                this.items[second].color = Constants.NORMAL_COLOR;
                this.items[first].color = Constants.NORMAL_COLOR;
                this.data.swapCallback();
            }
        };

        // change colors, perform swap, change colors back.
        this.lambda_q.push(
            () => {
                for (let i = 0; i < first_list.length; i++) {
                    let first = first_list[i];
                    let second = second_list[i];
                    this.items[first].color = Constants.SWAP_COLOR;
                    this.items[second].color = Constants.SWAP_COLOR;
                }
            }
        );
        this.lambda_q.push(
            () => {
                for (let i = 0; i < first_list.length; i++) {
                    let first = first_list[i];
                    let second = second_list[i];
                    [this.items[first], this.items[second]] = [
                        this.items[second],
                        this.items[first]
                    ];
                }
            }
        );
        this.lambda_q.push(
            actual_swap
        );

        actual_swap();
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
