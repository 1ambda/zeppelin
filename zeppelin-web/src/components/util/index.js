import { ErrorHandlerService } from './error-handler.service'
import { SortByKeyFilter } from './sort-by-key.filter'

angular.module('zeppelinWebApp')
  .service('ErrorHandlerService', ErrorHandlerService)
  .filter('sortByKey', SortByKeyFilter)
