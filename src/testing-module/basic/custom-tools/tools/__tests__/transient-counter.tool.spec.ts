import { Test, TestingModule } from '@nestjs/testing';
import { TransientCounterTool } from '../transient-counter.tool';

describe('TransientCounterTool', () => {
  let service: TransientCounterTool;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransientCounterTool],
    }).compile();

    service = await module.resolve<TransientCounterTool>(TransientCounterTool);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize count to 0', () => {
    expect(service.count).toBe(0);
  });

  it('should increment count on execute', async () => {
    const result = await service.execute();

    expect(result.data).toBe(1);
    expect(service.count).toBe(1);
  });

  it('should increment count multiple times', async () => {
    await service.execute();
    await service.execute();
    const result = await service.execute();

    expect(result.data).toBe(3);
    expect(service.count).toBe(3);
  });

  it('should return HandlerCallResult with count data', async () => {
    const result = await service.execute();

    expect(result).toHaveProperty('data');
    expect(typeof result.data).toBe('number');
  });
});
