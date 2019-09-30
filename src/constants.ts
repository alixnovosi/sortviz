export class Constants {
    // supported sorts.
    public static readonly QUICKSORT = "QUICKSORT";
    public static readonly HEAPSORT = "HEAPSORT";
    public static readonly STOOGESORT = "STOOGESORT";
    public static readonly SELECTION_SORT = "SELECTION_SORT";
    public static readonly INSERTION_SORT = "INSERTION_SORT";
    public static readonly BUBBLE_SORT = "BUBBLE_SORT";
    public static readonly COCKTAIL_SHAKER_SORT = "COCKTAIL_SHAKER_SORT";
    public static readonly COMB_SORT = "COMB_SORT";
    public static readonly SHELLSORT = "SHELLSORT";

    // bar colors for various sort actions.
    public static readonly NORMAL_COLOR: string = "#80BFFF";
    public static readonly SWAP_COLOR: string = "#DE2C2C";
    public static readonly ACCESS_COLOR: string = "#FFAF4D";
    public static readonly COMPARE_COLOR: string = "#143A42";

    public static supported_sorts: string[] = [
        Constants.QUICKSORT,
        Constants.HEAPSORT,
        Constants.STOOGESORT,
        Constants.SELECTION_SORT,
        Constants.INSERTION_SORT,
        Constants.BUBBLE_SORT,
        Constants.COCKTAIL_SHAKER_SORT,
        Constants.COMB_SORT,
        Constants.SHELLSORT,
    ];

    // sorts we should give a warning on that they're inefficient.
    // TODO maybe split into slow and VERY slow?
    public static slow_sorts: string[] = [
        Constants.STOOGESORT,
        Constants.SELECTION_SORT,
        Constants.BUBBLE_SORT,
        Constants.COCKTAIL_SHAKER_SORT,
    ];
}
