export interface Tree {
  id: string;
  name: string;
  description?: string;
  hasRootMember: boolean;
}

export interface TreeListResponse {
  ownedTrees: Tree[];
  sharedTrees: Tree[];
}
