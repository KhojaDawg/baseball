export function ordinal(num: number): string {
    if (num == 1) {
        return "1st";
    } else if (num == 2) {
        return "2nd";
    } else if (num == 3) {
        return "3rd";
    } else {
        return `${num}th`
    }
}