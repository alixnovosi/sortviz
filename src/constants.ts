// TODO store links somewhere and show that.
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
    public static readonly GNOME_SORT = "GNOME_SORT";

    // fun combo library sorts.
    public static readonly INTROSORT = "INTROSORT";

    public static supported_sorts: string[] = [
        Constants.QUICKSORT,
        Constants.HEAPSORT,
        Constants.INSERTION_SORT,
        Constants.SELECTION_SORT,
        Constants.SHELLSORT,
        Constants.BUBBLE_SORT,
        Constants.COMB_SORT,
        Constants.COCKTAIL_SHAKER_SORT,
        Constants.GNOME_SORT,
        Constants.STOOGESORT,
        Constants.INTROSORT,
    ];

    // sorts we should give a warning on that they're inefficient.
    // TODO maybe split into slow and VERY slow?
    public static slow_sorts: string[] = [
        Constants.STOOGESORT,
        Constants.SELECTION_SORT,
        Constants.BUBBLE_SORT,
        Constants.COCKTAIL_SHAKER_SORT,
        Constants.GNOME_SORT,
    ];

    // supported data types.
    public static readonly RANDOM = "RANDOM";
    public static readonly SORTED = "SORTED";
    public static readonly NEARLY_SORTED = "NEARLY_SORTED";
    public static readonly REVERSED = "REVERSED";

    public static supported_data_types: string[] = [
        Constants.RANDOM,
        Constants.SORTED,
        Constants.NEARLY_SORTED,
        Constants.REVERSED,
    ];

    // bar colors for various sort actions.
    public static readonly NORMAL_COLOR: string = "#80BFFF";
    public static readonly SWAP_COLOR: string = "#DE2C2C";
    public static readonly ACCESS_COLOR: string = "#FFAF4D";
    public static readonly COMPARE_COLOR: string = "#143A42";
}
