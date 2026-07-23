/**
 * serviceInquiryApi.js
 * Put this in: src/adminServices/serviceInquiryApi.js
 *
 * MOCK BACKEND — submissions persist to localStorage so you can build and
 * test the admin view right now. When your Express/Supabase backend is up,
 * replace the bodies of these three functions with real HTTP calls; every
 * caller's signature stays the same, so nothing else has to change.
 *
 * Suggested table (Postgres):
 *   create table service_inquiries (
 *     id            bigserial primary key,
 *     service_id    bigint,
 *     service_title text not null,
 *     service_kind  text not null check (service_kind in ('service','micro')),
 *     name          text not null,
 *     email         text not null,
 *     phone         text,
 *     company       text,
 *     budget        text,
 *     deadline      date,
 *     contact_pref  text,
 *     requirements  text not null,
 *     status        text not null default 'New',
 *     created_at    timestamptz not null default now()
 *   );
 */

const STORAGE_KEY = "theatives_service_inquiries";

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeAll = (rows) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));

/** Submit a new service inquiry. */
export const createInquiry = async (payload) => {
  // ---- REAL BACKEND (swap in when ready) ----
  // const res = await axios.post(getFullUrl("/api/inquiries"), payload);
  // return res.data;

  // ---- MOCK ----
  await new Promise((r) => setTimeout(r, 700)); // mimic network latency

  const rows = readAll();
  const row = {
    ...payload,
    id: Date.now(),
    status: "New",
    created_at: new Date().toISOString(),
  };
  rows.unshift(row);
  writeAll(rows);
  return row;
};

/** Read every inquiry — use this from the admin panel. */
export const getInquiries = async () => {
  // ---- REAL BACKEND ----
  // const res = await axios.get(getFullUrl("/api/inquiries"), authHeader());
  // return res.data;

  await new Promise((r) => setTimeout(r, 250));
  return readAll();
};

/** Update an inquiry's status: New | Contacted | Converted | Closed */
export const updateInquiryStatus = async (id, status) => {
  // ---- REAL BACKEND ----
  // const res = await axios.patch(getFullUrl(`/api/inquiries/${id}`), { status }, authHeader());
  // return res.data;

  const rows = readAll().map((r) => (r.id === id ? { ...r, status } : r));
  writeAll(rows);
  return rows.find((r) => r.id === id);
};

/** Delete an inquiry. */
export const deleteInquiry = async (id) => {
  // ---- REAL BACKEND ----
  // await axios.delete(getFullUrl(`/api/inquiries/${id}`), authHeader());

  writeAll(readAll().filter((r) => r.id !== id));
  return true;
};
