import { BlockConfig } from '@loopstack/common';
import { Pipeline } from '@loopstack/core';
import { HelloFromNamespaceMessageWorkflow } from '../workflows/hello-from-namespace-message.workflow';

@BlockConfig({
  imports: [HelloFromNamespaceMessageWorkflow],
  configFile: __dirname + '/fruits.sequence.yaml',
})
export class FruitsSequence extends Pipeline {}
