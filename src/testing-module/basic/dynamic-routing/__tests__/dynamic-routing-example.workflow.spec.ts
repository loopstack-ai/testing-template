import {
  CreateChatMessage,
  SwitchTarget,
  WorkflowTestBuilder,
} from '@loopstack/core';
import { DynamicRoutingExampleWorkflow } from '../dynamic-routing-example.workflow';
import { createTestingModule } from '../../../../../test/create-testing-module';

describe('DynamicRoutingExampleWorkflow', () => {
  describe('when myValue > 200', () => {
    it('should route through placeA -> placeC -> end', async () => {
      const builder = new WorkflowTestBuilder(createTestingModule, DynamicRoutingExampleWorkflow)
        .withArgs({ value: 250 })
        .withToolMock(SwitchTarget, [
          {
            effects: {
              setTransitionPlace: 'placeA',
            },
          },
          {
            effects: {
              setTransitionPlace: 'placeC',
            },
          }
        ])
        .withToolMock(CreateChatMessage);

      await builder.runWorkflow((workflow, test) => {
        // Should execute without errors
        expect(workflow).toBeDefined();
        expect(workflow.state.place).toBe('end');
        expect(workflow.state.stop).toBe(false);
        expect(workflow.state.error).toBe(false);

        // Should provide the correct values
        expect(workflow.args.value).toBe(250);
        expect(workflow['routeGt200']).toBe('placeC');

        // Should call SwitchTarget twice (router + value_gt_100)
        expect(test.getToolSpy(SwitchTarget)).toHaveBeenCalledTimes(2);
        expect(test.getToolSpy(SwitchTarget).mock.calls[0]).toEqual([
          expect.objectContaining({ target: 'placeA' }),
          expect.anything(),
          expect.anything(),
        ]);
        expect(test.getToolSpy(SwitchTarget).mock.calls[1]).toEqual([
          expect.objectContaining({ target: 'placeC' }),
          expect.anything(),
          expect.anything(),
        ]);

        // Should call CreateChatMessage twice (create_mock_data + value_gt_200)
        expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(2);
        expect(test.getToolSpy(CreateChatMessage).mock.calls).toEqual([
          [expect.objectContaining({ content: 'Analysing value = 250' }), expect.anything(),
            expect.anything()],
          [expect.objectContaining({ content: 'Value is greater than 200' }), expect.anything(),
            expect.anything()],
        ]);
      });

      await builder.teardown();
    });
  });

  describe('when 100 < myValue <= 200', () => {
    it('should route through placeA -> placeD -> end', async () => {
      const builder = new WorkflowTestBuilder(createTestingModule, DynamicRoutingExampleWorkflow)
        .withArgs({ value: 150 })
        .withToolMock(SwitchTarget, [
          {
            effects: {
              setTransitionPlace: 'placeA',
            },
          },
          {
            effects: {
              setTransitionPlace: 'placeD',
            },
          }
        ])
        .withToolMock(CreateChatMessage);

      await builder.runWorkflow((workflow, test) => {
        // Should execute without errors
        expect(workflow).toBeDefined();
        expect(workflow.state.place).toBe('end');
        expect(workflow.state.stop).toBe(false);
        expect(workflow.state.error).toBe(false);

        // Should have correct myValue
        expect(workflow.args.value).toBe(150);
        expect(workflow['routeGt200']).toBe('placeD');

        // Should call SwitchTarget twice
        expect(test.getToolSpy(SwitchTarget)).toHaveBeenCalledTimes(2);
        expect(test.getToolSpy(SwitchTarget).mock.calls[0]).toEqual([
          expect.objectContaining({ target: 'placeA' }),
          expect.anything(),
          expect.anything(),
        ]);
        expect(test.getToolSpy(SwitchTarget).mock.calls[1]).toEqual([
          expect.objectContaining({ target: 'placeD' }),
          expect.anything(),
          expect.anything(),
        ]);

        // Should call CreateChatMessage twice (create_mock_data + value_lte_200)
        expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(2);
        expect(test.getToolSpy(CreateChatMessage).mock.calls).toEqual([
          [expect.objectContaining({ content: 'Analysing value = 150' }), expect.anything(), expect.anything()],
          [expect.objectContaining({ content: 'Value is less or equal 200, but greater than 100' }), expect.anything(), expect.anything()],
        ]);
      });

      await builder.teardown();
    });
  });

  describe('when myValue <= 100', () => {
    it('should route through placeB -> end', async () => {
      const builder = new WorkflowTestBuilder(createTestingModule, DynamicRoutingExampleWorkflow)
        .withArgs({ value: 50 })
        .withToolMock(SwitchTarget, [
          {
            effects: {
              setTransitionPlace: 'placeB',
            },
          },
        ])
        .withToolMock(CreateChatMessage);

      await builder.runWorkflow((workflow, test) => {
        // Should execute without errors
        expect(workflow).toBeDefined();
        expect(workflow.state.place).toBe('end');
        expect(workflow.state.stop).toBe(false);
        expect(workflow.state.error).toBe(false);

        // Should have correct myValue
        expect(workflow.args.value).toBe(50);
        expect(workflow['routeGt200']).toBe('placeD');

        // Should call SwitchTarget once (router only)
        expect(test.getToolSpy(SwitchTarget)).toHaveBeenCalledTimes(1);
        expect(test.getToolSpy(SwitchTarget).mock.calls[0]).toEqual([
          expect.objectContaining({ target: 'placeB' }),
          expect.anything(),
          expect.anything(),
        ]);

        // Should call CreateChatMessage twice (create_mock_data + value_lte_100)
        expect(test.getToolSpy(CreateChatMessage)).toHaveBeenCalledTimes(2);
        expect(test.getToolSpy(CreateChatMessage).mock.calls).toEqual([
          [expect.objectContaining({ content: 'Analysing value = 50' }), expect.anything(),
            expect.anything()],
          [expect.objectContaining({ content: 'Value is less or equal 100' }), expect.anything(),
            expect.anything()],
        ]);
      });

      await builder.teardown();
    });
  });
});