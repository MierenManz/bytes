import type { Struct, Transform } from "./types.ts";

const TEXT_DECODER = new TextDecoder();

function decodeCString(src: Uint8Array, offset: number): string {
  const start = offset;
  while (src[offset] !== 0) offset++;
  return TEXT_DECODER.decode(src.subarray(start, offset));
}

export class ByteDecoder<T extends Struct> {
  #transformStruct: T;
  #littleEndian: boolean;

  constructor(struct: T, littleEndian = false) {
    this.#transformStruct = struct;
    this.#littleEndian = littleEndian;
  }

  decode(src: Uint8Array): Transform<T> {
    const res: Record<string, string | number | bigint> = {};
    let offset = 0;
    const dt = new DataView(src.buffer, src.byteOffset, src.byteLength);

    for (const [key, value] of Object.entries(this.#transformStruct)) {
      switch (value) {
        case "u8":
          res[key] = dt.getUint8(offset);
          offset++;
          break;
        case "i8":
          res[key] = dt.getInt8(offset);
          offset++;
          break;

        case "u16":
          res[key] = dt.getUint16(offset, this.#littleEndian);
          offset += 2;
          break;

        case "i16":
          res[key] = dt.getInt16(offset, this.#littleEndian);
          offset += 2;
          break;

        case "u32":
          res[key] = dt.getUint32(offset, this.#littleEndian);
          offset += 4;
          break;
        case "i32":
          res[key] = dt.getInt32(offset, this.#littleEndian);
          offset += 4;
          break;

        case "u64":
          res[key] = dt.getBigUint64(offset, this.#littleEndian);
          offset += 8;
          break;
        case "i64":
          res[key] = dt.getBigInt64(offset, this.#littleEndian);
          offset += 8;
          break;

        case "f32":
          res[key] = dt.getFloat32(offset, this.#littleEndian);
          offset += 4;
          break;
        case "f64":
          res[key] = dt.getFloat64(offset, this.#littleEndian);
          offset += 8;
          break;

        case "cstring": {
          const str = decodeCString(src, offset);
          res[key] = str;
          offset += str.length + 1;
          break;
        }

        default:
          throw new TypeError("Unknown byte type");
      }
    }

    if (offset !== src.length) {
      throw new Error("Struct size differs from byte size");
    }

    return res as Transform<T>;
  }
}
