import {
  CreateChatMessage,
  CreateValue,
  SwitchTarget,
  Workflow,
} from '@loopstack/core';
import { BlockConfig, Input } from '@loopstack/common';
import { Expose } from 'class-transformer';
import { z } from 'zod';

@BlockConfig({
  imports: [SwitchTarget, CreateValue, CreateChatMessage],
  properties: z.object({
    value: z.number().default(150),
  }),
  configFile: __dirname + '/dynamic-routing-example.workflow.yaml',
})
export class DynamicRoutingExampleWorkflow extends Workflow {
  @Expose()
  get routeGt200() {
    return this.args.value > 200 ? 'placeC' : 'placeD';
  }
}
