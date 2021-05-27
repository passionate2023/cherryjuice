import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';

@InputType('EditorSettingsIt')
@ObjectType()
export class EditorSettings {
  @Field(() => Float)
  version: number;
  @Field()
  monospaceBg: string;
  @Field()
  codeBg: string;
  @Field()
  codeFont: string;
  @Field()
  codeFontSize: string;
  @Field()
  richTextBg: string;
  @Field()
  richTextColor: string;
  @Field()
  richTextFont: string;
  @Field()
  richTextFontSize: string;
  @Field()
  treeBg: string;
  @Field()
  treeColor: string;
  @Field()
  treeFont: string;
  @Field()
  treeFontSize: string;
}
