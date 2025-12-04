import { TransientCounterTool } from '../transient-counter.tool';
import {
  createToolTestingContext,
} from '@loopstack/core';
import { TestingModule } from '@nestjs/testing';

describe('Tool: TransientCounterTool', () => {
  let module: TestingModule;
  let createToolInstance: (args?: any, ctx?: any) => Promise<TransientCounterTool>;

  beforeAll(async () => {
    const ctx = await createToolTestingContext(TransientCounterTool);
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
    let tool: TransientCounterTool;

    beforeAll(async () => {
      tool = await createToolInstance();
    });

    it('tool should be defined', async () => {
      expect(tool).toBeInstanceOf(TransientCounterTool);
    });

    it('should have metadata attached', () => {
      expect(tool.metadata).toBeDefined();
    });
  });

  describe('Result', () => {
    it('should initialize count to 0', async () => {
      const tool = await createToolInstance();
      expect(tool.count).toBe(0);
    });

    it('should not increment count multiple times', async () => {
      const tool = await createToolInstance();
      await tool.execute();

      const tool2 = await createToolInstance();
      const result = await tool2.execute();

      expect(result.data).toBe(1);
      expect(tool.count).toBe(1);
    });

    it('should return HandlerCallResult with count data', async () => {
      const tool = await createToolInstance();
      const result = await tool.execute();

      expect(result).toHaveProperty('data');
      expect(typeof result.data).toBe('number');
    });
  });
});