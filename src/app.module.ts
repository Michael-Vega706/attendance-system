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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'attendance-system',
      autoLoadEntities: true,
      entities: [User, Role, Permission, Course, Lesson, Attachment],
      synchronize: true,
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
