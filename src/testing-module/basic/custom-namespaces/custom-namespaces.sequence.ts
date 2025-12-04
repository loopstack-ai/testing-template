import { BlockConfig } from '@loopstack/common';
import { Pipeline } from '@loopstack/core';
import { VegetablesSequence } from './vegetables/vegetables.sequence';
import { FruitsSequence } from './fruits/fruits.sequence';
import { HelloFromNamespaceMessageWorkflow } from './workflows/hello-from-namespace-message.workflow';

@BlockConfig({
  imports: [HelloFromNamespaceMessageWorkflow, VegetablesSequence, FruitsSequence],
  configFile: __dirname + '/custom-namespaces.sequence.yaml',
})
export class CustomNamespacesSequence extends Pipeline {}
