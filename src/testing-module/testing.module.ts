import { Module } from '@nestjs/common';
import { CoreFeaturesModule, LoopCoreModule } from '@loopstack/core';
import { MathSumTool } from './basic/custom-tools/tools/math-sum.tool';
import { CustomToolExampleWorkflow } from './basic/custom-tools/workflows/custom-tool-example.workflow';
import { DynamicRoutingExampleWorkflow } from './basic/dynamic-routing/dynamic-routing-example.workflow';
import { MathService } from './basic/custom-tools/services/math.service';
import { TestWorkspace } from './test-workspace';
import { WorkflowArgumentsWorkflow } from './basic/workflow-arguments/workflow-arguments.workflow';
import { WorkflowStateWorkflow } from './basic/workflow-state/workflow-state.workflow';
import { WorkflowToolResultsWorkflow } from './basic/workflow-tool-results/workflow-tool-results.workflow';
import { CounterTool } from './basic/custom-tools/tools/counter.tool';

@Module({
  imports: [LoopCoreModule, CoreFeaturesModule],
  providers: [
    TestWorkspace,
    CustomToolExampleWorkflow,
    WorkflowArgumentsWorkflow,
    WorkflowStateWorkflow,
    DynamicRoutingExampleWorkflow,
    WorkflowToolResultsWorkflow,

    MathSumTool,
    CounterTool,
    MathService,
  ],
})
export class TestingModule {}
