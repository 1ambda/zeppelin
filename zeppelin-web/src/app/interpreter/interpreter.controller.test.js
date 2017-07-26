
import { InterpreterSessionUnit, InterpreterSessionMode } from './interpreter.controller'

describe('InterpreterController', function () {
  beforeEach(angular.mock.module('zeppelinWebApp'))

  let ctrl // controller instance
  let $scope
  let $compile
  let $controller // controller generator
  let $httpBackend
  let ngToast

  beforeEach(inject((_$controller_, _$rootScope_, _$compile_, _$http_, _$httpBackend_, _ngToast_) => {
    $scope = _$rootScope_.$new()
    $compile = _$compile_
    $controller = _$controller_
    $httpBackend = _$httpBackend_
    ngToast = _ngToast_
  }))

  it('should return new interpreter setting when setting id is undefined in getSettingBySettingId', () => {
    ctrl = $controller('InterpreterCtrl', { $scope: $scope, })
    expect(ctrl).toBeDefined()

    $scope.interpreterSettings = getMockInterpreterSettings()
    $scope.newInterpreterSetting = $scope.interpreterSettings[1]

    const setting = $scope.getSettingBySettingId(undefined) // md intp
    expect(setting.name).toEqual('md')
    expect(setting.group).toEqual('md')
  })

  it('should return the interpreter setting when setting id is valid in getSettingBySettingId', () => {
    ctrl = $controller('InterpreterCtrl', { $scope: $scope, })
    expect(ctrl).toBeDefined()

    const sparkIntpSettingId = '2CMEPMRVF'
    $scope.interpreterSettings = getMockInterpreterSettings()

    const setting = $scope.getSettingBySettingId(sparkIntpSettingId)
    expect(setting.id).toEqual(sparkIntpSettingId)
    expect(setting.name).toEqual('spark')
    expect(setting.group).toEqual('spark')
  })

  it('should set proper session option based on session mode when PER_USER', () => {
    ctrl = $controller('InterpreterCtrl', { $scope: $scope, })
    expect(ctrl).toBeDefined()

    const sessionUnit = InterpreterSessionUnit.PER_USER

    const setting1 = getMockInterpreterSettings()[0] // perNote and perUser == shared
    const option1 = setting1.option
    $scope.setInterpreterSessionOption(setting1, InterpreterSessionMode.SCOPED, sessionUnit)
    expect(option1[sessionUnit]).toEqual(InterpreterSessionMode.SCOPED)
    expect(option1.session).toEqual(true)
    expect(option1.process).toEqual(false)

    const setting2 = getMockInterpreterSettings()[1] // perNote and perUser == shared
    const option2 = setting2.option
    $scope.setInterpreterSessionOption(setting2, InterpreterSessionMode.ISOLATED, sessionUnit)
    expect(option2[sessionUnit]).toEqual(InterpreterSessionMode.ISOLATED)
    expect(option2.session).toEqual(false)
    expect(option2.process).toEqual(true)
  })

  it('should set proper session option based on session mode when PER_NOTE', () => {
    ctrl = $controller('InterpreterCtrl', { $scope: $scope, })
    expect(ctrl).toBeDefined()

    const sessionUnit = InterpreterSessionUnit.PER_NOTE

    const setting1 = getMockInterpreterSettings()[0] // perNote and perUser == shared
    const option1 = setting1.option
    $scope.setInterpreterSessionOption(setting1, InterpreterSessionMode.SCOPED, sessionUnit)
    expect(option1[sessionUnit]).toEqual(InterpreterSessionMode.SCOPED)
    expect(option1.session).toEqual(true)
    expect(option1.process).toEqual(false)

    const setting2 = getMockInterpreterSettings()[1] // perNote and perUser == shared
    const option2 = setting2.option
    $scope.setInterpreterSessionOption(setting2, InterpreterSessionMode.ISOLATED, sessionUnit)
    expect(option2[sessionUnit]).toEqual(InterpreterSessionMode.ISOLATED)
    expect(option2.session).toEqual(false)
    expect(option2.process).toEqual(true)
  })

  function checkUnknownHttpRequests() {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  }

  function getMockInterpreterSettings() {
    return [
      {
        'id': '2CMEPMRVF',
        'name': 'spark',
        'group': 'spark',
        'properties': {
          'master': {
            'name': 'master',
            'value': 'local[*]',
            'type': 'textarea'
          },
          'spark.executor.memory': {
            'name': 'spark.executor.memory',
            'value': '',
            'type': 'textarea'
          },
        },
        'status': 'READY',
        'interpreterGroup': [
          {
            'name': 'spark',
            'class': 'org.apache.zeppelin.spark.SparkInterpreter',
            'defaultInterpreter': true,
            'editor': {
              'language': 'scala'
            }
          },
          {
            'name': 'sql',
            'class': 'org.apache.zeppelin.spark.SparkSqlInterpreter',
            'defaultInterpreter': false,
            'editor': {
              'language': 'sql'
            }
          },
          {
            'name': 'dep',
            'class': 'org.apache.zeppelin.spark.DepInterpreter',
            'defaultInterpreter': false,
            'editor': {
              'language': 'scala'
            }
          },
          {
            'name': 'pyspark',
            'class': 'org.apache.zeppelin.spark.PySparkInterpreter',
            'defaultInterpreter': false,
            'editor': {
              'language': 'python'
            }
          },
          {
            'name': 'r',
            'class': 'org.apache.zeppelin.spark.SparkRInterpreter',
            'defaultInterpreter': false,
            'editor': {
              'language': 'r'
            }
          }
        ],
        'dependencies': [

        ],
        'option': {
          'remote': true,
          'port': -1,
          'perNote': 'shared',
          'perUser': 'shared',
          'isExistingProcess': false,
          'setPermission': false,
          'owners': [

          ],
          'isUserImpersonate': false
        }
      },
      {
        'id': '2CJK3N7QE',
        'name': 'md',
        'group': 'md',
        'properties': {
          'markdown.parser.type': {
            'name': 'markdown.parser.type',
            'value': 'pegdown',
            'type': 'textarea'
          }
        },
        'status': 'READY',
        'interpreterGroup': [
          {
            'name': 'md',
            'class': 'org.apache.zeppelin.markdown.Markdown',
            'defaultInterpreter': false,
            'editor': {
              'language': 'markdown',
              'editOnDblClick': true
            }
          }
        ],
        'dependencies': [

        ],
        'option': {
          'remote': true,
          'port': -1,
          'perNote': 'shared',
          'perUser': 'shared',
          'isExistingProcess': false,
          'setPermission': false,
          'owners': [

          ],
          'isUserImpersonate': false
        }
      }
    ]
  }

  function getMockAvailableInterpreters() {
    return {
      'sh': {
        'id': '2CNPZW566',
        'name': 'sh',
        'properties': {
          'shell.command.timeout.millisecs': {
            'envName': 'SHELL_COMMAND_TIMEOUT',
            'propertyName': 'shell.command.timeout.millisecs',
            'defaultValue': '60000',
            'description': 'Shell command time out in millisecs. Default \u003d 60000',
            'type': 'number'
          },
        },
        'status': 'READY',
        'interpreterGroup': [
          {
            'name': 'sh',
            'class': 'org.apache.zeppelin.shell.ShellInterpreter',
            'defaultInterpreter': false,
            'editor': {
              'language': 'sh',
              'editOnDblClick': false
            }
          }
        ],
        'dependencies': [

        ],
        'option': {
          'remote': true,
          'port': -1,
          'perNote': 'shared',
          'perUser': 'shared',
          'isExistingProcess': false,
          'setPermission': false,
          'isUserImpersonate': false
        }
      },
      'md': {
        'id': '2CQFTUWUG',
        'name': 'md',
        'properties': {
          'markdown.parser.type': {
            'envName': 'MARKDOWN_PARSER_TYPE',
            'propertyName': 'markdown.parser.type',
            'defaultValue': 'pegdown',
            'description': 'Markdown Parser Type. Available values:  pegdown, markdown4j. Default \u003d pegdown',
            'type': 'string'
          }
        },
        'status': 'READY',
        'interpreterGroup': [
          {
            'name': 'md',
            'class': 'org.apache.zeppelin.markdown.Markdown',
            'defaultInterpreter': false,
            'editor': {
              'language': 'markdown',
              'editOnDblClick': true
            }
          }
        ],
        'dependencies': [

        ],
        'option': {
          'remote': true,
          'port': -1,
          'perNote': 'shared',
          'perUser': 'shared',
          'isExistingProcess': false,
          'setPermission': false,
          'isUserImpersonate': false
        }
      },
      'spark': {
        'id': '2CPEDHP33',
        'name': 'spark',
        'properties': {
          'spark.executor.memory': {
            'propertyName': 'spark.executor.memory',
            'defaultValue': '',
            'description': 'Executor memory per worker instance. ex) 512m, 32g',
            'type': 'string'
          },
          'args': {
            'defaultValue': '',
            'description': 'spark commandline args',
            'type': 'string'
          },
          'zeppelin.spark.useHiveContext': {
            'envName': 'ZEPPELIN_SPARK_USEHIVECONTEXT',
            'propertyName': 'zeppelin.spark.useHiveContext',
            'defaultValue': true,
            'description': 'Use HiveContext instead of SQLContext if it is true.',
            'type': 'checkbox'
          },
          'spark.app.name': {
            'envName': 'SPARK_APP_NAME',
            'propertyName': 'spark.app.name',
            'defaultValue': 'Zeppelin',
            'description': 'The name of spark application.',
            'type': 'string'
          },

        },
        'status': 'READY',
        'interpreterGroup': [
          {
            'name': 'spark',
            'class': 'org.apache.zeppelin.spark.SparkInterpreter',
            'defaultInterpreter': true,
            'editor': {
              'language': 'scala'
            }
          },
          {
            'name': 'sql',
            'class': 'org.apache.zeppelin.spark.SparkSqlInterpreter',
            'defaultInterpreter': false,
            'editor': {
              'language': 'sql'
            }
          },
          {
            'name': 'dep',
            'class': 'org.apache.zeppelin.spark.DepInterpreter',
            'defaultInterpreter': false,
            'editor': {
              'language': 'scala'
            }
          },
          {
            'name': 'pyspark',
            'class': 'org.apache.zeppelin.spark.PySparkInterpreter',
            'defaultInterpreter': false,
            'editor': {
              'language': 'python'
            }
          },
          {
            'name': 'r',
            'class': 'org.apache.zeppelin.spark.SparkRInterpreter',
            'defaultInterpreter': false,
            'editor': {
              'language': 'r'
            }
          }
        ],
        'dependencies': [

        ],
        'option': {
          'remote': true,
          'port': -1,
          'perNote': 'shared',
          'perUser': 'shared',
          'isExistingProcess': false,
          'setPermission': false,
          'isUserImpersonate': false
        }
      },
    }
  }
})
