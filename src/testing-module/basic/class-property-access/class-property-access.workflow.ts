import { CreateChatMessage, Workflow } from '@loopstack/core';
import { BlockConfig } from '@loopstack/common';
import { Exclude, Expose } from 'class-transformer';

@BlockConfig({
  imports: [CreateChatMessage],
  configFile: __dirname + '/class-property-access.workflow.yaml',
})
export class ClassPropertyAccessWorkflow extends Workflow  {

  // default: property is accessible
  @Expose()
  accessibleProperty = true;

  // not accessible property
  @Exclude()
  notAccessibleProperty = true;

  // property only accessible in workflow context
  @Expose({ groups: ['workflow'] })
  workflowContextProperty = true;

  // property accessible in tool and workflow context
  @Expose({ groups: ['tool' , 'workflow'] })
  toolContextProperty = true;

  // accessible getter methods
  @Expose()
  get exposedGetter() {
    return true;
  }
}