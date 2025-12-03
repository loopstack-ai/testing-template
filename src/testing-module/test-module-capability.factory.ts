import { ModuleRef } from '@nestjs/core';
import { BaseCapabilityFactory } from '@loopstack/core';
import { CapabilityFactory } from '@loopstack/common';

@CapabilityFactory('TestingModule')
export class TestingModuleCapabilityFactory extends BaseCapabilityFactory {
  constructor(moduleRef: ModuleRef) {
    super(moduleRef);
  }
}
