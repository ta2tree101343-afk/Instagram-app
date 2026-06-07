import { hue, fmt, ago, uid, USE_REAL_MEDIA } from "./index";

describe("hue", () => {
  it("returns a number in [0, 360)", () => {
    const h = hue("tokyo");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(360);
  });
  it("is deterministic", () => {
    expect(hue("seed")).toBe(hue("seed"));
  });
});

describe("fmt", () => {
  it("formats numbers with ja-JP locale", () => {
    expect(fmt(12430)).toBe("12,430");
  });
});

describe("ago", () => {
  it("returns たった今 for < 60s", () => {
    expect(ago(Date.now() - 30000)).toBe("たった今");
  });
  it("returns minutes for < 1h", () => {
    expect(ago(Date.now() - 5 * 60 * 1000)).toBe("5分前");
  });
});

describe("uid", () => {
  it("returns unique strings", () => {
    expect(uid()).not.toBe(uid());
  });
  it("returns a non-empty string", () => {
    expect(uid().length).toBeGreaterThan(0);
  });
});

describe("USE_REAL_MEDIA", () => {
  it("is a boolean", () => {
    expect(typeof USE_REAL_MEDIA).toBe("boolean");
  });
});
