import { Module } from '@nestjs/common';
import { CoreToolsModule, LoopCoreModule } from '@loopstack/core';
import { ModuleFactory } from '@loopstack/shared';
import { ExampleModuleFactoryService } from './example-module-factory.service';
import { LlmModule } from '@loopstack/llm';
import { ExampleWorkspace } from './example-workspace';
import { PromptWorkflow } from './llm/prompt-example/prompt.workflow';
import { ChatWorkflow } from './llm/chat-example/chat.workflow';
import { PromptStructuredDataWorkflow } from './llm/prompt-structured-data-example/prompt-structured-data.workflow';
import { FileDocument } from './llm/prompt-structured-data-example/documents/file-document';
import { GetWeather } from './llm/tool-call-example/tools/get-weather.tool';
import { ToolCallWorkflow } from './llm/tool-call-example/tool-call.workflow';

@Module({
  imports: [
    LoopCoreModule,
    CoreToolsModule,
    LlmModule
  ],
  providers: [
    ExampleWorkspace,
    PromptWorkflow,
    ChatWorkflow,

    PromptStructuredDataWorkflow,
    FileDocument,

    GetWeather,
    ToolCallWorkflow,

    ExampleModuleFactoryService,
  ],
  exports: [
    ExampleModuleFactoryService
  ]
})
@ModuleFactory(ExampleModuleFactoryService)
export class ExampleModule {}

