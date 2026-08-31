const request = async (path, options) => {
  const response = await fetch(`/api/notes${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

const notes = {
  list: async () => request(""),
  get: async (id) => request(`/${id}`),
  create: async (payload) =>
    request("", { method: "POST", body: JSON.stringify(payload) }),
  update: async (id, payload) =>
    request(`/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  delete: async (id) => request(`/${id}`, { method: "DELETE" }),
};

export const db = { notes };
