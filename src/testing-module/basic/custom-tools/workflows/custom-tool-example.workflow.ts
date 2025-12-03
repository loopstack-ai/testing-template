import { CreateChatMessage, Workflow } from '@loopstack/core';
import { BlockConfig } from '@loopstack/common';
import { z } from 'zod';
import { MathSumTool } from '../tools/math-sum.tool';
import { Expose } from 'class-transformer';
import { TransientCounterTool } from '../tools/transient-counter.tool';
import { SingletonCounterTool } from '../tools/singleton-counter.tool';

const propertiesSchema = z.object({
  a: z.number().default(1),
  b: z.number().default(2),
});

@BlockConfig({
  imports: [
    MathSumTool,
    TransientCounterTool,
    SingletonCounterTool,
    CreateChatMessage,
  ],
  properties: propertiesSchema,
  configFile: __dirname + '/custom-tool-example.workflow.yaml',
})
export class CustomToolExampleWorkflow extends Workflow {
  @Expose()
  get calculate() {
    return this.args.a + this.args.b;
  }
}
