import { CreateChatMessage, Workflow } from '@loopstack/core';
import { BlockConfig } from '@loopstack/common';
import { z } from 'zod';

@BlockConfig({
  imports: [CreateChatMessage],
  properties: z.object({
    message: z.string(),
  }),
  configFile: __dirname + '/access-data-from-arguments.workflow.yaml',
})
export class AccessDataFromArgumentsWorkflow extends Workflow {}
