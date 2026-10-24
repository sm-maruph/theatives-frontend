import axios from "axios";
import { getFullUrl } from "../utils/apiUrl";

const BASE = "/api/admin/dashboard/finance";
const options = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Your admin session has expired. Please sign in again.");
  return { headers: { Authorization: `Bearer ${token}` } };
};
const call = async (method, path, data) => {
  try {
    const response = await axios({ method, url: getFullUrl(`${BASE}${path}`), data, ...options() });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || "Finance request failed");
  }
};

// Finance API payloads use the database's snake_case field names.
export const getCompanyFinanceSummary = () => call("get", "/summary/company");
export const getProjectFinanceSummaries = () => call("get", "/summary/projects");
export const getMonthlyCashFlow = () => call("get", "/summary/monthly");
export const getFinanceCategories = () => call("get", "/categories");

export const getInvoices = () => call("get", "/invoices");
export const createInvoice = (invoice) => call("post", "/invoices", invoice);
export const updateInvoice = (id, changes) => call("patch", `/invoices/${id}`, changes);
export const deleteInvoice = (id) => call("delete", `/invoices/${id}`);

export const getTransactions = () => call("get", "/transactions");
export const createTransaction = (transaction) => call("post", "/transactions", transaction);
export const updateTransaction = (id, changes) => call("patch", `/transactions/${id}`, changes);
export const deleteTransaction = (id) => call("delete", `/transactions/${id}`);

export const getPayees = () => call("get", "/payees");
export const createPayee = (person) => call("post", "/payees", person);
export const getProjectPayables = () => call("get", "/payables");
export const createProjectPayable = (payable) => call("post", "/payables", payable);
export const recordProjectPayablePayment = (id, payment) => call("post", `/payables/${id}/payments`, payment);
