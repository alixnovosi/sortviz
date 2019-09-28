import { SortStepper } from "./sortstepper";

export class Sort {
    public static readonly QUICKSORT = "QUICKSORT";
    public static readonly HEAPSORT = "HEAPSORT";

    private sort_type: string;

    private stepper: SortStepper;

    private static supported_sorts: string[] = [Sort.QUICKSORT];

    constructor(sort_type: string, stepper: SortStepper) {
        this.sort_type = sort_type;
        this.stepper = stepper;
    }

    public run(): void {
        if (this.sort_type == Sort.QUICKSORT) {
            this.quicksort();
        } else if (this.sort_type == Sort.HEAPSORT) {
            this.heapsort();
        }
    }

    private quicksort(): void {
        let partition: (stepper: SortStepper, start: number, end: number) =>
            number = (stepper: SortStepper, start: number, end: number) => {
                let follower = start;
                let leader = start;

                while (leader < end) {
                    if (stepper.compare(leader, end) >= 0) {
                        stepper.swap(follower, leader);
                        follower += 1;
                    }

                    leader += 1;
                }

                stepper.swap(follower, end);

                return follower;
        };

        let ip_quicksort: (stepper: SortStepper, start: number, end: number) =>
            void = (stepper: SortStepper, start: number, end: number) => {
                if (start >= end) {
                    return;
                }

                let rand_pivot_index = Math.floor((Math.random() * (end-start+1)) + start);

                stepper.swap(rand_pivot_index, end);

                let pivot = partition(stepper, start, end);
                ip_quicksort(stepper, start, pivot-1);
                ip_quicksort(stepper, pivot+1, end);
        };

        return ip_quicksort(this.stepper, 0, this.stepper.items.length-1);
    }

    private heapsort(): void {
        class MaxHeap {
            public stepper: SortStepper;
            public count: number;

            constructor(stepper: SortStepper) {
                this.stepper = stepper;
                this.count = this.stepper.count;

                this.heapify();
            }

            private heapify() {
                let start = this.count-1;
                while (start >= 0) {
                    this.sift_down(start)
                    start -= 1;
                }
            }

            // swap item out of array, update count, sift item at 0 into correct position.
            public delete_max() {
                this.stepper.swap(0, this.count-1);
                this.count -= 1;

                this.sift_down(0);
            }

            // swap item at index into correct heap position.
            public sift_down(index: number) {
                let root: number = index;

                let first_index: number = (root*2) + 1;
                console.log(`root ${root} first ${first_index}`);
                while (first_index < this.count-1) {

                    let maxdex: number = first_index;
                    let second_index: number = (root*2) + 2;
                    console.log(`second ${second_index}`);

                    if (second_index < this.count-1) {
                        console.log(`comparing 2nd ${second_index} and first ${first_index}`);

                        let res = this.stepper.compare(second_index, first_index);
                        console.log(`got res ${res}`);
                        if (res < 0) {
                            maxdex = second_index;
                        }
                    }

                    if (this.stepper.compare(root, maxdex) > 0) {
                        this.stepper.swap(root, maxdex);
                        root = maxdex;

                        first_index = Math.floor((root*2) + 1);
                    // nothing to do.
                    } else {
                        return;
                    }
                }
                console.log(`sifted down ${index}`);
            }
        }

        let heap = new MaxHeap(this.stepper);

        while (heap.count > 1) {
            heap.delete_max();
        }
    }
}
