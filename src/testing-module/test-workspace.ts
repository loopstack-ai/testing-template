import { BlockConfig, Workflow } from '@loopstack/common';
import { WorkspaceBase } from '@loopstack/core';
import { Injectable } from '@nestjs/common';
import { TestUiDocumentsWorkflow } from '@loopstack/core-ui-module';
// import { DynamicRoutingExampleWorkflow } from '../@loopstack/dynamic-routing-example-workflow';
// import { WorkflowStateWorkflow } from '../@loopstack/workflow-state-example-workflow/workflow-state.workflow';
// import {
//   CustomToolExampleWorkflow
// } from '../@loopstack/custom-tool-example-module/workflows/custom-tool-example.workflow';
// import {
//   WorkflowToolResultsWorkflow
// } from '../@loopstack/accessing-tool-results-example-workflow/workflow-tool-results.workflow';

@Injectable()
@BlockConfig({
  config: {
    title: 'Testing Workspace',
  },
})
export class TestWorkspace extends WorkspaceBase {
  // @Workflow() protected customToolExampleWorkflow: CustomToolExampleWorkflow;
  // @Workflow() protected workflowStateWorkflow: WorkflowStateWorkflow;
  // @Workflow()
  // protected dynamicRoutingExampleWorkflow: DynamicRoutingExampleWorkflow;
  // @Workflow()
  // protected workflowToolResultsWorkflow: WorkflowToolResultsWorkflow;
  @Workflow() protected testUiDocumentsWorkflow: TestUiDocumentsWorkflow;
}
