import { TestingModule } from '@nestjs/testing';
import {
  BlockExecutionContextDto, CoreFeaturesModule,
  CreateChatMessage,
  createWorkflowTest,
  LoopCoreModule,
  ToolMock,
  WorkflowProcessorService,
} from '@loopstack/core';
import { WorkflowArgumentsWorkflow } from '../workflow-arguments.workflow';

describe('WorkflowArgumentsWorkflow', () => {
  let module: TestingModule;
  let workflow: WorkflowArgumentsWorkflow;
  let processor: WorkflowProcessorService;
  let mockCreateChatMessage: ToolMock;

  beforeEach(async () => {
    module = await createWorkflowTest()
      .forWorkflow(WorkflowArgumentsWorkflow)
      .withImports(LoopCoreModule, CoreFeaturesModule)
      .withToolOverride(CreateChatMessage)
      .compile();

    workflow = module.get(WorkflowArgumentsWorkflow);
    processor = module.get(WorkflowProcessorService);
    mockCreateChatMessage = module.get(CreateChatMessage);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(workflow).toBeDefined();
  });

  it('should validate arguments', () => {
    expect(workflow.validate({ message: 'hello' })).toEqual({ message: 'hello' });
    expect(workflow.validate({})).toEqual({ message: 'Hello World.' }); // default
    expect(() => workflow.validate({ message: 123 })).toThrow();
  });

  it('should pass arguments to tool calls', async () => {
    const context = new BlockExecutionContextDto({});

    await processor.process(workflow, { message: 'Hello World' }, context);

    expect(mockCreateChatMessage.execute).toHaveBeenCalledTimes(2);

    // First call - direct expression syntax
    expect(mockCreateChatMessage.execute).toHaveBeenNthCalledWith(
      1,
      { role: 'assistant', content: 'Hello World' },
      expect.anything(), expect.anything()
    );

    // Second call - template syntax
    expect(mockCreateChatMessage.execute).toHaveBeenNthCalledWith(
      2,
      { role: 'assistant', content: 'Data from arguments: Hello World' },
      expect.anything(), expect.anything()
    );
  });
});