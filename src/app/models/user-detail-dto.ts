export default interface UserDetailDto {
  email: string;
  firstname: string;
  lastname: string;
  points: number;
  managerId: number | null;
  manager: string;
  role: string;
  fullTime: boolean;
}
