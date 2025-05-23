import * as random from "./random";

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

export async function sleep(ms: number): Promise<any> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export { random };

const VERSION = "0.0.1";
export { VERSION };
