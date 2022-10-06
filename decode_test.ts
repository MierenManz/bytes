import { ByteDecoder } from "./decode.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test({
  name: "Decode u8",
  fn: () => {
    const data = new Uint8Array([12]);
    const decoder = new ByteDecoder({ value: "u8" });
    const { value } = decoder.decode(data);

    assertEquals(value, 12);
  },
});

Deno.test({
  name: "Decode i8",
  fn: () => {
    const data = new Int8Array([-12]);
    const decoder = new ByteDecoder({ value: "i8" });
    const { value } = decoder.decode(new Uint8Array(data.buffer));

    assertEquals(value, -12);
  },
});

Deno.test({
  name: "Decode u16",
  fn: async (t) => {
    await t.step({
      name: "Little Endian",
      fn: () => {
        const data = new Uint8Array([12, 0]);
        const decoder = new ByteDecoder({ value: "u16" }, true);

        const { value } = decoder.decode(data);

        assertEquals(value, 12);
      },
    });

    await t.step({
      name: "Big Endian",
      fn: () => {
        const data = new Uint8Array([0, 12]);
        const decoder = new ByteDecoder({ value: "u16" });

        const { value } = decoder.decode(data);

        assertEquals(value, 12);
      },
    });
  },
});

Deno.test({
  name: "Decode i16",
  fn: async (t) => {
    await t.step({
      name: "Little Endian",
      fn: () => {
        const data = new Uint8Array(2);
        new DataView(data.buffer).setInt16(0, -12, true);

        const decoder = new ByteDecoder({ value: "i16" }, true);
        const { value } = decoder.decode(data);

        assertEquals(value, -12);
      },
    });

    await t.step({
      name: "Big Endian",
      fn: () => {
        const data = new Uint8Array(2);
        new DataView(data.buffer).setInt16(0, -12);
        const decoder = new ByteDecoder({ value: "i16" });

        const { value } = decoder.decode(data);

        assertEquals(value, -12);
      },
    });
  },
});

Deno.test({
  name: "Decode u32",
  fn: async (t) => {
    await t.step({
      name: "Little Endian",
      fn: () => {
        const data = new Uint8Array([12, 0, 0, 0]);
        const decoder = new ByteDecoder({ value: "u32" }, true);

        const { value } = decoder.decode(data);

        assertEquals(value, 12);
      },
    });

    await t.step({
      name: "Big Endian",
      fn: () => {
        const data = new Uint8Array([0, 0, 0, 12]);
        const decoder = new ByteDecoder({ value: "u32" });

        const { value } = decoder.decode(data);

        assertEquals(value, 12);
      },
    });
  },
});

Deno.test({
  name: "Decode i32",
  fn: async (t) => {
    await t.step({
      name: "Little Endian",
      fn: () => {
        const data = new Uint8Array(4);
        new DataView(data.buffer).setInt32(0, -12, true);

        const decoder = new ByteDecoder({ value: "i32" }, true);
        const { value } = decoder.decode(data);

        assertEquals(value, -12);
      },
    });

    await t.step({
      name: "Big Endian",
      fn: () => {
        const data = new Uint8Array(4);
        new DataView(data.buffer).setInt32(0, -12);
        const decoder = new ByteDecoder({ value: "i32" });

        const { value } = decoder.decode(data);

        assertEquals(value, -12);
      },
    });
  },
});

Deno.test({
  name: "Decode u64",
  fn: async (t) => {
    await t.step({
      name: "Little Endian",
      fn: () => {
        const data = new Uint8Array([12, 0, 0, 0, 0, 0, 0, 0]);
        const decoder = new ByteDecoder({ value: "u64" }, true);

        const { value } = decoder.decode(data);

        assertEquals(value, 12n);
      },
    });

    await t.step({
      name: "Big Endian",
      fn: () => {
        const data = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 12]);
        const decoder = new ByteDecoder({ value: "u64" });

        const { value } = decoder.decode(data);

        assertEquals(value, 12n);
      },
    });
  },
});

Deno.test({
  name: "Decode i64",
  fn: async (t) => {
    await t.step({
      name: "Little Endian",
      fn: () => {
        const data = new Uint8Array(8);
        new DataView(data.buffer).setBigInt64(0, -12n, true);

        const decoder = new ByteDecoder({ value: "i64" }, true);
        const { value } = decoder.decode(data);

        assertEquals(value, -12n);
      },
    });

    await t.step({
      name: "Big Endian",
      fn: () => {
        const data = new Uint8Array(8);
        new DataView(data.buffer).setBigInt64(0, -12n);
        const decoder = new ByteDecoder({ value: "i64" });

        const { value } = decoder.decode(data);

        assertEquals(value, -12n);
      },
    });
  },
});

Deno.test({
  name: "Decode Char",
  fn: () => {
    const data = new TextEncoder().encode("a");
    const decoder = new ByteDecoder({value: "char"});

    const { value } = decoder.decode(data);

    assertEquals(value, "a");
  }
});

Deno.test({
  name: "Decode Fixed-Size string",
  fn: () => {

    const data = new TextEncoder().encode("Hello World!");
    const decoder = new ByteDecoder({value: ["char", data.length]});

    const { value } = decoder.decode(data);

    assertEquals(value, "Hello World!");
  }
})

Deno.test({
  name: "Decode 2DArray",
  fn: () => {
    const hello = new TextEncoder().encode("Hello");
    const world = new TextEncoder().encode("World");
    const data = Uint8Array.of(...hello, ...world);

    const decoder = new ByteDecoder({value: [["char", hello.length], 2]})

    const { value } = decoder.decode(data);

    assertEquals(value, ["Hello", "World"])
  }
})