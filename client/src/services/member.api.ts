import { api } from "./api";
import type { Member } from "../types/member.types";

export const MemberAPI = {
  async getTreeMembers(treeId: string): Promise<Member[]> {
    const { data } = await api.get(`/trees/${treeId}/members`);
    return data.members; // backend already returns array
  },
};
