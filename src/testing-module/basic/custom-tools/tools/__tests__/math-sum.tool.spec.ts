import { MathService } from '../../services/math.service';
import { MathSumTool } from '../math-sum.tool';
import {
  createToolTestingContext,
  describeSchemaTests,
  Tool,
} from '@loopstack/core';
import { TestingModule } from '@nestjs/testing';

describe('Tool: MathSumTool', () => {
  let module: TestingModule;
  let createToolInstance: (args: any, ctx?: any) => Promise<MathSumTool>;
  let mockMathService: jest.Mocked<Pick<MathService, 'sum'>>;

  beforeAll(async () => {
    mockMathService = { sum: jest.fn() };
    const ctx = await createToolTestingContext(MathSumTool, [
      { provide: MathService, mock: mockMathService },
    ]);
    module = ctx.module;
    createToolInstance = ctx.createTool;
  });

  afterAll(async () => {
    await module?.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Block Metadata', () => {
    let tool: MathSumTool;

    beforeAll(async () => {
      tool = await createToolInstance({ a: 5, b: 10 });
    });

    it('tool should be defined', async () => {
      expect(tool).toBeInstanceOf(MathSumTool);
    });

    it('should have metadata attached', () => {
      expect(tool.metadata).toBeDefined();
    });

    it('should have properties schema', () => {
      expect(tool.metadata.properties).toBeDefined();
    });

    it('should have config schema', () => {
      expect(tool.metadata.configSchema).toBeDefined();
    });
  });

  describe('Properties Schema', () => {
    let tool: Tool;

    beforeAll(async () => {
      tool = await createToolInstance({ a: 5, b: 10 });
    });

    describeSchemaTests(() => tool.metadata.properties!, [
      {
        description: 'should not allow additional properties',
        args: { a: 5, b: 10, test: 1 },
        shouldPass: false,
      },
      {
        description: 'should accept valid number inputs',
        args: { a: 5, b: 10 },
        shouldPass: true,
      },
      {
        description: 'should accept zero values',
        args: { a: 0, b: 0 },
        shouldPass: true,
      },
      {
        description: 'should accept negative numbers',
        args: { a: -5, b: -10 },
        shouldPass: true,
      },
      {
        description: 'should accept decimal numbers',
        args: { a: 1.5, b: 2.5 },
        shouldPass: true,
      },
      {
        description: 'should reject string for a',
        args: { a: 'not a number', b: 2 },
        shouldPass: false,
      },
      {
        description: 'should reject string for b',
        args: { a: 1, b: 'not a number' },
        shouldPass: false,
      },
      {
        description: 'should reject missing a',
        args: { b: 2 },
        shouldPass: false,
      },
      {
        description: 'should reject missing b',
        args: { a: 1 },
        shouldPass: false,
      },
      {
        description: 'should reject no arguments',
        args: undefined,
        shouldPass: false,
      },
    ]);
  });

  describe('Config Schema', () => {
    let tool: Tool;

    beforeAll(async () => {
      tool = await createToolInstance({ a: 5, b: 10 });
    });

    describeSchemaTests(() => tool.metadata.configSchema!, [
      {
        description: 'should not allow additional properties',
        args: { a: 5, b: 10, test: 1 },
        shouldPass: false,
      },
      {
        description: 'should reject no arguments',
        args: undefined,
        shouldPass: false,
      },
      {
        description: 'should reject missing a',
        args: { b: 2 },
        shouldPass: false,
      },
      {
        description: 'should reject missing b',
        args: { a: 1 },
        shouldPass: false,
      },
      {
        description: 'should accept number values',
        args: { a: 5, b: 10 },
        shouldPass: true,
      },
      {
        description: 'should accept template expressions for a',
        args: { a: '${ someValue }', b: 10 },
        shouldPass: true,
      },
      {
        description: 'should accept template expressions for b',
        args: { a: 5, b: '${ someValue }' },
        shouldPass: true,
      },
      {
        description: 'should accept template expressions for both',
        args: { a: '${ valueA }', b: '${ valueB }' },
        shouldPass: true,
      },
    ]);
  });

  describe('Arguments', () => {
    let tool: Tool;

    beforeAll(async () => {
      tool = await createToolInstance({ a: 5, b: 10 });
    });

    it('should have correct arguments', async () => {
      expect(tool.args).toEqual({ a: 5, b: 10 });
    });
  });

  describe('Result', () => {
    it('should call MathService.sum with correct arguments', async () => {
      mockMathService.sum.mockReturnValue(15);

      const tool = await createToolInstance({ a: 5, b: 10 });
      await tool.execute();

      expect(mockMathService.sum).toHaveBeenCalledTimes(1);
      expect(mockMathService.sum).toHaveBeenCalledWith(5, 10);
    });

    it('should return the sum from MathService', async () => {
      mockMathService.sum.mockReturnValue(15);

      const tool = await createToolInstance({ a: 5, b: 10 });
      const result = await tool.execute();

      expect(result.data).toBe(15);
    });
  });

  describe('Dependency Injection', () => {
    it('should have MathService injected', async () => {
      const mathService = module.get(MathService);
      expect(mathService).toBe(mockMathService);
    });

    it('should use injected MathService for calculations', async () => {
      const customResult = 999;
      mockMathService.sum.mockReturnValue(customResult);

      const tool = await createToolInstance({ a: 1, b: 1 });
      const result = await tool.execute();

      expect(result.data).toBe(customResult);
    });
  });
});