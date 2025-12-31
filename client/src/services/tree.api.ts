import { api } from "./api";
import type { TreeListResponse, Tree } from "../types/tree.types";

export const TreeAPI = {
  async list(): Promise<TreeListResponse> {
    const { data } = await api.get("/trees");
    return data;
  },

  async create(name: string, description?: string): Promise<Tree> {
    const { data } = await api.post("/trees", { name, description });
    return data;
  },
};
