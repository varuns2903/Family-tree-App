export interface Member {
  id: string;
  treeId: string;

  firstName: string;
  lastName?: string;
  gender: "male" | "female" | "other";

  dateOfBirth?: string;
  birthPlace?: string;

  isAlive: boolean;
  deathDate?: string;
  contactNo?: string;

  parents: string[];
  children: string[];
  spouses: string[];

  createdAt: string;
  updatedAt: string;
}
