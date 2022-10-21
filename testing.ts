import { ByteDecoder as OldByteDecoder } from "https://raw.githubusercontent.com/MierenManz/bytes/main/decode.ts";
import { ByteDecoder } from "./decode.ts";

const KEYS = [
  "u8",
  "i8",
  "u16",
  "i16",
  "u32",
  "i32",
  "u64",
  "i64",
  "f32",
  "f64",
  "cstring",
];

const STRUCT = KEYS.reduce((acc, v) => {
  acc[v] = v;
  return acc;
  // deno-lint-ignore no-explicit-any
}, {} as any);

const OLD_VALUE_DECODER = new OldByteDecoder(STRUCT);
const NEW_VALUE_DECODER = new ByteDecoder(STRUCT);

const bytes = new Uint8Array(1 + 1 + 2 + 2 + 4 + 4 + 8 + 8 + 4 + 8 + 13);
const dt = new DataView(bytes.buffer);
dt.setUint8(0, 12);
dt.setInt8(1, 12);
dt.setUint16(2, 12);
dt.setInt16(4, 12);
dt.setUint32(6, 12);
dt.setInt32(10, 12);
dt.setBigUint64(14, 12n);
dt.setBigInt64(22, 12n);
dt.setFloat32(30, 12);
dt.setFloat64(34, 12);
bytes.set(new TextEncoder().encode("Hello World!\0"), 42);

for (let i = 0; i < 10_000; i++) {
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
    OLD_VALUE_DECODER.decode(bytes);
}

for (let i = 0; i < 10_000; i++) {
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
    NEW_VALUE_DECODER.decode(bytes);
}