import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class ChartResultArrayQuote {
  @Field(() => Date)
  date: Date;

  @Field(() => Float, { nullable: true })
  high: number | null;

  @Field(() => Float, { nullable: true })
  low: number | null;

  @Field(() => Float, { nullable: true })
  open: number | null;

  @Field(() => Float, { nullable: true })
  close: number | null;

  @Field(() => Float, { nullable: true })
  volume: number | null;

  @Field(() => Float, { nullable: true })
  adjclose?: number | null;
}
