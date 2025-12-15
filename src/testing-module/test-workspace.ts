import { BlockConfig } from '@loopstack/common';
import { WorkspaceBase } from '@loopstack/core';
import { Injectable } from '@nestjs/common';

@Injectable()
@BlockConfig({
  config: {
    title: 'Testing Workspace',
  },
})
export class TestWorkspace extends WorkspaceBase {}
