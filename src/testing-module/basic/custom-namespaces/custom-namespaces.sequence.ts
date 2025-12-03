import { BlockConfig } from '@loopstack/common';
import { Pipeline } from '@loopstack/core';
import { VegetablesSequence } from './vegetables/vegetables.sequence';
import { FruitsSequence } from './fruits/fruits.sequence';

@BlockConfig({
  imports: [VegetablesSequence, FruitsSequence],
  configFile: __dirname + '/custom-namespaces.sequence.yaml',
})
export class CustomNamespacesSequence extends Pipeline {}
