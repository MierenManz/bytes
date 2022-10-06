import { ByteType, FixedString, Struct, FixedArray } from "./types.ts";

export function calculateStructSize(struct: Struct): number {
    let size = 0;
    for (const value of Object.values(struct)) {
        if (Array.isArray(value)) {
            size += calculateArraySize(value);
            continue;
        }

        size += calculateValSize(value);
    }

    return size;
}

function calculateValSize(val: Exclude<ByteType, FixedString | FixedArray >): number {
    if (val === "char") return 1;
    return parseInt(val.slice(1)) >> 3;
}

// TODO: Figure out how to do this without recursion
function calculateArraySize(val: FixedString | FixedArray): number {
    if (Array.isArray(val[0])) return calculateArraySize(val[0]);
    return calculateValSize(val[0]) * val[1];
}