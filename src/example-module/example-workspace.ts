import { BlockConfig } from '@loopstack/shared';
import { Workspace } from '@loopstack/core';
import { PromptWorkflow } from './llm/prompt-example/prompt.workflow';
import { ChatWorkflow } from './llm/chat-example/chat.workflow';
import { PromptStructuredDataWorkflow } from './llm/prompt-structured-data-example/prompt-structured-data.workflow';
import { ToolCallWorkflow } from './llm/tool-call-example/tool-call.workflow';

@BlockConfig({
  imports: [
    PromptWorkflow,
    ChatWorkflow,
    PromptStructuredDataWorkflow,
    ToolCallWorkflow,
  ],
  config: {
    title: 'Examples Workspace'
  },
})
export class ExampleWorkspace extends Workspace {}