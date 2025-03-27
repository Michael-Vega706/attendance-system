import { IsString, IsUrl, MinLength } from 'class-validator';

export class AttachmentModel {
  id?: number;

  @IsString()
  @MinLength(4)
  name: string;

  @IsUrl()
  url: string;
}
