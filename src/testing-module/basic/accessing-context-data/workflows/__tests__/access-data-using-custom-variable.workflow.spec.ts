import {
  CreateChatMessage,
  CreateValue, getToolResult,
  WorkflowTestBuilder,
} from '@loopstack/core';
import { createTestingModule } from '../../../../../../test/create-testing-module';
import { AccessDataUsingCustomVariableWorkflow } from '../access-data-using-custom-variable.workflow';

describe('AccessDataUsingCustomVariableWorkflow', () => {
  it('should execute workflow and produce correct results', async () => {
    const builder = new WorkflowTestBuilder(createTestingModule, AccessDataUsingCustomVariableWorkflow)
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

      // Should have correct message from class property and helper method
      expect(workflow['message']).toBe('Hello World!');
      expect(workflow['messageInUpperCase']).toBe('HELLO WORLD!');

      // Should call CreateChatMessage tool four times with correct data
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(2);
      expect(test.getToolSpy(CreateChatMessage).mock.calls).toEqual([
        [expect.objectContaining({ content: 'Data from block property: Hello World!' }), expect.anything(), expect.anything()],
        [expect.objectContaining({ content: 'Data from custom workflow helper method: HELLO WORLD!' }), expect.anything(), expect.anything()],
      ]);
    });

    await builder.teardown();
  });

  it('should handle empty message property gracefully', async () => {
    const builderWithoutMock = new WorkflowTestBuilder(createTestingModule, AccessDataUsingCustomVariableWorkflow)
      .withToolMock(CreateValue, [{ data: '' }]);

    await builderWithoutMock.runWorkflow((workflow) => {
      expect(workflow['message']).toBe('');
      expect(workflow['messageInUpperCase']).toBe('');
    });

    await builderWithoutMock.teardown();
  });

  it('should handle undefined message property', async () => {
    const builderWithUndefined = new WorkflowTestBuilder(createTestingModule, AccessDataUsingCustomVariableWorkflow)
      .withToolMock(CreateValue, [{ data: undefined }]);

    await builderWithUndefined.runWorkflow((workflow) => {
      expect(workflow['message']).toBeUndefined();
      expect(workflow['messageInUpperCase']).toBeUndefined();
    });

    await builderWithUndefined.teardown();
  });
});
