import { InterpreterController } from './interpreter.controller'
import { InterpreterService } from './interpreter.service'
import { InterpreterNumberDirective } from './widget/number-widget.directive'
import { InterpreterItemDirective } from './interpreter-item.directive'

angular.module('zeppelinWebApp')
  .controller('InterpreterCtrl', InterpreterController)
  .service('InterpreterService', InterpreterService)
  .directive('numberWidget', InterpreterNumberDirective)
  .directive('interpreterItem', InterpreterItemDirective)
