import type {
    // AnyNumber,
    ByteType,
    Number,
    Struct,
    Transform,
  } from "./types.ts";
import { calculateStructSize } from "./util.ts";

export class ByteEncoder<T extends Struct> {
    #transformStruct: T;
    #littleEndian: boolean;
    #structSize: number;

    constructor(struct: T, littleEndian = false) {
        this.#transformStruct = struct;
        this.#littleEndian = littleEndian;
        this.#structSize = calculateStructSize(struct);
    }



    encode(value: Transform<T>): Uint8Array {
        const dataSlice = new Uint8Array(this.#structSize);

        return dataSlice;
    }
}