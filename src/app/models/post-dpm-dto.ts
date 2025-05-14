export default interface PostDpmDto {
  driver: string;
  block: string;
  date: string;
  type: number;
  location: string;
  startTime: string;
  endTime: string;
  notes?: string;
}
