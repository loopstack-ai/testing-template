import { CreateChatMessage, WorkflowBase } from '@loopstack/core';
import { BlockConfig, Tool, WithArguments } from '@loopstack/common';
import { z } from 'zod';
import { Injectable } from '@nestjs/common';

@Injectable()
@BlockConfig({
  configFile: __dirname + '/workflow-arguments.workflow.yaml',
})
@WithArguments(z.object({
  message: z.string().default('Hello World.'),
}).strict())
export class WorkflowArgumentsWorkflow extends WorkflowBase {
  @Tool() private createChatMessage: CreateChatMessage;
}
