import { Constants } from "./constants";
import { SortStepper } from "./sortstepper";

// helper class for heapsort and block merge sort.
class MaxHeap {
    public stepper: SortStepper;

    public start: number;
    public end: number;

    constructor(stepper: SortStepper, start: number, end: number) {
        this.stepper = stepper;

        this.start = start;
        this.end = end;

        this.heapify();
    }

    private get_parent(index: number): number {
        return Math.floor((index-1) / 2) + this.start;
    }

    private get_left_child(index: number): number {
        return Math.floor(2*index + 1) - this.start;
    }

    private get_right_child(index: number): number {
        return Math.floor(2*index + 2) - this.start;
    }

    private heapify(): void {
        let start = this.get_parent(this.end);
        while (start >= this.start) {
            this.sift_down(start)
            start -= 1;
        }
    }

    // swap max to end, decrease end pointer, and sift to restore balance.
    public swap_max_out(): void {
        this.stepper.swap(this.start, this.end);
        this.end -= 1;
        this.sift_down(this.start);
    }

    // repair the heap starting at "start".
    // more and more from https://en.wikipedia.org/wiki/Heapsort as I kept fighting bugs.
    public sift_down(start: number): void {
        let root = start;

        while (this.get_left_child(root) <= this.end) {
            let child = this.get_left_child(root);
            let swap = root; // keep track of child to swap with - may end up being root.

            // should we swap with the left child?
            if (this.stepper.compare(swap, child) < 0) {
                swap = child;
            }

            // if there is a right child and it's bigger than left/the root, swap with that.
            if (child+1 <= this.end && this.stepper.compare(swap, child+1) < 0) {
                swap = child+1;
            }

            // nothing to do.
            if (swap === root) {
                return;
            }

            this.stepper.swap(root, swap);
            root = swap;
        }
    }
}

export class Sort {
    public sort_type: string;

    private stepper: SortStepper;

