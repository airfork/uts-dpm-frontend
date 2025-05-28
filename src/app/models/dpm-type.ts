export interface DPMGroup {
  id?: string;
  groupName: string;
  dpms: DPMType[];
}

export interface DPMType {
  id: number;
  name: string;
  points: number;
  dpmColor?: {
    colorId: number;
    hexCode: string;
  };
}
