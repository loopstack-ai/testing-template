import {
  CreateChatMessage,
  WorkflowTestBuilder,
} from '@loopstack/core';
import { createTestingModule } from '../../../../../../test/create-testing-module';
import { ProcessItemWorkflow } from '../process-item.workflow';

describe('ProcessItemWorkflow', () => {
  it('should execute workflow and produce correct results', async () => {
    const builder = new WorkflowTestBuilder(createTestingModule, ProcessItemWorkflow)
      .withToolMock(CreateChatMessage)
      .withArgs({
        label: 'test-label',
        index: 0,
        item: 'test-item',
      });

    await builder.runWorkflow((workflow, test) => {
      // Should execute without errors
      expect(workflow).toBeDefined();
      expect(workflow.state.place).toBe('end');
      expect(workflow.state.stop).toBe(false);
      expect(workflow.state.error).toBe(false);

      // Should have correct index (1-based)
      expect(workflow.index).toBe(1);

      // Should have generated a unique id
      expect(workflow.uniqueId).toBeDefined();
      expect(typeof workflow.uniqueId).toBe('string');
      expect(workflow.uniqueId.length).toBe(6);

      // Should call CreateChatMessage tool once with correct content
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(1);
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'assistant',
          content: expect.stringContaining('Processing Item #1 test-item with label "test-label"'),
        }),
        expect.anything(),
        expect.anything()
      );
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining(`ID: ${workflow.uniqueId}`),
        }),
        expect.anything(),
        expect.anything()
      );
    });

    await builder.teardown();
  });
});