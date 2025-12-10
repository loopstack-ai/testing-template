import { TestingModule } from '@nestjs/testing';
import { DynamicRoutingExampleWorkflow } from '../dynamic-routing-example.workflow';
import {
  BlockExecutionContextDto, CoreFeaturesModule,
  CreateChatMessage,
  createWorkflowTest,
  LoopCoreModule,
  SwitchTarget,
  ToolMock,
  WorkflowProcessorService,
} from '@loopstack/core';

describe('DynamicRoutingExampleWorkflow', () => {
  let module: TestingModule;
  let workflow: DynamicRoutingExampleWorkflow;
  let processor: WorkflowProcessorService;

  let mockSwitchTarget: ToolMock;
  let mockCreateChatMessage: ToolMock;

  beforeEach(async () => {
    module = await createWorkflowTest()
      .forWorkflow(DynamicRoutingExampleWorkflow)
      .withImports(LoopCoreModule, CoreFeaturesModule)
      .withToolOverride(SwitchTarget)
      .withToolOverride(CreateChatMessage)
      .compile();

    workflow = module.get(DynamicRoutingExampleWorkflow);
    processor = module.get(WorkflowProcessorService);

    mockSwitchTarget = module.get(SwitchTarget);
    mockCreateChatMessage = module.get(CreateChatMessage);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('initialization', () => {
    it('should be defined with correct tools and helpers', () => {
      expect(workflow).toBeDefined();
      expect(workflow.tools).toContain('switchTarget');
      expect(workflow.tools).toContain('createChatMessage');
      expect(workflow.helpers).toContain('gt');
      expect(workflow.helpers).toContain('selectRoute');
    });

    it('should apply default argument value', () => {
      const result = workflow.validate({});
      expect(result).toEqual({ value: 150 });
    });
  });

  describe('helpers', () => {
    it('gt should compare numbers correctly', () => {
      const gt = workflow.getHelper('gt')!;
      expect(gt.call(workflow, 101, 100)).toBe(true);
      expect(gt.call(workflow, 100, 100)).toBe(false);
    });

    it('selectRoute should return correct place', () => {
      const selectRoute = workflow.getHelper('selectRoute')!;
      expect(selectRoute.call(workflow, 201)).toBe('placeC');
      expect(selectRoute.call(workflow, 200)).toBe('placeD');
    });
  });

  describe('routing', () => {
    const context = new BlockExecutionContextDto({});


    it('should route to placeB when value <= 100', async () => {
      mockSwitchTarget.execute
        .mockResolvedValueOnce({
          effects: {
            setTransitionPlace: 'placeB',
          },
        })
        .mockResolvedValueOnce({
          effects: {
            setTransitionPlace: 'placeD',
          },
        });

      const result = await processor.process(workflow, { value: 50 }, context);

      expect(result.runtime.error).toBe(false);

      // Verify switchTarget called with correct target
      expect(mockSwitchTarget.execute).toHaveBeenCalledWith(
        { target: 'placeB' },
        expect.anything(), expect.anything()
      );

      // Verify history contains expected places
      const history = result.state.caretaker.getHistory();
      const places = history.map((h) => h.metadata?.place);
      expect(places).toContain('prepared');
      expect(places).toContain('placeB');
      expect(places).toContain('end');
      expect(places).not.toContain('placeA');
    });

    it('should route to placeC when value > 200', async () => {
      mockSwitchTarget.execute
        .mockResolvedValueOnce({
          effects: {
            setTransitionPlace: 'placeA',
          },
        })
        .mockResolvedValueOnce({
          effects: {
            setTransitionPlace: 'placeC',
          },
        });

      const result = await processor.process(workflow, { value: 250 }, context);

      expect(result.runtime.error).toBe(false);

      // Verify switchTarget calls with correct targets
      expect(mockSwitchTarget.execute).toHaveBeenNthCalledWith(
        1,
        { target: 'placeA' },
        expect.anything(), expect.anything()
      );
      expect(mockSwitchTarget.execute).toHaveBeenNthCalledWith(
        2,
        { target: 'placeC' },
        expect.anything(), expect.anything()
      );

      // Verify history contains expected places
      const history = result.state.caretaker.getHistory();
      const places = history.map((h) => h.metadata?.place);
      expect(places).toContain('prepared');
      expect(places).toContain('placeA');
      expect(places).toContain('placeC');
      expect(places).toContain('end');
      expect(places).not.toContain('placeB');
      expect(places).not.toContain('placeD');
    });

    it('should route to placeD when 100 < value <= 200', async () => {
      mockSwitchTarget.execute
        .mockResolvedValueOnce({
          effects: {
            setTransitionPlace: 'placeA',
          },
        })
        .mockResolvedValueOnce({
          effects: {
            setTransitionPlace: 'placeD',
          },
        });

      const result = await processor.process(workflow, { value: 150 }, context);

      expect(result.runtime.error).toBe(false);

      // Verify switchTarget calls with correct targets
      expect(mockSwitchTarget.execute).toHaveBeenNthCalledWith(
        1,
        { target: 'placeA' },
        expect.anything(), expect.anything()
      );
      expect(mockSwitchTarget.execute).toHaveBeenNthCalledWith(
        2,
        { target: 'placeD' },
        expect.anything(), expect.anything()
      );

      // Verify history contains expected places
      const history = result.state.caretaker.getHistory();
      const places = history.map((h) => h.metadata?.place);
      expect(places).toContain('prepared');
      expect(places).toContain('placeA');
      expect(places).toContain('placeD');
      expect(places).toContain('end');
      expect(places).not.toContain('placeB');
      expect(places).not.toContain('placeC');
    });
  });
});