import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (data, req): User => req.args[0].user,
);
export const GetUserGql = createParamDecorator(
  (
    data: { nullable: boolean } = { nullable: true },
    context: ExecutionContext,
  ) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    if (!data.nullable && !user) throw new UnauthorizedException();
    return user;
  },
);
