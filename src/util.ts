export class Util {
    public static textFilter(value: string): string {
        return value.split("").map(a => {
            if (a === "_") {
                return " ";
            } else {
                return a.toLowerCase();
            }
        }).join("");
    }
}
