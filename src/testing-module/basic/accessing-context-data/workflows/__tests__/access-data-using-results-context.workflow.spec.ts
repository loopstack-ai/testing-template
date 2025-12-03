import {
  CreateChatMessage,
  CreateValue, getToolResult,
  WorkflowTestBuilder,
} from '@loopstack/core';
import { createTestingModule } from '../../../../../../test/create-testing-module';
import { AccessDataUsingResultsContextWorkflow } from '../access-data-using-results-context.workflow';

describe('AccessDataUsingResultsContextWorkflow', () => {
  it('should execute workflow and produce correct results', async () => {
    const builder = new WorkflowTestBuilder(createTestingModule, AccessDataUsingResultsContextWorkflow)
      .withToolMock(CreateValue, [{ data: 'Hello World!' }])
      .withToolMock(CreateChatMessage);

    await builder.runWorkflow((workflow, test) => {
      // Should execute without errors
      expect(workflow).toBeDefined();
      expect(workflow.state.place).toBe('end');
      expect(workflow.state.stop).toBe(false);
      expect(workflow.state.error).toBe(false);

      // Should call CreateValue tool once and store result
      expect(test.getToolSpy(CreateValue)).toHaveBeenCalledTimes(1);
      expect(getToolResult(workflow, 'create_some_data', 'say_hello')).toMatchObject({
        data: 'Hello World!',
      });

      // Should have correct message from helper method
      expect(workflow['theMessage']).toContain('Hello World!');

      // Should call CreateChatMessage tool four times with correct data
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(4);
      expect(test.getToolSpy(CreateChatMessage).mock.calls).toEqual([
        [expect.objectContaining({ content: 'Data from specific call id: Hello World!' }), expect.anything(), expect.anything()],
        [expect.objectContaining({ content: 'Data from first tool call: Hello World!' }), expect.anything(), expect.anything()],
        [expect.objectContaining({ content: 'Data from transition id + tool call id: Hello World!' }), expect.anything(), expect.anything()],
        [expect.objectContaining({ content: 'Data access using custom helper: Hello World!' }), expect.anything(), expect.anything()],
      ]);
    });

    await builder.teardown();
  });
});
