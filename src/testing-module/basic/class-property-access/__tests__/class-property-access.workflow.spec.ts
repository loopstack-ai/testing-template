import {
  CreateChatMessage,
  WorkflowTestBuilder,
} from '@loopstack/core';
import { ClassPropertyAccessWorkflow } from '../class-property-access.workflow';
import { createTestingModule } from '../../../../../test/create-testing-module';

describe('ClassPropertyAccessWorkflow', () => {
  it('should execute workflow and access exposed properties correctly', async () => {
    const builder = new WorkflowTestBuilder(createTestingModule, ClassPropertyAccessWorkflow)
      .withToolMock(CreateChatMessage);

    await builder.runWorkflow((workflow, test) => {
      // Should execute without errors
      expect(workflow).toBeDefined();
      expect(workflow.state.place).toBe('end');
      expect(workflow.state.stop).toBe(false);
      expect(workflow.state.error).toBe(false);

      // Should have correct values for exposed properties
      expect(workflow['accessibleProperty']).toBe(true);
      expect(workflow['exposedGetter']).toBe(true);

      // Should have correct values for context-specific properties
      expect(workflow['workflowContextProperty']).toBe(true);
      expect(workflow['toolContextProperty']).toBe(true);

      // Should have excluded property (still exists on class, just not serialized)
      expect(workflow['notAccessibleProperty']).toBe(true);

      // Should call CreateChatMessage with template expressions resolved
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(1);
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'assistant',
          content: expect.stringContaining('Exposed Property: true'),
        }),
        expect.anything(),
        expect.anything(),
      );

      // should resolve exposed getter method in template
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('Exposed Getter Method: true'),
        }),
        expect.anything(),
        expect.anything(),
      );

      // should not expose excluded properties in templates
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.not.stringContaining('Not Exposed Property: true'),
        }),
        expect.anything(),
        expect.anything(),
      );

      // should not resolve workflow context properties in templates
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.not.stringContaining('Workflow Context Property: true'),
        }),
        expect.anything(),
        expect.anything(),
      );

      // should resolve tool context properties in templates
      expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('Tool Context Property: true'),
        }),
        expect.anything(),
        expect.anything(),
      );
    });

    await builder.teardown();
  });
});