import { BlockConfig, Workflow } from '@loopstack/common';
import { WorkspaceBase } from '@loopstack/core';
import { CustomToolExampleWorkflow } from './basic/custom-tools/workflows/custom-tool-example.workflow';
import { Injectable } from '@nestjs/common';
import { WorkflowArgumentsWorkflow } from './basic/workflow-arguments/workflow-arguments.workflow';
import { WorkflowStateWorkflow } from './basic/workflow-state/workflow-state.workflow';
import { DynamicRoutingExampleWorkflow } from './basic/dynamic-routing/dynamic-routing-example.workflow';
import { WorkflowToolResultsWorkflow } from './basic/workflow-tool-results/workflow-tool-results.workflow';

@Injectable()
@BlockConfig({
  config: {
    title: 'Testing Workspace',
  },
})
export class TestWorkspace extends WorkspaceBase {
  @Workflow() protected customToolExampleWorkflow: CustomToolExampleWorkflow;
  @Workflow() protected workflowArgumentsWorkflow: WorkflowArgumentsWorkflow;
  @Workflow() protected workflowStateWorkflow: WorkflowStateWorkflow;
  @Workflow() protected dynamicRoutingExampleWorkflow: DynamicRoutingExampleWorkflow;
  @Workflow() protected workflowToolResultsWorkflow: WorkflowToolResultsWorkflow;
}
