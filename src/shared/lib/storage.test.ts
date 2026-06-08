/// <reference types="vitest/globals" />
import { loadState, saveState } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadState", () => {
    it("returns null when storage is empty", async () => {
      const result = await loadState();
      expect(result).toBeNull();
    });

    it("returns parsed state when valid JSON is stored", async () => {
      const state = { posts: [{ id: "p1" }], stories: [], conversations: [] };
      localStorage.setItem("lumina-insta-state-v1", JSON.stringify(state));
      const result = await loadState();
      expect(result).toEqual(state);
    });

    it("returns null when stored JSON is corrupted", async () => {
      localStorage.setItem("lumina-insta-state-v1", "{broken json");
      const result = await loadState();
      expect(result).toBeNull();
    });
  });

  describe("saveState", () => {
    it("persists state to localStorage", async () => {
      const state = { posts: [], stories: [], conversations: [] };
      await saveState(state);
      const raw = localStorage.getItem("lumina-insta-state-v1");
      expect(JSON.parse(raw!)).toEqual(state);
    });

    it("does not throw when localStorage is unavailable", async () => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = () => { throw new Error("QuotaExceededError"); };
      await expect(saveState({ posts: [], stories: [], conversations: [] })).resolves.not.toThrow();
      Storage.prototype.setItem = original;
    });
  });
});
