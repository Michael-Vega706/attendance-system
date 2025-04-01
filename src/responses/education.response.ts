import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './auth.response';

/** RESPONSES */

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

export class CourseResponse {
  @ApiProperty({
    description: "Identifier's course.",
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: "Name's course",
    example: 'Course 1',
  })
  name: string;
}

export class CourseStudentsResponse extends CourseResponse {
  @ApiProperty({
    description: 'Student identifiers',
    example: [{ id: 1 }, { id: 2 }],
  })
  students: [{ id: number }];
}

export class LessonResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  course: CourseResponse;
  @ApiProperty()
  teacher: UserResponse;
}

export class LessonAttachmentResponse extends LessonResponse {
  @ApiProperty({
    description: 'Resources identifiers',
    example: [{ id: 1 }, { id: 2 }],
  })
  resources: [{ id: number }];
}

/** REQUESTS */

export class AttachmentRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  url: string;
}

export class CourseRequest {
  @ApiProperty()
  name: string;
}

export class LessonRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  course: number;
  @ApiProperty()
  teacher: number;
}
