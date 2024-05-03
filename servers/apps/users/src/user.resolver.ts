import { response } from 'express';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  ActivationResponse,
  LoginResponse,
  logoutResponse,
  RegisterResponse,
} from './types/user.types';
import { ActivationDto, RegisterDto } from './dto/user.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please provide all required fields');
    }
    const { activation_token } = await this.usersService.register(
      registerDto,
      context.res,
    );
    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    {
      return await this.usersService.activateUser(activationDto, context.res);
    }
  }
  // @Mutation(() => RegisterResponse)
  // async activateUser(
  //   @Args('activationInput') activationDto: ActivationDto,
  //   @Context() context: { res: Response },
  // ): Promise<RegisterResponse> {
  //   {
  //     const user = await this.usersService.activationUser(
  //       activationDto,
  //       context.res,
  //     );
  //     return { user };
  //   }
  // }
  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.usersService.login({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: Request }) {
    // console.log(context.req, 'lllllllllllllllll');
    return await this.usersService.getLoggedInUser(context.req);
    // console.log(data, 'ddddddddddddddddddddddd');
  }

  @Query(() => logoutResponse)
  @UseGuards(AuthGuard)
  async logOutUser(@Context() context: { req: Request }) {
    return await this.usersService.logout(context.req);
  }

  @Query(() => [User])
  async getUsers() {
    return this.usersService.getUser();
  }
}
