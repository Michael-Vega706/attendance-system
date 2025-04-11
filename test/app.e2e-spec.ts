import * as request from 'supertest';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppModule } from '../src/app.module';

import { User } from '../src/entities/user.entity';
import { Permission } from '../src/entities/permission.entity';
import { Role } from '../src/entities/role.entity';
import { Course } from '../src/entities/course.entity';
import { CourseStudent } from '../src/entities/course-student.entity';
import { Lesson } from '../src/entities/lesson.entity';
import { Attachment } from '../src/entities/attachment.entity';
import { createTestCache } from './redis.config';
import { CacheService } from '../src/cache/cache.service';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let permissionRepository: Repository<Permission>;
  let courseRepository: Repository<Course>;
  let courseStudentRepository: Repository<CourseStudent>;
  let lessonRepository: Repository<Lesson>;
  let attachmentRepository: Repository<Attachment>;

  let token: string;
  let userStudent: User;
  let userTeacher: User;

  let roleStudent: Role;
  let permissionProfile: Permission;
  let permissionRoles: Permission;
  let permissionPermissions: Permission;
  let permissionUsers: Permission;
  let permissionAttachments: Permission;
  let permissionCourses: Permission;
  let permissionLessons: Permission;

  let roleTest: Role;
  let permissionTest: Permission;

  let attachment: Attachment;
  let course: Course;
  let lesson: Lesson;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'mysql',
            host: configService.get('TEST_DB_HOST'),
            port: configService.get('TEST_DB_PORT'),
            username: configService.get('TEST_DB_USERNAME'),
            password: configService.get('TEST_DB_PASSWORD'),
            database: configService.get('TEST_DB_NAME'),
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
            synchronize: true,
          }),
        }),
        AppModule,
      ],
      providers: [
        {
          provide: 'CACHE_INSTANCE',
          useFactory: () => {
            const redisUrl = process.env.TEST_REDIS_URL;
            const secondary = createKeyv(redisUrl);
            return new Cacheable({ secondary, ttl: 14400000 });
          }
        },
        CacheService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Obtener los repositorios
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = moduleFixture.get<Repository<Role>>(getRepositoryToken(Role));
    permissionRepository = moduleFixture.get<Repository<Permission>>(getRepositoryToken(Permission));
    lessonRepository = moduleFixture.get<Repository<Lesson>>(getRepositoryToken(Lesson));
    courseStudentRepository = moduleFixture.get<Repository<CourseStudent>>(getRepositoryToken(CourseStudent));
    courseRepository = moduleFixture.get<Repository<Course>>(getRepositoryToken(Course));
    attachmentRepository = moduleFixture.get<Repository<Attachment>>(getRepositoryToken(Attachment));

    await app.init();
  });

  afterAll(async () => {
    // Limpiar las tablas después de todos los tests
    await lessonRepository.delete({});
    await courseStudentRepository.delete({});
    await courseRepository.delete({});
    await attachmentRepository.delete({});
    await permissionRepository.delete({});
    await roleRepository.delete({});
    await userRepository.delete({});

    await app.close();
  }, 30000);

  it('Seeds', async () => {
    // Crear un permiso
    permissionProfile = await permissionRepository.save({
      name: 'GET:/auth/profile',
    });

    permissionRoles = await permissionRepository.save({
      name: '*:/roles',
    });

    permissionPermissions = await permissionRepository.save({
      name: '*:/permissions',
    });

    permissionUsers = await permissionRepository.save({
      name: '*:/users',
    });

    permissionAttachments = await permissionRepository.save({
      name: '*:/attachments',
    });

    permissionCourses = await permissionRepository.save({
      name: '*:/courses',
    });

    permissionLessons = await permissionRepository.save({
      name: '*:/lessons',
    });

    // Crear un rol y asignarle el permiso
    const role = await roleRepository.save({
      name: 'TEACHER',
      permissions: [
        permissionProfile,
        permissionRoles,
        permissionPermissions,
        permissionUsers,
        permissionAttachments,
        permissionCourses,
        permissionLessons
      ]
    });

    // Crear un usuario y asignarle el rol
    await userRepository.save({
      username: 'testuser',
      password: '$2b$12$7Q9n6fVUTmdot9tVotBJuu8BxXAcNhyrdqDlcyf.cGqOVYFxK2ZgC',
      email: 'test@mailinator.com',
      userType: 'TEACHER',
      roles: [role]
    });
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    token = response.body.access_token;
    return expect(response.status).toBe(200);
  });

  it('/auth/register (POST/STUDENT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'teststudent',
        password: 'testpassword',
        email: 'teststudent@mailinator.com',
        userType: 'STUDENT',
      });

    userStudent = response.body;
    expect(response.status).toBe(201);
  });

  it('/auth/register (POST/TEACHER)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'testteacher',
        password: 'testpassword',
        email: 'testteacher@mailinator.com',
        userType: 'TEACHER',
      });

    userTeacher = response.body;
    expect(response.status).toBe(201);
  });

  it('/auth/profile (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });

  it('/auth/profile-2 (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/profile-2')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });

  it.skip('/auth/reset-password (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({
        email: 'test@mailinator.com',
      });

    expect(response.status).toBe(201);
  });

  it('/users/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .query({
        page: 1,
        limit: 10,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(3);
  });

  it('/users/teacher/list (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/teacher/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].username).toBe('testuser');
    expect(response.body[1].username).toBe('testteacher');
  });

  it('/roles/ (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/roles/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'STUDENT',
      });

    roleStudent = response.body;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('STUDENT');
  });

  it('/roles/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/roles/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('/roles/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/roles/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ADMIN',
      });

    roleTest = response.body;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('ADMIN');

    const response2 = await request(app.getHttpServer())
      .put(`/roles/${roleTest.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ADMIN2',
      });

    expect(response2.status).toBe(204);

    const response3 = await request(app.getHttpServer())
      .get('/roles/')
      .set('Authorization', `Bearer ${token}`);

    expect(response3.status).toBe(200);
    expect(response3.body.length).toBe(3);
  });

  it('/roles/:id (PUT/No exist)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/roles/${3}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ADMIN2',
      });

    expect(response.status).toBe(404);
  })

  it('/roles/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/roles/${roleTest.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const response2 = await request(app.getHttpServer())
      .get('/roles/')
      .set('Authorization', `Bearer ${token}`);

    expect(response2.status).toBe(200);
    expect(response2.body.length).toBe(2);
  });

  it('/roles/:id (DELETE/No exist)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/roles/${3}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('/permissions/ (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/permissions/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'PUT:/roles/',
      });

    permissionTest = response.body;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('PUT:/roles/');
  });

  it('/permissions/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/permissions/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(8);
  });

  it('/permissions/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/permissions/${permissionTest.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'PUT:/roles/:id',
      });

    expect(response.status).toBe(204);
  });

  it('/permissions/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/permissions/${permissionTest.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const response2 = await request(app.getHttpServer())
      .get('/permissions/')
      .set('Authorization', `Bearer ${token}`);

    expect(response2.status).toBe(200);
    expect(response2.body.length).toBe(7);
  });

  it('/roles/:id/assign-permissions (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/roles/${roleStudent.id}/assign-permissions`)
      .set('Authorization', `Bearer ${token}`)
      .send([
        permissionProfile,
      ]);
    expect(response.status).toBe(201);
  });

  it('/users/:id/assign-roles (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/users/${userStudent.id}/assign-roles`)
      .set('Authorization', `Bearer ${token}`)
      .send([
        roleStudent,
      ]);
    expect(response.status).toBe(201);

    const response2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'teststudent',
        password: 'testpassword',
      });
    const tokenStudent = response2.body.access_token;

    const response3 = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${tokenStudent}`);

    expect(response3.status).toBe(200);
    expect(response3.body.username).toBe('teststudent');
  });

  it('/attachment/ (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/attachment/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'testattachment',
        url: 'https://www.google.com',
      });

    attachment = response.body;
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('testattachment');
    expect(response.body.url).toBe('https://www.google.com');
  });

  it('/attachment/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/attachment/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('/attachment/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/attachment/${attachment.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(attachment.id);
    expect(response.body.name).toBe(attachment.name);
    expect(response.body.url).toBe(attachment.url);
  });

  it('/attachment/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/attachment/${attachment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'testattachment',
      });

    expect(response.status).toBe(204);

    const response2 = await request(app.getHttpServer())
      .get(`/attachment/${attachment.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response2.status).toBe(200);
    expect(response2.body.name).toBe('testattachment');
  });

  it.skip('/attachment/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/attachment/${attachment.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const response2 = await request(app.getHttpServer())
      .get(`/attachment/${attachment.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response2.status).toBe(404);
  });

  it('/course/ (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/course/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'testcourse',
      });

    course = response.body;
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('testcourse');
  });

  it('/course/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/course/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('/course/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/course/${course.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('/course/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/course/${course.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'testcourse2',
      });

    expect(response.status).toBe(204);
  });

  it('/course/:id/assign-students (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/course/${course.id}/assign-students`)
      .set('Authorization', `Bearer ${token}`)
      .send([userStudent.id]);
    expect(response.status).toBe(201);
  });

  it('/course/:id/students (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/course/${course.id}/students`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].student.id).toBe(userStudent.id);
    expect(response.body[0].hasView).toBeFalsy();
  });

  it('/course/:id/student/:studentId/attendance (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/course/${course.id}/student/${userStudent.id}/attendance`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        hasView: true,
      });
    expect(response.status).toBe(204);

    const response2 = await request(app.getHttpServer())
      .get(`/course/${course.id}/students`)
      .set('Authorization', `Bearer ${token}`);

    expect(response2.status).toBe(200);
    expect(response2.body[0].hasView).toBeTruthy();
  });

  it.skip('/course/:id/assign-students (POST/Remove students)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/course/${course.id}/assign-students`)
      .set('Authorization', `Bearer ${token}`)
      .send([]);
    expect(response.status).toBe(201);
  });

  it.skip('/course/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/course/${course.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const response2 = await request(app.getHttpServer())
      .get(`/course/${course.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response2.status).toBe(404);
  });

  it('/lesson/ (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/lesson/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'testlesson',
        course: course.id,
        teacher: userTeacher.id,
      });

    lesson = response.body;
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('testlesson');
    expect(response.body.course).toBe(course.id);
    expect(response.body.teacher).toBe(userTeacher.id);
  });

  it('/lesson (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/lesson/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('/lesson/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/lesson/${lesson.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(lesson.id);
    expect(response.body.name).toBe(lesson.name);
    expect(response.body.course.id).toBe(course.id);
    expect(response.body.teacher.id).toBe(userTeacher.id);
  });

  it('/lesson/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/lesson/${lesson.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'testlesson2',
      });

    expect(response.status).toBe(204);

    const response2 = await request(app.getHttpServer())
      .get(`/lesson/${lesson.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response2.status).toBe(200);
    expect(response2.body.name).toBe('testlesson2');
  });

  it.skip('/lesson/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/lesson/${lesson.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const response2 = await request(app.getHttpServer())
      .get(`/lesson/${lesson.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response2.status).toBe(404);
  });

  it('/lesson/:id/assign-attachments (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/lesson/${lesson.id}/assign-attachments`)
      .set('Authorization', `Bearer ${token}`)
      .send([attachment.id]);

    expect(response.status).toBe(201);
  });

  it('/lesson/:id/attachments (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/lesson/${lesson.id}/attachments`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(attachment.id);
    expect(response.body[0].name).toBe(attachment.name);
    expect(response.body[0].url).toBe(attachment.url);
  });
});
