import { BlockConfig, HandlerCallResult } from '@loopstack/common';
import { Tool } from '@loopstack/core';
import { Expose } from 'class-transformer';

@BlockConfig({
  config: {
    description:
      'Counter tool with transient scope which will not actually count, since they don not maintain state. This is for demonstrations how transient tools work.',
  },
})
export class TransientCounterTool extends Tool {
  @Expose()
  count: number = 0;

  async execute(): Promise<HandlerCallResult> {
    this.count++; // this counter will not work since the service is transient
    return {
      data: this.count,
    };
  }
}
