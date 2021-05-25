import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NotLoggedInException } from '../exceptions/not-logged-in.exception';

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
    if (!data.nullable && !user) throw new NotLoggedInException();
    return user;
  },
);
