import { BlockConfig } from '@loopstack/common';
import { Workspace } from '@loopstack/core';
import { FactoryExampleFactory } from './basic/factory-pattern/factory-example.factory';
import { CustomToolExampleWorkflow } from './basic/custom-tools/workflows/custom-tool-example.workflow';
import { ContextDataExampleSequence } from './basic/accessing-context-data/context-data-example.sequence';
import { DynamicRoutingExampleWorkflow } from './basic/dynamic-routing/dynamic-routing-example.workflow';
import {
  ConditionalPipelineExampleSequence
} from './basic/conditional-pipeline/conditional-pipeline-example.sequence';
import { CustomNamespacesSequence } from './basic/custom-namespaces/custom-namespaces.sequence';
import { ClassPropertyAccessWorkflow } from './basic/class-property-access/class-property-access.workflow';

@BlockConfig({
  imports: [
    ContextDataExampleSequence,
    FactoryExampleFactory,
    CustomToolExampleWorkflow,
    DynamicRoutingExampleWorkflow,
    ConditionalPipelineExampleSequence,
    CustomNamespacesSequence,
    ClassPropertyAccessWorkflow,
  ],
  config: {
    title: 'Testing Workspace'
  },
})
export class TestWorkspace extends Workspace {}