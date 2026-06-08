const STORE_KEY = "lumina-insta-state-v1";

export async function loadState(): Promise<Record<string, unknown> | null> {
  try {
    if (window.storage) {
      const r = await window.storage.get(STORE_KEY);
      return r ? (JSON.parse(r.value) as Record<string, unknown>) : null;
    }
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch (err) {
    console.error("[storage] loadState failed — returning null", err);
    return null;
  }
}

export async function saveState(data: Record<string, unknown>): Promise<void> {
  try {
    if (window.storage) {
      await window.storage.set(STORE_KEY, JSON.stringify(data));
      return;
    }
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("[storage] saveState failed — state was NOT persisted", err);
  }
}
