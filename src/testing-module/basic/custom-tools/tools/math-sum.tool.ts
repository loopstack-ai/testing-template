import { BlockConfig, HandlerCallResult } from '@loopstack/common';
import { TemplateExpression } from '@loopstack/contracts/schemas';
import { z } from 'zod';
import { Tool } from '@loopstack/core';
import { MathService } from '../services/math.service';

const propertiesSchema = z.object({
  a: z.number(),
  b: z.number()
});

const NumberOrTemplateExpression = z.union([
  TemplateExpression,   // allow template expression instead of actual value
  z.number(),           // allow actual value
]);

const configSchema = z.object({
  a: NumberOrTemplateExpression,
  b: NumberOrTemplateExpression,
});

@BlockConfig({
  config: {
    description: 'Math tool accepting arguments and using another injected service.',
  },

  // schema for argument validation
  properties: propertiesSchema,

  // schema to validate configuration in workflow
  configSchema: configSchema,
})
export class MathSumTool extends Tool {

  constructor(private mathService: MathService) {   // inject service using constructor
    super();                                        // must contain super call
  }

  async execute(): Promise<HandlerCallResult> {

    const sum = this.mathService.sum(this.args.a, this.args.b);

    return {
      data: sum
    };
  }
}
