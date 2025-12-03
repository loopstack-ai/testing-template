import {
  CreateChatMessage,
  WorkflowTestBuilder,
} from '@loopstack/core';
import { createTestingModule } from '../../../../../../test/create-testing-module';
import { ConditionalPathBWorkflow } from '../conditional-path-b.workflow';

describe('ConditionalPathBWorkflow', () => {
  it('should execute workflow and create message with path A content', async () => {
    const builder = new WorkflowTestBuilder(createTestingModule, ConditionalPathBWorkflow)
      .withToolMock(CreateChatMessage);

    await builder.runWorkflow((workflow, test) => {
      // Should execute without errors
      expect(workflow).toBeDefined();
      expect(workflow.state.place).toBe('end');
      expect(workflow.state.stop).toBe(false);
      expect(workflow.state.error).toBe(false);

      // Should have correct message from getter
      expect(workflow.message).toBe('This is a path B message');

      // Should call CreateChatMessage tool once with correct content
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(1);
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'assistant',
          content: 'This is a path B message',
        }),
        expect.anything(),
        expect.anything(),
      );
    });

    await builder.teardown();
  });
});