import type {
  // AnyNumber,
  ByteType,
  Number,
  Struct,
  Transform,
} from "./types.ts";
import { calculateStructSize } from "./util.ts";

// type TypedArray =
//   | Uint8Array
//   | Int8Array
//   | Uint16Array
//   | Int16Array
//   | Uint32Array
//   | Int32Array
//   | BigUint64Array
//   | BigInt64Array
//   | Float32Array
//   | Float64Array;

const TEXT_DECODER = new TextDecoder();

export class ByteDecoder<T extends Struct> {
  #transformStruct: T;
  #littleEndian: boolean;
  #offset = 0;
  #structSize: number;

  constructor(struct: T, littleEndian = false) {
    this.#transformStruct = struct;
    this.#littleEndian = littleEndian;
    this.#structSize = calculateStructSize(struct);
  }

  // #decodeTypedArray(
  //   src: Uint8Array,
  //   kind: AnyNumber,
  //   length: number,
  // ): TypedArray {
  //   return new Uint8Array();
  // }

  #decodeFixedString(src: Uint8Array, length: number): string {
    const start = this.#offset;
    this.#offset += length;
    return TEXT_DECODER.decode(
      src.subarray(start, this.#offset),
    );
  }

  #decodeNumber(src: Uint8Array, kind: Number): number {
    const dt = new DataView(src.buffer, this.#offset);
    this.#offset += parseInt(kind.slice(1)) >> 3;
    switch (kind) {
      case "i8":
        return dt.getInt8(0);
      case "u8":
        return dt.getUint8(0);
      case "i16":
        return dt.getInt16(0, this.#littleEndian);
      case "u16":
        return dt.getUint16(0, this.#littleEndian);
      case "i32":
        return dt.getInt32(0, this.#littleEndian);
      case "u32":
        return dt.getUint32(0, this.#littleEndian);
      case "f32":
        return dt.getFloat32(0, this.#littleEndian);
      case "f64":
        return dt.getFloat64(0, this.#littleEndian);
    }
  }

  #decodeBigint(src: Uint8Array, isSigned: boolean): bigint {
    const dt = new DataView(
      src.buffer,
      src.byteOffset + this.#offset,
      src.length - this.#offset,
    );

    const value = isSigned
      ? dt.getBigInt64(this.#offset, this.#littleEndian)
      : dt.getBigUint64(this.#offset, this.#littleEndian);
    this.#offset += 8;

    return value;
  }

  #decode(src: Uint8Array, value: ByteType): Transform<T>[keyof T] {
    if (Array.isArray(value)) {
      if (value[0] === "char") {
        // Fixed String
        return this.#decodeFixedString(src, value[1]) as Transform<T>[keyof T];
      } else { // } else if (Array.isArray(value[0])) {
        // Multi-dimensional Array
        const arr = [];
        for (let i = 0; i < value[1]; i++) {
          arr[i] = this.#decode(src, value[0]);
        }
        return arr as Transform<T>[keyof T];
      }

      // Typed Array
      // return this.#decodeTypedArray(
      //   src,
      //   value[0],
      //   value[1],
      // ) as Transform<T>[keyof T];
    }

    switch (value) {
      case "char":
        return this.#decodeFixedString(src, 1) as Transform<T>[keyof T];

      case "u8":
      case "i8":
      case "u16":
      case "i16":
      case "u32":
      case "i32":
      case "f32":
      case "f64":
        return this.#decodeNumber(src, value) as Transform<T>[keyof T];
      case "u64":
      case "i64":
        return this.#decodeBigint(
          src,
          value === "i64",
        ) as Transform<T>[keyof T];
    }
  }

  decode(src: Uint8Array): Transform<T> {
    const res: Transform<T> = {} as Transform<T>;

    this.#offset = 0;

    for (const [key, value] of Object.entries(this.#transformStruct)) {
      res[key as keyof T] = this.#decode(src, value);
    }

    if (this.#offset !== this.#structSize) {
      throw new Error("Struct size differs from byte size");
    }

    return res as Transform<T>;
  }
}
