type UnsignedInt = "u8" | "u16" | "u32";
type SignedInt = "i8" | "i16" | "i32";
type BigInt = "u64" | "i64";
type Float = "f32" | "f64";
type Integer = UnsignedInt | SignedInt;
export type Number = Integer | Float;
export type AnyNumber = Number | BigInt;

type Char = "char";

export type FixedString = [Char, number];
export type StringType =  FixedString;

export type FixedArray = [Exclude<ByteType, Char>, number];

export type ByteType = AnyNumber | StringType | FixedArray | Char;

export type Struct = Record<string, ByteType>;

type TransformArray<T extends ByteType> = //T extends "u8" ? Uint8Array
  // : T extends "i8" ? Int8Array
  // : T extends "u16" ? Uint16Array
  // : T extends "i16" ? Int16Array
  // : T extends "u32" ? Uint32Array
  // : T extends "i32" ? Int32Array
  // : T extends "u64" ? BigUint64Array
  // : T extends "i64" ? BigInt64Array :
  T extends "char" ? string
    : TransformValue<T>[];

type TransformValue<T extends ByteType> = T extends FixedArray
  ? TransformArray<T[0]>
  : T extends StringType | Char ? string
  : T extends BigInt ? bigint
  : T extends Number ? number
  : never;

export type Transform<T extends Struct> = {
  [P in keyof T]: TransformValue<T[P]>;
};
