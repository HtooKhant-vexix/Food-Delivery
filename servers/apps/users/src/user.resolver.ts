import { response } from 'express';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ActivationResponse, RegisterResponse } from './types/user.types';
import { ActivationDto, RegisterDto } from './dto/user.dto';
import { BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';

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

  @Query(() => [User])
  async getUsers() {
    return this.usersService.getUser();
  }
}
