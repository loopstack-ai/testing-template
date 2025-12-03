import {
  CreateChatMessage,
  WorkflowTestBuilder,
} from '@loopstack/core';
import { createTestingModule } from '../../../../../../test/create-testing-module';
import { AccessDataFromArgumentsWorkflow } from '../access-data-from-arguments.workflow';

describe('AccessDataFromArgumentsWorkflow', () => {
  it('should execute successfully with provided arguments', async () => {
    const builder = new WorkflowTestBuilder(createTestingModule, AccessDataFromArgumentsWorkflow)
      .withArgs({ message: 'Hello from arguments!' })
      .withToolMock(CreateChatMessage);

    await builder.runWorkflow((workflow, test) => {
      // Should execute with arguments
      expect(workflow).toBeDefined();
      expect(workflow.args).toMatchObject({ message: 'Hello from arguments!' });

      // Should call CreateChatMessage tool one time with correct data
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(1);
      expect(test.getToolSpy(CreateChatMessage).mock.calls).toEqual([
        [expect.objectContaining({ content: 'Data from arguments: Hello from arguments!' }), expect.anything(), expect.anything()],
      ]);
    });

    await builder.teardown();
  });
});
