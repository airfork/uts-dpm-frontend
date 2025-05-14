export interface DPMGroup {
  groupName: string;
  dpms: DPMType[];
}

export interface DPMType {
  id: number;
  name: string;
  points: number;
}
