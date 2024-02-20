/* eslint-disable prettier/prettier */
import { describe } from 'node:test';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3001);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3001');
  });

  afterAll(() => {
    app.close();
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'john@gmail.com',
      password: '12345678'
    }

    describe('Register', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: dto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: "email",
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should register', () => {
        return pactum
        .spec()
        .post('/auth/register')
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Login', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: "email",
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should login', () => {
        return pactum
        .spec()
        .post('/auth/login')
        .withBody(dto)
        .expectStatus(HttpStatus.OK);
      });
    });
  });

  describe('User', () => {
    describe('Get user (me)', () => {  })

    describe('Edit user (me)', () => { })
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {  })

    describe('Get bookmarks', () => {})

    describe('Get bookmark by id', () => {})

    describe('Edit bookmark', () => {})

    describe('Delete bookmark', () => {})
  });

});
