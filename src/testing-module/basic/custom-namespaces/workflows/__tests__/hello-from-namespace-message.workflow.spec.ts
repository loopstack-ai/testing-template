import {
  CreateChatMessage,
  WorkflowTestBuilder,
} from '@loopstack/core';
import { createTestingModule } from '../../../../../../test/create-testing-module';
import { HelloFromNamespaceMessageWorkflow } from '../hello-from-namespace-message.workflow';
import { NamespaceEntity } from '@loopstack/common';

describe('HelloFromNamespaceMessageWorkflow', () => {
  it('should execute workflow and produce correct message from namespace', async () => {
    const builder = new WorkflowTestBuilder(createTestingModule, HelloFromNamespaceMessageWorkflow)
      .withToolMock(CreateChatMessage)
      .withContext({
        namespace: { name: 'TestNamespace' } as NamespaceEntity,
      });

    await builder.runWorkflow((workflow, test) => {
      // Should execute without errors
      expect(workflow).toBeDefined();
      expect(workflow.state.place).toBe('end');
      expect(workflow.state.stop).toBe(false);
      expect(workflow.state.error).toBe(false);

      // Should have correct message from getter
      expect(workflow['message']).toBe('Hello from namespace TestNamespace');

      // Should call CreateChatMessage tool once with correct content
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(1);
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'assistant',
          content: 'Hello from namespace TestNamespace',
        }),
        expect.anything(),
        expect.anything(),
      );
    });

    await builder.teardown();
  });
});