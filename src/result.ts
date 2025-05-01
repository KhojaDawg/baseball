import { random_int as rand_int } from "./random";


export enum HitResult {
    Out = -1,
    Foul = 0,
    Single = 1,
    Double = 2,
    Triple = 3,
    HomeRun = 4,
}

function hit_result_weight(result: HitResult): number {
    if (result == HitResult.Out) return 2;
    else if (result == HitResult.Foul) return 2;
    else if (result == HitResult.Single) return 4;
    else if (result == HitResult.Double) return 3;
    else if (result == HitResult.Triple) return 2;
    else if (result == HitResult.HomeRun) return 1;
    else throw new RangeError(`Invalid HitResult: ${result}`);
}

export function random_hit_result(): HitResult {
    const table: HitResult[] = [];
    for (let i: number = 0; i < hit_result_weight(HitResult.Out); i++) table.push(HitResult.Out);
    for (let i: number = 0; i < hit_result_weight(HitResult.Foul); i++) table.push(HitResult.Foul);
    for (let i: number = 0; i < hit_result_weight(HitResult.Single); i++) table.push(HitResult.Single);
    for (let i: number = 0; i < hit_result_weight(HitResult.Double); i++) table.push(HitResult.Double);
    for (let i: number = 0; i < hit_result_weight(HitResult.Triple); i++) table.push(HitResult.Triple);
    for (let i: number = 0; i < hit_result_weight(HitResult.HomeRun); i++) table.push(HitResult.HomeRun);
    const index = rand_int(0, table.length-1);
    return table[index];
}