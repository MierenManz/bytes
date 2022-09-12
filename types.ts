type UnsignedInts = "u8" | "u16" | "u32";
type SignedInts = "i8" | "i16" | "i32";
type BigInts = "u64" | "i64";
type Floats = "f32" | "f64";
type Integers = UnsignedInts | SignedInts | BigInts;
type NumberTypes = Integers | Floats;

type CString = "cstring";

type ByteTypes = NumberTypes | CString;

export type Struct = Record<string, ByteTypes>;

export type Transform<T extends Struct> = {
  [P in keyof T]: T[P] extends CString ? string
    : T[P] extends NumberTypes ? number
    : T[P] extends BigInts ? bigint
    : never;
};
