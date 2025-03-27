import { ApiProperty } from '@nestjs/swagger';

export class AttachmentResponse {
  @ApiProperty({
    description: "Identifier's attachment.",
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: "Name's attachment",
    example: 'File1',
  })
  name: string;
  @ApiProperty({
    description: "URL's attachment",
    example: 'http://google.com/',
  })
  url: string;
}

export class AttachmentRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  url: string;
}
