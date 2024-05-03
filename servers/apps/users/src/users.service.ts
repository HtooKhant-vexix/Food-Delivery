import { TokenSender } from './utils/sendToken';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/Prisma.service';
import { response } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
// import { Prisma } from '@prisma/client';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number, address } = registerDto;
    const isEmailExit = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExit) {
      throw new BadRequestException('Email already exist');
    }

    const isPhoneNumberExit = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });

    if (isPhoneNumberExit) {
      throw new BadRequestException('Phone number already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
    };

    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const activation_token = activationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activation your account',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activation_token, response };
  }

  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }

  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode != activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new BadRequestException('User already exist with this email!');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    return { user, response };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokensender = new TokenSender(this.configService, this.jwtService);
      return tokensender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        errror: {
          message: 'Invalid email or password !',
        },
      };
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // async activationUser(activationDto: ActivationDto, response: Response) {
  //   const { activationCode, activationToken } = activationDto;

  //   const newUser: { user: UserData; activationCode: string } =
  //     this.jwtService.verify(activationToken, {
  //       secret: this.configService.get<string>('JWT_SECRET'),
  //     }) as { user: UserData; activationCode: string };

  //   if (newUser.activationCode !== activationCode) {
  //     throw new BadRequestException('Activation code is not valid');
  //   }
  //   const { name, email, password, phone_number } = newUser.user;
  //   const exitUser = await this.prisma.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (exitUser) {
  //     throw new BadRequestException('User already exist');
  //   }

  //   const user = await this.prisma.user.create({
  //     data: {
  //       name,
  //       email,
  //       password,
  //       phone_number,
  //     },
  //   });

  //   return { activationToken, response };
  // }

  async getLoggedInUser(req: any) {
    const user = req.user;
    const accessToken = req.accessToken;
    const refreshToken = req.refreshToken;
    return { user, accessToken, refreshToken }
  }

  async logout(req:any){
    req.user = null;
    req.accessToken = null;
    req.refreshToken = null;
    return {message: "Logouted successfully !"};
  }

  async getHello() {
    return 'hello';
  }

  async getUser() {
    return this.prisma.user.findMany({});
  }
}
