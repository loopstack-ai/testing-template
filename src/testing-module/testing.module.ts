import { Module } from '@nestjs/common';
import { TestWorkspace } from './test-workspace';

@Module({
  providers: [
    TestWorkspace,
  ],
})
export class TestingModule {}
