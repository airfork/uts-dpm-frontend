export interface PutDpmGroup {
  groupName: string;
  dpms: PutDpmType[];
}

export interface PutDpmType {
  dpmType: string;
  points: number;
  colorId?: number;
}
