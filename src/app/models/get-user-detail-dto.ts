import UserDetailDto from './user-detail-dto';
import UsernameDto from './username-dto';

export default interface GetUserDetailDto extends UserDetailDto {
  managers: UsernameDto[];
}
