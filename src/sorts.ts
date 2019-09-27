import { SortStepper } from "./sortstepper";

export class Sort {
    public static readonly QUICKSORT = "QUICKSORT";

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
        }
    }

    private quicksort(): void {
        let partition: (stepper: SortStepper, start: number, end: number) =>
            number = (stepper: SortStepper, start: number, end: number) => {
                let follower = start;
                let leader = start;

                while (leader < end) {
                    if (stepper.compare(leader, end) !== -1) {
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
}
