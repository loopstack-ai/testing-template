import {
  CreateChatMessage,
  WorkflowTestBuilder,
} from '@loopstack/core';
import { createTestingModule } from '../../../../../../test/create-testing-module';
import { AlwaysExecutedWorkflow } from '../always-executed.workflow';

describe('AlwaysExecutedWorkflow', () => {
  it('should execute workflow and produce correct message', async () => {
    const inputPath = 'A';

    const builder = new WorkflowTestBuilder(createTestingModule, AlwaysExecutedWorkflow)
      .withArgs({ inputPath })
      .withToolMock(CreateChatMessage);

    await builder.runWorkflow((workflow, test) => {
      // Should execute without errors
      expect(workflow).toBeDefined();
      expect(workflow.state.place).toBe('end');
      expect(workflow.state.stop).toBe(false);
      expect(workflow.state.error).toBe(false);

      // Should have correct message from getter
      expect(workflow.message).toBe(`The desired path is "${inputPath}"`);

      // Should call CreateChatMessage tool once with correct content
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(1);
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'assistant',
          content: `The desired path is "${inputPath}"`,
        }),
        expect.anything(),
        expect.anything(),
      );
    });
  });

  it('should handle empty inputPath', async () => {
    const builder = new WorkflowTestBuilder(createTestingModule, AlwaysExecutedWorkflow)
      .withArgs({ inputPath: '' })
      .withToolMock(CreateChatMessage);

    await builder.runWorkflow((workflow, test) => {
      expect(workflow.state.place).toBe('end');
      expect(workflow.message).toBe('The desired path is ""');

      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'The desired path is ""',
        }),
        expect.anything(),
        expect.anything(),
      );
    });
  });
});