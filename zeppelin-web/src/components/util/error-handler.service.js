/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class ErrorHandlerService {
  constructor(ngToast, baseUrlSrv) {
    'ngInject'

    this.toast = ngToast
    this.BaseUrlService = baseUrlSrv
  }

  handleHttpError(defaultMessage) {
    return (response) => {
      const status = response.status
      let message = defaultMessage

      if (response.data && response.data.message) {
        message = response.data.message
      }

      if (status === 401) {
        this.toast.danger({
          content: 'You don\'t have permission on this page',
          verticalPosition: 'bottom',
          timeout: '3000'
        })
        setTimeout( () => { window.location = this.BaseUrlService.getBase() }, 3000)
      } else {
        this.toast.danger({
          content: message,
          verticalPosition: 'bottom',
          timeout: '3000'
        })
      }

      console.log('Error %o %o', status, message)
    }
  }
}
