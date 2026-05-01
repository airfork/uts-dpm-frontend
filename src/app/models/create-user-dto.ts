export default interface CreateUserDto {
  email: string;
  firstname: string;
  lastname: string;
  managerId: number;
  manager: string;
  role: string;
  fullTime: boolean;
}
