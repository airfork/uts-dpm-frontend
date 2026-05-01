export default interface CompletePasswordResetDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
