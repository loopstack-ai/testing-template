import {
  CreateChatMessage,
  getToolResult,
  WorkflowTestBuilder,
} from '@loopstack/core';
import { MathSumTool } from '../../tools/math-sum.tool';
import { createTestingModule } from '../../../../../../test/create-testing-module';
import { TransientCounterTool } from '../../tools/transient-counter.tool';
import { SingletonCounterTool } from '../../tools/singleton-counter.tool';
import { CustomToolExampleWorkflow } from '../custom-tool-example.workflow';

describe('CustomToolExampleWorkflow', () => {
  it('should execute workflow and produce correct results', async () => {
    const builder = new WorkflowTestBuilder(createTestingModule, CustomToolExampleWorkflow)
      .withArgs({ a: 1, b: 4 })
      .withToolMock(MathSumTool, [{ data: 99 }])
      .withToolMock(TransientCounterTool, [{ data: 1 }])
      .withToolMock(SingletonCounterTool, [
        { data: 1 },
        { data: 2 },
        { data: 3 },
      ])
      .withToolMock(CreateChatMessage);

    await builder.runWorkflow((workflow, test) => {
      // Should execute without errors
      expect(workflow).toBeDefined();
      expect(workflow.state.place).toBe('end');
      expect(workflow.state.stop).toBe(false);
      expect(workflow.state.error).toBe(false);

      // Should execute with args
      expect(workflow.args).toMatchObject({ a: 1, b: 4 });

      // Getter method calculate should calculate correctly
      expect(workflow.calculate).toBe(5);

      // Should call MathSumTool and store results
      expect(test.getToolSpy(MathSumTool)).toHaveBeenCalledTimes(1);
      expect(getToolResult(workflow, 'calculate', 'calculation')).toMatchObject({
        data: 99,
      });

      // Should call StatelessCounterTool and store results
      expect(test.getToolSpy(TransientCounterTool)).toHaveBeenCalledTimes(3);
      expect(getToolResult(workflow, 'calculate', 'count3')).toMatchObject({
        data: 1,
      });

      // Should call StatefulCounterTool and store results
      expect(test.getToolSpy(SingletonCounterTool)).toHaveBeenCalledTimes(3);
      expect(getToolResult(workflow, 'calculate', 'count6')).toMatchObject({
        data: 3,
      });

      // Should call CreateChatMessage tool four times with correct data
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(4);
      expect(test.getToolSpy(CreateChatMessage).mock.calls).toEqual([
        [expect.objectContaining({ content: expect.stringContaining('1 + 4 = 99') }), expect.anything(),
          expect.anything()],
        [expect.objectContaining({ content: expect.stringContaining('1 + 4 = 5') }), expect.anything(),
          expect.anything()],
        [expect.objectContaining({ content: expect.stringContaining('> 1\n> 1\n> 1') }), expect.anything(),
          expect.anything()],
        [expect.objectContaining({ content: expect.stringContaining('> 1\n> 2\n> 3') }), expect.anything(),
          expect.anything()],
      ]);
    });

    await builder.teardown();
  });
});
