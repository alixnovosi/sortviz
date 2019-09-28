import { Constants } from "./constants";
import { SortStepper } from "./sortstepper";

export class Sort {
    public sort_type: string;

    private stepper: SortStepper;

    constructor(sort_type: string, stepper: SortStepper) {
        this.sort_type = sort_type;
        this.stepper = stepper;
    }

    public run(): void {
        if (Constants.supported_sorts.indexOf(this.sort_type) === -1) {
            return;
        }

        // TODO find a way to do this automatically off the supported sorts list.
        if (this.sort_type == Constants.QUICKSORT) {
            this.quicksort();
        } else if (this.sort_type == Constants.HEAPSORT) {
            this.heapsort();
        } else if (this.sort_type == Constants.STOOGESORT) {
            this.stoogesort();
        } else if (this.sort_type == Constants.SELECTION_SORT) {
            this.selection_sort();
        } else if (this.sort_type == Constants.INSERTION_SORT) {
            this.insertion_sort();
        } else if (this.sort_type == Constants.BUBBLE_SORT) {
            this.bubble_sort();
        } else if (this.sort_type == Constants.COCKTAIL_SHAKER_SORT) {
            this.cocktail_shaker_sort();
        }
    }

    // helpers!
    private partition(start: number, end: number) {
        let follower = start;
        let leader = start;

        while (leader < end) {
            if (this.stepper.compare(leader, end) < 0) {
                this.stepper.swap(follower, leader);
                follower += 1;
            }

            leader += 1;
        }

        this.stepper.swap(follower, end);

        return follower;
    };

    // sort methods!!!
    private quicksort(): void {
        let ip_quicksort: (stepper: SortStepper, start: number, end: number) =>
            void = (stepper: SortStepper, start: number, end: number) => {
                if (start >= end) {
                    return;
                }

                let rand_pivot_index = Math.floor((Math.random() * (end-start+1)) + start);

                stepper.swap(rand_pivot_index, end);

                let pivot = this.partition(start, end);
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
                let start = Math.floor((this.count-1-1) / 2);
                while (start >= 0) {
                    this.sift_down(start, this.count-1)
                    start -= 1;
                }
            }

            // swap item at index into correct heap position.
            public sift_down(start: number, end: number) {
                let root = start;

                let first_index = (root*2) + 1;
                while (first_index <= end) {

                    let maxdex: number = first_index;
                    let second_index: number = (root*2) + 2;
                    if (second_index <= end) {

                        if (this.stepper.compare(second_index, first_index) > 0) {
                            maxdex = second_index;
                        }
                    }

                    if (this.stepper.compare(root, maxdex) < 0) {
                        this.stepper.swap(root, maxdex);
                        root = maxdex;

                        first_index = (root*2) + 1;

                    // nothing to do.
                    } else {
                        return;
                    }
                }
            }
        }

        let heap = new MaxHeap(this.stepper);

        let end = heap.count-1;
        while (end > 0) {
            this.stepper.swap(end, 0);
            end -= 1;
            heap.sift_down(0, end);
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

    // nearly direct from https://en.wikipedia.org/wiki/Insertion_sort
    private insertion_sort() {
        let i = 1;
        while (i < this.stepper.data.count) {
            let j = i;
            while (j > 0 && this.stepper.compare(j-1, j) > 0) {
                this.stepper.swap(j, j-1);
                j -= 1;
            }

            i += 1
        }
    }

    // the most optimized bubblesort off https://en.wikipedia.org/wiki/Bubble_sort
    private bubble_sort() {
        let n = this.stepper.data.count;
        let newn = 0;
        do {
            newn = 0;

            for (let i = 1; i < n; i++) {
                if (this.stepper.compare(i-1, i) > 0) {
                    this.stepper.swap(i-1, i);
                    newn = i;
                }
            }
            n = newn;

        } while (n > 1);
    }

    // https://en.wikipedia.org/wiki/Cocktail_shaker_sort
    // and having to translate matlab loops into javascript.
    private cocktail_shaker_sort() {
        let begin = 0;
        let end = this.stepper.data.count-1;
        while (begin <= end) {
            let new_begin = end;
            let new_end = begin;

            // forward pass.
            for (let i = begin; i < end; i++) {
                if (this.stepper.compare(i, i+1) > 0) {
                    this.stepper.swap(i, i+1);
                    new_end = i;
                }
            }

            // decrease end because after that point, the order is correct.
            end = new_end;

            // rev pass.
            for (let i = end; i >= begin; i--) {
                if (this.stepper.compare(i, i+1) > 0) {
                    this.stepper.swap(i, i+1);
                    new_begin = i;
                }
            }

            // increase begin because we know things are sorted before that.
            begin = new_begin;
        }
    }
}
