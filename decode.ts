import type { ByteType, Struct, Transform, TransformValue } from "./types.ts";

const TEXT_DECODER = new TextDecoder();

export class ByteDecoder<T extends Struct> {
  #transformStruct: { [P in keyof T]: () => TransformValue<T[P]> };
  #littleEndian: boolean;
  #src!: Uint8Array;
  #dataview!: DataView;
  #offset = 0;

  constructor(struct: T, littleEndian = false) {
    this.#littleEndian = littleEndian;
    this.#transformStruct = this.#createDecoder(struct);
  }

  #cStringDecoder(): () => string {
    return () => {
      let length = 0;
      while (this.#src[this.#offset + length] !== 0) length++;
      return this.#stringDecoder(length)();
    };
  }

  #stringDecoder(length: number): () => string {
    return () => {
      const start = this.#offset;
      this.#offset += length;
      return TEXT_DECODER.decode(
        this.#src.subarray(start, this.#offset),
      );
    };
  }

  #i8Decoder(): () => number {
    const i8Decode = () => this.#dataview.getInt8(this.#offset++);
    return i8Decode;
  }

  #u8Decoder(): () => number {
    const u8Decode = () => this.#dataview.getUint8(this.#offset++);
    return u8Decode;
  }

  #i16Decoder(): () => number {
    const i16Decode = () => {
      const v = this.#dataview.getInt16(this.#offset, this.#littleEndian);
      this.#offset += 2;
      return v;
    };

    return i16Decode;
  }

  #u16Decoder(): () => number {
    const u16Decode = () => {
      const v = this.#dataview.getUint16(this.#offset, this.#littleEndian);
      this.#offset += 2;
      return v;
    };

    return u16Decode;
  }

  #i32Decoder(): () => number {
    const i32Decode = () => {
      const v = this.#dataview.getInt32(this.#offset, this.#littleEndian);
      this.#offset += 4;
      return v;
    };

    return i32Decode;
  }

  #u32Decoder(): () => number {
    const u32Decode = () => {
      const v = this.#dataview.getUint32(this.#offset, this.#littleEndian);
      this.#offset += 4;
      return v;
    };

    return u32Decode;
  }

  #i64Decoder(): () => bigint {
    const i64Decode = () => {
      const v = this.#dataview.getBigInt64(this.#offset, this.#littleEndian);
      this.#offset += 8;
      return v;
    };

    return i64Decode;
  }

  #u64Decoder(): () => bigint {
    const u64Decode = () => {
      const v = this.#dataview.getBigUint64(this.#offset, this.#littleEndian);
      this.#offset += 8;
      return v;
    };

    return u64Decode;
  }

  #f32Decoder(): () => number {
    const f32Decode = () => {
      const v = this.#dataview.getFloat32(this.#offset, this.#littleEndian);
      this.#offset += 4;
      return v;
    };

    return f32Decode;
  }

  #f64Decoder(): () => number {
    const f64Decode = () => {
      const v = this.#dataview.getFloat64(this.#offset, this.#littleEndian);
      this.#offset += 8;
      return v;
    };

    return f64Decode;
  }

  #createArrayDecoder(type: ByteType, length: number): () => ByteType[] {
    let callable: CallableFunction;
    if (Array.isArray(type)) {
      if (type[0] === "char") {
        callable = this.#stringDecoder(type[1]);
      } else {
        callable = this.#createArrayDecoder(type[0], type[1]) as () =>
          TransformValue<
            ByteType
          >;
      }
    } else {
      callable = this.#createValueDecoder(type);
    }

    return () => {
      const arr: null[] = [];
      arr.length = length;
      return arr.fill(null).map((_) => callable()) as ByteType[];
    };
  }

  #createValueDecoder(type: ByteType): () => TransformValue<ByteType> {
    if (Array.isArray(type)) {
      if (type[0] === "char") {
        return this.#stringDecoder(type[1]);
      }
      return this.#createArrayDecoder(type[0], type[1]) as () => TransformValue<
        ByteType
      >;
    }

    switch (type) {
      case "char":
        return this.#stringDecoder(1);
      case "cstring":
        return this.#cStringDecoder();
      case "u8":
        return this.#u8Decoder();
      case "i8":
        return this.#i8Decoder();
      case "u16":
        return this.#u16Decoder();
      case "i16":
        return this.#i16Decoder();
      case "u32":
        return this.#u32Decoder();
      case "i32":
        return this.#i32Decoder();
      case "u64":
        return this.#u64Decoder();
      case "i64":
        return this.#i64Decoder();
      case "f32":
        return this.#f32Decoder();
      case "f64":
        return this.#f64Decoder();
    }
  }

  #createDecoder(struct: T): { [P in keyof T]: () => TransformValue<T[P]> } {
    const record: Record<string, CallableFunction> = {};
    for (const [key, value] of Object.entries(struct)) {
      record[key] = this.#createValueDecoder(value);
    }

    return record as { [P in keyof T]: () => TransformValue<T[P]> };
  }

  decode(src: Uint8Array): Transform<T> {
    this.#dataview = new DataView(src.buffer, src.byteOffset, src.byteLength);
    this.#src = src;
    this.#offset = 0;

    return Object.entries(this.#transformStruct)
      .reduce((acc, kv) => {
        acc[kv[0] as keyof T] = kv[1]();
        return acc;
      }, {} as Transform<T>);
  }
}
