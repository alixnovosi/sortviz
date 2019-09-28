import { SortStepper } from "./sortstepper";

export class Sort {
    public static readonly QUICKSORT = "QUICKSORT";
    public static readonly HEAPSORT = "HEAPSORT";
    public static readonly STOOGESORT = "STOOGESORT";
    public static readonly SELECTION_SORT = "SELECTION_SORT";

    public sort_type: string;

    private stepper: SortStepper;

    public static supported_sorts: string[] = [
        Sort.QUICKSORT,
        Sort.HEAPSORT,
        Sort.STOOGESORT,
        Sort.SELECTION_SORT,
    ];

    // sorts we should give a warning on that they're inefficient.
    public static slow_sorts: string[] = [
        Sort.STOOGESORT,
    ];

    constructor(sort_type: string, stepper: SortStepper) {
        this.sort_type = sort_type;
        this.stepper = stepper;
    }

    public run(): void {
        if (Sort.supported_sorts.indexOf(this.sort_type) === -1) {
            return;
        }
        if (this.sort_type == Sort.QUICKSORT) {
            this.quicksort();
        } else if (this.sort_type == Sort.HEAPSORT) {
            this.heapsort();
        } else if (this.sort_type == Sort.STOOGESORT) {
            this.stoogesort();
        } else if (this.sort_type == Sort.SELECTION_SORT) {
            this.selection_sort();
        }
    }

    private quicksort(): void {
        let partition: (stepper: SortStepper, start: number, end: number) =>
            number = (stepper: SortStepper, start: number, end: number) => {
                let follower = start;
                let leader = start;

                while (leader < end) {
                    if (stepper.compare(leader, end) < 0) {
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
                this.count = this.stepper.data.count;

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
                while (first_index < this.count-1) {

                    let maxdex: number = first_index;
                    let second_index: number = (root*2) + 2;
                    if (second_index < this.count-1) {

                        if (this.stepper.compare(second_index, first_index) > 0) {
                            maxdex = second_index;
                        }
                    }

                    if (this.stepper.compare(root, maxdex) < 0) {
                        this.stepper.swap(root, maxdex);
                        root = maxdex;

                        first_index = Math.floor((root*2) + 1);

                    // nothing to do.
                    } else {
                        return;
                    }
                }
            }
        }

        let heap = new MaxHeap(this.stepper);

        while (heap.count > 0) {
            heap.delete_max();
        }
    }

    private stoogesort(start: number=0, end: number=this.stepper.data.count-1): void {
        // if the first element is greater than the last element, swap them.
        if (this.stepper.compare(start, end) > 0) {
            this.stepper.swap(start, end);
        }

        // return for less than 3 elements.
        if ((end-start+1) > 2) {

            // divide into thirds.
            // important to round down here,
            // so that the 2/3s chunks in the recursive calls round up.
            let div = Math.floor((end - start + 1) / 3);

            // sort the first two thirds,
            // then the last two thirds,
            // then the first two thirds again.
            this.stoogesort(start, end-div);
            this.stoogesort(start+div, end);
            this.stoogesort(start, end-div);
        }
    }

    private selection_sort() {
        let sorted_cutoff = 0;

        while (sorted_cutoff < this.stepper.data.count) {
            let sindex = sorted_cutoff;

            for (let i = sindex; i < this.stepper.data.count; i++) {
                if (this.stepper.compare(sindex, i) > 0) {
                    sindex = i;
                }
            }

            this.stepper.swap(sindex, sorted_cutoff);
            sorted_cutoff += 1;
        }
    }
}
