import { LangsEnum } from '../enums/langs.enum';

export interface UserTokenInterface {
  id: string;
  tenant_id: string;
  index: number;
  user_name: string;
  role: {
    id: string;
    name: string;
    roles: string[];
  };
  lang: LangsEnum;
}