    private alg: (start: number, end: number) => void;

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
            this.alg = this.quicksort
        } else if (this.sort_type == Constants.HEAPSORT) {
            this.alg = this.heapsort;
        } else if (this.sort_type == Constants.STOOGESORT) {
            this.alg = this.stoogesort;
        } else if (this.sort_type == Constants.SELECTION_SORT) {
            this.alg = this.selection_sort;
        } else if (this.sort_type == Constants.INSERTION_SORT) {
            this.alg = this.insertion_sort;
        } else if (this.sort_type == Constants.BUBBLE_SORT) {
            this.alg = this.bubble_sort;
        } else if (this.sort_type == Constants.COCKTAIL_SHAKER_SORT) {
            this.alg = this.cocktail_shaker_sort;
        } else if (this.sort_type == Constants.COMB_SORT) {
            this.alg = this.comb_sort;
        } else if (this.sort_type == Constants.SHELLSORT) {
            this.alg = this.shellsort;
        }

        // these sorts are all designed so they optionally can work on subsections
        // of the array.
        // so, make sure they sort the whole thing.
        this.alg(0, this.stepper.data.count-1);
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
    private quicksort(start: number, end: number): void {
        if (start >= end) {
            return;
        }

        let rand_pivot_index = Math.floor((Math.random() * (end-start+1)) + start);

        this.stepper.swap(rand_pivot_index, end);

        let pivot = this.partition(start, end);
        this.quicksort(start, pivot-1);
        this.quicksort(pivot+1, end);
    }

    private heapsort(start: number, end: number): void {
        let heap = new MaxHeap(this.stepper, start, end);

        while (heap.end != heap.start) {
            heap.swap_max_out();
        }
    }

    private stoogesort(start: number, end: number): void {
        // if the first element is greater than the last element, swap them.
        if (this.stepper.compare(start, end) > 0) {
            this.stepper.swap(start, end);
        }

        // only run for over two elements.
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

    private selection_sort(start: number, end: number) {
        let sorted_cutoff = start;

        while (sorted_cutoff <= end) {
            let sindex = sorted_cutoff;

            for (let i = sindex; i <= end; i++) {
                if (this.stepper.compare(sindex, i) > 0) {
                    sindex = i;
                }
            }

            this.stepper.swap(sindex, sorted_cutoff);
            sorted_cutoff += 1;
        }
    }

    // nearly direct from https://en.wikipedia.org/wiki/Insertion_sort
    private insertion_sort(start: number, end: number) {
        let i = start+1;
        while (i <= end) {
            let j = i;
            while (j > start && this.stepper.compare(j-1, j) > 0) {
                this.stepper.swap(j, j-1);
                j -= 1;
            }

            i += 1
        }
    }

    // the most optimized bubblesort off https://en.wikipedia.org/wiki/Bubble_sort
    private bubble_sort(start: number, end: number) {
        let n = end+1;
        let newn = start;
        do {
            newn = start;

            for (let i = start+1; i < n; i++) {
                if (this.stepper.compare(i-1, i) > 0) {
                    this.stepper.swap(i-1, i);
                    newn = i;
                }
            }
            n = newn;

        } while (n > start+1);
    }

    // https://en.wikipedia.org/wiki/Cocktail_shaker_sort
    // and having to translate matlab loops into javascript.
    private cocktail_shaker_sort(start: number, end: number) {
        while (start <= end) {
            let new_begin = end;
            let new_end = start;

            // forward pass.
            for (let i = start; i < end; i++) {
                if (this.stepper.compare(i, i+1) > 0) {
                    this.stepper.swap(i, i+1);
                    new_end = i;
                }
            }

            // decrease end because after that point, the order is correct.
            end = new_end;

            // rev pass.
            for (let i = end; i >= start; i--) {
                if (this.stepper.compare(i, i+1) > 0) {
                    this.stepper.swap(i, i+1);
                    new_begin = i;
                }
            }

            // increase begin because we know things are sorted before that.
            start = new_begin;
        }
    }

    // https://en.wikipedia.org/wiki/Comb_sort
    // one way to improve bubble sort.
    private comb_sort(start: number, end: number) {
        let len = end - start + 1;

        let shrink: number = 1.3;
        let sorted: boolean = false;

        let gap: number= Math.floor(len / shrink);

        while (!sorted) {
            // if we complete the pass at gap 1 without swaps,
            // we're done.
            if (gap <= 1) {
                gap = 1;
                sorted = true;
            }

            // comb once over array section.
            let i = start;
            while (i + gap <= end) {
                if (this.stepper.compare(i, i+gap) > 0) {
                    this.stepper.swap(i, i+gap);
                    sorted = false;
                }

                i += 1;
            }

            // update gap for next comb.
            gap = Math.floor(gap / shrink);
        }
    }

    // https://en.wikipedia.org/wiki/Shellsort
    // the computational complexity is amazing.
    private shellsort(start: number, end: number) {
        // start with largest gap and work down.
        let gaps = [701, 301, 132, 57, 23, 10, 4, 1];
        for (let gap of gaps) {

            // these all reference a as array because I adapted this from shellsort on wikipedia,
            // but they'll all really talk to this.stepper.

            // do gap insertion sort at this size.
            // the first gap elements a[start...gap-1] are already in gapped order.
            // keep adding one more element until the entire array is gap sorted.
            for (let i = gap+start; i <= end; i++) {

                // add a[i] to the elements that have been gap sorted.
                // save a[i] in temp and make a hole at position i.
                let temp: number = this.stepper.access(i);

                // shift earlier gap-sorted elements up until the correct location
                // for a[i] is found.
                let j = i;
                for ( ; j >= gap+start && this.stepper.access(j-gap) > temp; j-=gap) {
                    this.stepper.swap(j, j-gap);
                }

                // put temp (the original a[i]) in its correct location.
                this.stepper.assign(j, temp);
            }
        }
    }
}
