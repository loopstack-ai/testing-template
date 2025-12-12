import { Module } from '@nestjs/common';
import { LoopCoreModule } from '@loopstack/core';
import { TestWorkspace } from './test-workspace';
import { CoreUiModule } from '@loopstack/core-ui-module';
// import { CoreToolsModule } from '@loopstack/core-tools-module';
// import { DynamicRoutingExampleWorkflow } from '../@loopstack/dynamic-routing-example-workflow';
// import { WorkflowStateWorkflow } from '../@loopstack/workflow-state-example-workflow/workflow-state.workflow';
// import { CustomToolModule } from '../@loopstack/custom-tool-example-module/custom-tool.module';
// import {
//   WorkflowToolResultsWorkflow
// } from '../@loopstack/accessing-tool-results-example-workflow/workflow-tool-results.workflow';


@Module({
  imports: [LoopCoreModule, CoreUiModule,
    // CustomToolModule
  ],
  providers: [
    TestWorkspace,
    // WorkflowStateWorkflow,
    // DynamicRoutingExampleWorkflow,
    // WorkflowToolResultsWorkflow,
  ],
})
export class TestingModule {}
