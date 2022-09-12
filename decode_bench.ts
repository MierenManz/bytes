import { ByteDecoder } from "./decode.ts";

const f = {
  key: "u8",
  f: "i8",
  f2: "u16",
  f3: "i16",
  f4: "u32",
  f5: "i32",
  f6: "f32",
  f7: "f64",
} as const;

const u8 = new Uint8Array(26);
const dt = new DataView(u8.buffer);
dt.setUint8(0, 12);
dt.setInt8(1, 12);
dt.setUint16(2, 12);
dt.setInt16(4, 12);
dt.setUint32(6, 12);
dt.setInt32(10, 12);
dt.setFloat32(14, 12);
dt.setFloat64(18, 12);

const decoder = new ByteDecoder(f);

Deno.bench({
  name: "NOP",
  fn: () => {},
});

Deno.bench({
  name: "decode",
  group: "decode",
  fn: () => {
    decoder.decode(u8);
  },
});
