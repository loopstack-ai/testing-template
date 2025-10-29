import { ModuleRef } from '@nestjs/core';
import { Capability } from '@loopstack/shared';
import { CapabilityFactory } from '@loopstack/core';

@Capability()
export class TestModuleFactory extends CapabilityFactory {
  constructor(moduleRef: ModuleRef) {
    super(moduleRef);
  }
}