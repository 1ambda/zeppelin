describe('RepositoryComponent', () => {
  let $componentController
  let $httpBackend
  let API_PREFIX = 'http://localhost:9002/context.html/api'

  beforeEach(angular.mock.module('zeppelinWebApp'))
  beforeEach(angular.mock.inject((_$componentController_, _$httpBackend_) => {
    $componentController = _$componentController_
    $httpBackend = _$httpBackend_
  }))

  it('should get repositories initially', () => {
    const mockRepos = getMockRepositories()
    const bindings = { show: true, }
    const ctrl = $componentController('repositoryView', null, bindings)
    ctrl.$onInit()

    $httpBackend
      .when('GET', `${API_PREFIX}/interpreter/repository`)
      .respond(200, { body: mockRepos, })
    $httpBackend.flush()

    expect(ctrl.repositories).toEqual(mockRepos)

    checkInvalidHttpCalls()
  })

  function checkInvalidHttpCalls() {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  }

  function getMockRepositories() {
    return [
      {
        'id': 'central',
        'type': 'default',
        'url': 'http: //repo1.maven.org/maven2/',
        'releasePolicy': {'enabled': true, 'updatePolicy': 'daily', 'checksumPolicy': 'warn'},
        'snapshotPolicy': {'enabled': true, 'updatePolicy': 'daily', 'checksumPolicy': 'warn'},
        'mirroredRepositories': [], 'repositoryManager': false
      },
      {
        'id': 'local',
        'type': 'default',
        'url': 'file: ///Users/1ambda/.m2/repository',
        'releasePolicy': {'enabled': true, 'updatePolicy': 'daily', 'checksumPolicy': 'warn'},
        'snapshotPolicy': {'enabled': true, 'updatePolicy': 'daily', 'checksumPolicy': 'warn'},
        'mirroredRepositories': [], 'repositoryManager': false
      },
    ]
  }
})
