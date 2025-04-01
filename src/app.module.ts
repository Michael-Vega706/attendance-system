import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from './roles/roles.module';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail/mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Attachment } from './entities/attachment.entity';
import { AttachmentModule } from './attachment/attachment.module';
import { LessonModule } from './lesson/lesson.module';
import { CourseModule } from './course/course.module';
import { CourseStudent } from './entities/course-student.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        entities: [
          User,
          Role,
          Permission,
          Course,
          CourseStudent,
          Lesson,
          Attachment,
        ],
        synchronize: configService.get('DB_SYNC'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'gtxm1029.siteground.biz',
          port: 465,
          secure: true,
          auth: {
            user: 'mvega@docentes.krensi.com',
            pass: configService.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: '"Michael Vega" <mvega@docentes.krensi.com>',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AttachmentModule,
    LessonModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
