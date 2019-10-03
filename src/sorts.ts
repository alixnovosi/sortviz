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
        if (this.sort_type === Constants.QUICKSORT) {
            this.alg = this.quicksort;
        } else if (this.sort_type === Constants.HEAPSORT) {
            this.alg = this.heapsort;
        } else if (this.sort_type === Constants.STOOGESORT) {
            this.alg = this.stoogesort;
        } else if (this.sort_type === Constants.SELECTION_SORT) {
            this.alg = this.selection_sort;
        } else if (this.sort_type === Constants.INSERTION_SORT) {
            this.alg = this.insertion_sort;
        } else if (this.sort_type === Constants.BUBBLE_SORT) {
            this.alg = this.bubble_sort;
        } else if (this.sort_type === Constants.COCKTAIL_SHAKER_SORT) {
            this.alg = this.cocktail_shaker_sort;
        } else if (this.sort_type === Constants.COMB_SORT) {
            this.alg = this.comb_sort;
        } else if (this.sort_type === Constants.SHELLSORT) {
            this.alg = this.shellsort;
        } else if (this.sort_type === Constants.GNOME_SORT) {
            this.alg = this.gnomesort;
        } else if (this.sort_type === Constants.INTROSORT) {
            this.alg = this.introsort;
        } else if (this.sort_type === Constants.CYCLE_SORT) {
            this.alg = this.cycle_sort;
        } else if (this.sort_type === Constants.BLOCK_SORT) {
            this.alg = this.block_sort;
        } else if (this.sort_type === Constants.ODD_EVEN_SORT) {
            this.alg = this.odd_even_sort;
        }

        // these sorts are all designed so they optionally can work on subsections
        // of the array.
        // so, make sure they sort the whole thing.
        this.alg(0, this.stepper.data.count-1);
    }

    // randomly pick pivot between start and end (both inclusive).
    private rand_pivot(start: number, end: number): void {
        let mid = Math.floor(Math.random() * (end-start+1) + start);
        this.stepper.swap(mid, end);
    }

    // median-of-three pivot.
    private mo3_pivot(start: number, end: number): void {
        let mid = start + Math.floor((end-start)/2);
        if (this.stepper.compare(mid, start) < 0) {
            this.stepper.swap(start, mid);
        }
        if (this.stepper.compare(end, start) < 0) {
            this.stepper.swap(start, end);
        }
        if (this.stepper.compare(mid, end) < 0) {
            this.stepper.swap(mid, end);
        }
    }

    // helpers!
    // lomuto partition with random pivot choice.
    private partition_lomuto(start: number, end: number): number {
        this.mo3_pivot(start, end);

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

    private partition_hoare(start: number, end: number) {
        // hoare partition needs middle element, but needs it at the START.
        let pivot = start + Math.floor((end-start)/2);
        this.stepper.swap(pivot, start);

        let i = start-1;
        let j = end+1;
        while (true) {
            do {
                i++;
            } while (this.stepper.compare(i, start) < 0);

            do {
                j--;
            } while (this.stepper.compare(j, start) > 0);

            if (i >= j) {
                return j;
            }

            this.stepper.swap(i, j);
        }
    }

    // reverse array in-place
    private reverse(start, end): void {
        let i = start;
        let j = end;
        let mid = Math.floor((start+end)/2);
        while (i <= mid && j >= mid) {
            this.stepper.swap(i, j)
            i++;
            j--;
        }
    }

    // rotate elements in array left or right by some number of spaces.
    private rotate(start, end, amount) {
        let a = (end+1) - amount;
        this.reverse(start, start+amount)
        this.reverse(start+amount, end);
        this.reverse(start, end);
    }

    // floor value to next power of two.
    private floor_power_of_two(x: number): number {
        x = x | (x >> 1);
        x = x | (x >> 2);
        x = x | (x >> 4);
        x = x | (x >> 8);
        x = x | (x >> 16);
        x = x | (x >> 32);
        return x - (x >> 1);
    }

    // in-place merge of two lists.
    private merge(startA: number, endA: number, startB: number, endB: number): void {
        // invariant: A is in sorted order and B is in sorted order.
        // so if we break that, we need to fix it.

        // consider each element of A.
        for (let i = startA; i < endA+1; i++) {

            // compare to first element of B.
            if (this.stepper.compare(i, startB) > 0) {
                this.stepper.swap(i, startB);
                let first = startB;

                // move this new B[0] into its correct position.
                let k: number;
                for (k = startB+1; k < endB+1  && this.stepper.access(k) < first; k++) {
                    this.stepper.assign(k-1, this.stepper.access(k));
                }

                this.stepper.assign(k-1, first);
            }
        }
    }

    // // linear search for an element.
    // private lirch(start, end, value) {
    //     for (let i = start; i < end+1; i++) {
    //
    //     }
    //
    // }

    // sort methods!!!
    private quicksort(start: number, end: number, hoare: boolean=true): void {
        if (start < end) {
            if (hoare) {
                let p = this.partition_hoare(start, end);
                this.quicksort(start, p, hoare);
                this.quicksort(p+1, end, hoare);

            } else {
                let p = this.partition_lomuto(start, end);
                this.quicksort(start, p-1, hoare);
                this.quicksort(p+1, end, hoare);
            }
        }
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

    // https://en.wikipedia.org/wiki/Gnome_sort
    // similar to insertion sort, but not quite the same.
    private gnomesort(start: number, end: number) {
        let pos = start;
        while (pos <= end) {
            if (pos === start || this.stepper.compare(pos, pos-1) >= 0) {
                pos += 1;
            } else {
                this.stepper.swap(pos, pos-1);
                pos -= 1;
            }
        }
    }

    // https://en.wikipedia.org/wiki/Introsort
    // an efficient combo sort.
    private introsort(start: number, end: number, hoare: boolean=true) {
        let internal: (start: number, end: number, maxdepth: number, hoare: boolean) => void =
            (start: number, end: number, maxdepth: number, hoare: boolean) => {

            let n = end-start+1;
            if (n <= 1) {
                return; // base case

            } else if (maxdepth === 0) {
                this.heapsort(start, end);

            } else {
                if (hoare) {
                    let p = this.partition_hoare(start, end);
                    internal(start, p, maxdepth-1, hoare);
                    internal(p+1, end, maxdepth-1, hoare);

                } else {
                    let p = this.partition_lomuto(start, end);
                    internal(start, p-1, maxdepth-1, hoare);
                    internal(p+1, end, maxdepth-1,hoare);
                }
            }
        };

        let maxdepth = Math.floor(Math.log(end-start+1))*2;
        internal(start, end, maxdepth, hoare);
    }

    // https://en.wikipedia.org/wiki/Cycle_sort
    private cycle_sort(start: number, end: number) {

        // loop through array to find cycles to rotate.
        for (let cycle_start = start; cycle_start < end; cycle_start++) {
            let item = this.stepper.access(cycle_start);

            // find where to put the item.
            let pos = cycle_start;
            for (let i = cycle_start+1; i < end+1; i++) {
                if (this.stepper.access(i) < item) {
                    pos++;
                }
            }

            // if the item is already there, this is not a cycle.
            if (pos == cycle_start) {
                continue;
            }

            // otherwise, put the item right there, or after any duplicates.
            // if you don't do that last condition, you get infinite loops.
            while (item == this.stepper.access(pos)) {
                pos++;
            }
            let temp = this.stepper.access(pos);
            this.stepper.assign(pos, item);
            item = temp;

            // rotate the rest of the cycle.
            while (pos !== cycle_start) {
                // find where to put the item.
                pos = cycle_start;
                for (let i = cycle_start+1; i < end+1; i++) {
                    if (this.stepper.access(i) < item) {
                        pos++;
                    }
                }


                // put the item right there or after any duplicates, as before.
                while (item == this.stepper.access(pos)) {
                    pos++;
                }
                let temp = this.stepper.access(pos);
                this.stepper.assign(pos, item);
                item = temp;
            }
        }
    }

    private block_sort(start: number, end: number): void {
        // this is just the outer loop, lol.
        let length = end-start+1;
        let power_of_two = this.floor_power_of_two(length);
        let scale = length/power_of_two; // 1.0 <= scale < 2.0

        // insertion sort 16-31 items at a time.
        for (let merge = 0; merge < power_of_two; merge+=16) {
            let start = Math.floor(merge*scale);
            let end = start + Math.floor(16*scale);
            this.insertion_sort(start, end-1);
        }

        for (let length = 16; length < power_of_two; length += length) {
            for (let merge = 0; merge < power_of_two; merge += length * 2) {
                let start = Math.floor(merge*scale);
                let mid = Math.floor((merge + length)*scale);
                let end = Math.floor((merge + length*2)*scale);

                if (this.stepper.compare(end-1, start) < 0) {
                    // the two ranges are in reverse order,
                    // so a rotation is enough to merge them.
                    this.rotate(start, end-1, mid-start);
                } else if (this.stepper.compare(mid-1, mid) > 0) {
                    this.merge(start, mid-1, mid, end-1);
                }
                // else the ranges are already correctly ordered.
            }
        }
    }

    //https://en.wikipedia.org/wiki/Odd%E2%80%93even_sort
    private odd_even_sort(start: number, end: number): void {
        let sorted = false;
        while (!sorted) {
            sorted = true;
            for (let i = start+1; i < end; i += 2) {
                if (this.stepper.compare(i, i+1) > 0) {
                    this.stepper.swap(i, i+1);
                    sorted = false;
                }
            }

            for (let i = start; i < end; i += 2) {
                if (this.stepper.compare(i, i+1) > 0) {
                    this.stepper.swap(i, i+1);
                    sorted = false;
                }
            }
        }
    }
}
