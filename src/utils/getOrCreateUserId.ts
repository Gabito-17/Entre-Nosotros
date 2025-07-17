export function getOrCreateUserId(): string {
  const KEY = 'mafia-user-id';
  let id = localStorage.getItem(KEY);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }

  return id;
}
