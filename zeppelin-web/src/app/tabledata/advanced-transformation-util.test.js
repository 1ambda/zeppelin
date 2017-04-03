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

import * as Util from './advanced-transformation-util.js'

/* eslint-disable max-len */
const MockParameter = {
  'floatParam': { valueType: 'float', defaultValue: 10, description: '', },
  'intParam': { valueType: 'int', defaultValue: 50, description: '', },
  'jsonParam': { valueType: 'JSON', defaultValue: '', description: '', widget: 'textarea', },
  'stringParam1': { valueType: 'string', defaultValue: '', description: '', },
  'stringParam2': { valueType: 'string', defaultValue: '', description: '', widget: 'input', },
  'boolParam': { valueType: 'boolean', defaultValue: false, description: '', widget: 'checkbox', },
  'optionParam': { valueType: 'string', defaultValue: 'line', description: '', widget: 'option', optionValues: [ 'line', 'smoothedLine', ], },
}
/* eslint-enable max-len */

const MockAxis1 = {
  'keyAxis': { dimension: 'multiple', axisType: 'key', },
  'aggrAxis': { dimension: 'multiple', axisType: 'aggregator', },
  'groupAxis': { dimension: 'multiple', axisType: 'group', },
}

const MockAxis2 = {
  'singleKeyAxis': { dimension: 'single', axisType: 'key', },
  'limitedAggrAxis': { dimension: 'multiple', axisType: 'aggregator', maxAxisCount: 2, },
  'singleGroupAxis': { dimension: 'single', axisType: 'group', },
}

const MockAxis3 = {
  'customAxis1': { dimension: 'single', axisType: 'unique', },
  'customAxis2': { dimension: 'multiple', axisType: 'value', },
}

// test spec for axis, param, widget
const MockSpec = {
  charts: {
    'object-chart': {
      transform: { method: 'object', },
      sharedAxis: true,
      axis: MockAxis1,
      parameter: MockParameter,
    },

    'array-chart': {
      transform: { method: 'array', },
      sharedAxis: true,
      axis: MockAxis1,
      parameter: {
        'arrayChartParam0': { valueType: 'string', defaultValue: '', description: 'param0', },
      },
    },

    'drillDown-chart': {
      transform: { method: 'drill-down', },
      axis: MockAxis2,
      parameter: {
        'drillDownChartParam0': { valueType: 'string', defaultValue: '', description: 'param0', },
      },
    },

    'raw-chart': {
      transform: { method: 'raw', },
      axis: MockAxis3,
      parameter: {
        'rawChartParam0': { valueType: 'string', defaultValue: '', description: 'param0', },
      },
    },
  },
}

// test spec for transformation
const MockSpec2 = {
  charts: {
    'object-chart': {
      transform: { method: 'object', },
      sharedAxis: false,
      axis: MockAxis1,
      parameter: MockParameter,
    },

    'array-chart': {
      transform: { method: 'array', },
      sharedAxis: false,
      axis: MockAxis1,
      parameter: {
        'arrayChartParam0': { valueType: 'string', defaultValue: '', description: 'param0', },
      },
    },

    'drillDown-chart': {
      transform: { method: 'drill-down', },
      sharedAxis: false,
      axis: MockAxis1,
      parameter: {
        'drillDownChartParam0': { valueType: 'string', defaultValue: '', description: 'param0', },
      },
    },

    'raw-chart': {
      transform: { method: 'raw', },
      sharedAxis: false,
      axis: MockAxis3,
      parameter: {
        'rawChartParam0': { valueType: 'string', defaultValue: '', description: 'param0', },
      },
    },
  },
}

/* eslint-disable max-len */
const MockTableDataColumn = [
  {'name': 'age', 'index': 0, 'aggr': 'sum',},
  {'name': 'job', 'index': 1, 'aggr': 'sum',},
  {'name': 'marital', 'index': 2, 'aggr': 'sum',},
  {'name': 'education', 'index': 3, 'aggr': 'sum',},
  {'name': 'default', 'index': 4, 'aggr': 'sum',},
  {'name': 'balance', 'index': 5, 'aggr': 'sum',},
  {'name': 'housing', 'index': 6, 'aggr': 'sum',},
  {'name': 'loan', 'index': 7, 'aggr': 'sum',},
  {'name': 'contact', 'index': 8, 'aggr': 'sum',},
  {'name': 'day', 'index': 9, 'aggr': 'sum',},
  {'name': 'month', 'index': 10, 'aggr': 'sum',},
  {'name': 'duration', 'index': 11, 'aggr': 'sum',},
  {'name': 'campaign', 'index': 12, 'aggr': 'sum',},
  {'name': 'pdays', 'index': 13, 'aggr': 'sum',},
  {'name': 'previous', 'index': 14, 'aggr': 'sum',},
  {'name': 'poutcome', 'index': 15, 'aggr': 'sum',},
  {'name': 'y', 'index': 16, 'aggr': 'sum',}
]

const MockTableDataRows1 = [
  [ '44', 'services', 'single', 'tertiary', 'no', '106', 'no', 'no', 'unknown', '12', 'jun', '109', '2', '-1', '0', 'unknown', 'no' ],
  [ '43', 'services', 'married', 'primary', 'no', '-88', 'yes', 'yes', 'cellular', '17', 'apr', '313', '1', '147', '2', 'failure', 'no' ],
  [ '39', 'services', 'married', 'secondary', 'no', '9374', 'yes', 'no', 'unknown', '20', 'may', '273', '1', '-1', '0', 'unknown', 'no' ],
  [ '33', 'services', 'single', 'tertiary', 'no', '4789', 'yes', 'yes', 'cellular', '11', 'may', '220', '1', '339', '4', 'failure', 'no' ],
]

const MockTableDataRows99 = [
  [ 43, 'services', 'married', 'primary', 'no', '-88', 'yes', 'yes', 'cellular', '17', 'apr', '313', '1', '147', '2', 'failure', 'no' ],
  [ 39, 'services', 'married', 'secondary', 'no', '9374', 'yes', 'no', 'unknown', '20', 'may', '273', '1', '-1', '0', 'unknown', 'no' ],
  [ 33, 'services', 'single', 'tertiary', 'no', '4789', 'yes', 'yes', 'cellular', '11', 'may', '220', '1', '339', '4', 'failure', 'no' ],
  [ 59, 'blue-collar', 'married', 'secondary', 'no', '0', 'yes', 'no', 'unknown', '5', 'may', '226', '1', '-1', '0', 'unknown', 'no' ],
  [ 31, 'blue-collar', 'married', 'secondary', 'no', '360', 'yes', 'yes', 'cellular', '29', 'jan', '89', '1', '241', '1', 'failure', 'no' ],
  [ 25, 'blue-collar', 'single', 'primary', 'no', '-221', 'yes', 'no', 'unknown', '23', 'may', '250', '1', '-1', '0', 'unknown', 'no' ],
  [ 39, 'technician', 'married', 'tertiary', 'no', '147', 'yes', 'no', 'cellular', '6', 'may', '151', '2', '-1', '0', 'unknown', 'no' ],
  [ 56, 'technician', 'married', 'secondary', 'no', '4073', 'no', 'no', 'cellular', '27', 'aug', '239', '5', '-1', '0', 'unknown', 'no' ],
  [ 37, 'admin.', 'single', 'tertiary', 'no', '2317', 'yes', 'no', 'cellular', '20', 'apr', '114', '1', '152', '2', 'failure', 'no' ],
  [ 36, 'self-employed', 'married', 'tertiary', 'no', '307', 'yes', 'no', 'cellular', '14', 'may', '341', '1', '330', '2', 'other', 'no' ],
  [ 65, 'unemployed', 'single', 'primary', 'no', '1787', 'no', 'no', 'cellular', '19', 'oct', '79', '1', '-1', '0', 'unknown', 'no' ],
  [ 41, 'management', 'married', 'tertiary', 'no', '1476', 'yes', 'yes', 'unknown', '3', 'jun', '199', '4', '-1', '0', 'unknown', 'no' ],
  [ 35, 'management', 'single', 'tertiary', 'no', '1350', 'yes', 'no', 'cellular', '16', 'apr', '185', '1', '330', '1', 'failure', 'no' ],
  [ 35, 'management', 'single', 'tertiary', 'no', '747', 'no', 'no', 'cellular', '23', 'feb', '141', '2', '176', '3', 'failure', 'no' ],
  [ 41, 'entrepreneur', 'married', 'tertiary', 'no', '221', 'yes', 'no', 'unknown', '14', 'may', '57', '2', '-1', '0', 'unknown', 'no' ],
  [ 44, 'entrepreneur', 'married', 'secondary', 'no', '93', 'no', 'no', 'cellular', '7', 'jul', '125', '2', '-1', '0', 'unknown', 'no' ],
  [ 43, 'admin.', 'married', 'secondary', 'no', '264', 'yes', 'no', 'cellular', '17', 'apr', '113', '2', '-1', '0', 'unknown', 'no' ],
  [ 36, 'technician', 'married', 'tertiary', 'no', '1109', 'no', 'no', 'cellular', '13', 'aug', '328', '2', '-1', '0', 'unknown', 'no' ],
  [ 20, 'student', 'single', 'secondary', 'no', '502', 'no', 'no', 'cellular', '30', 'apr', '261', '1', '-1', '0', 'unknown', 'yes' ],
  [ 40, 'management', 'married', 'tertiary', 'no', '194', 'no', 'yes', 'cellular', '29', 'aug', '189', '2', '-1', '0', 'unknown', 'no' ],
  [ 31, 'services', 'married', 'secondary', 'no', '132', 'no', 'no', 'cellular', '7', 'jul', '148', '1', '152', '1', 'other', 'no' ],
  [ 38, 'management', 'divorced', 'unknown', 'no', '0', 'yes', 'no', 'cellular', '18', 'nov', '96', '2', '-1', '0', 'unknown', 'no' ],
  [ 42, 'management', 'divorced', 'tertiary', 'no', '16', 'no', 'no', 'cellular', '19', 'nov', '140', '3', '-1', '0', 'unknown', 'no' ],
]
/* eslint-enable max-len */

describe('advanced-transformation-util', () => {
  describe('getCurrent* funcs', () => {
    it('should set return proper value of the current chart', () => {
      const config  = {}
      Util.initializeConfig(config, MockSpec)
      expect(Util.getCurrentChart(config)).toEqual('object-chart')
      expect(Util.getCurrentChartTransform(config)).toEqual({method: 'object'})
      // use `toBe` to compare reference
      expect(Util.getCurrentChartAxis(config)).toBe(config.axis['object-chart'])
      // use `toBe` to compare reference
      expect(Util.getCurrentChartParam(config)).toBe(config.parameter['object-chart'])
    })
  })

  describe('useSharedAxis', () => {
    it('should set chartChanged for initial drawing', () => {
      const config  = {}
      Util.initializeConfig(config, MockSpec)
      expect(Util.useSharedAxis(config, 'object-chart')).toEqual(true)
      expect(Util.useSharedAxis(config, 'array-chart')).toEqual(true)
      expect(Util.useSharedAxis(config, 'drillDown-chart')).toBeUndefined()
      expect(Util.useSharedAxis(config, 'raw-chart')).toBeUndefined()
    })
  })

  describe('initializeConfig', () => {
    const config  = {}
    Util.initializeConfig(config, MockSpec)

    it('should set chartChanged for initial drawing', () => {
      expect(config.chartChanged).toBe(true)
      expect(config.parameterChanged).toBe(false)
    })

    it('should set panel toggles ', () => {
      expect(config.panel.columnPanelOpened).toBe(true)
      expect(config.panel.parameterPanelOpened).toBe(false)
    })

    it('should set version and initialized', () => {
      expect(config.spec.version).toBeDefined()
      expect(config.spec.initialized).toBe(true)
    })

    it('should set chart', () => {
      expect(config.chart.current).toBe('object-chart')
      expect(config.chart.available).toEqual([
        'object-chart',
        'array-chart',
        'drillDown-chart',
        'raw-chart',
      ])
    })

    it('should set sharedAxis', () => {
      expect(config.sharedAxis).toEqual({
        keyAxis: [], aggrAxis: [], groupAxis: [],
      })
      // should use `toBe` to compare object reference
      expect(config.sharedAxis).toBe(config.axis['object-chart'])
      // should use `toBe` to compare object reference
      expect(config.sharedAxis).toBe(config.axis['array-chart'])
    })

    it('should set paramSpecs', () => {
      const expected = Util.getSpecs(MockParameter)
      expect(config.paramSpecs['object-chart']).toEqual(expected)
      expect(config.paramSpecs['array-chart'].length).toEqual(1)
      expect(config.paramSpecs['drillDown-chart'].length).toEqual(1)
      expect(config.paramSpecs['raw-chart'].length).toEqual(1)
    })

    it('should set parameter with default value', () => {
      expect(Object.keys(MockParameter).length).toBeGreaterThan(0) // length > 0
      for (let paramName in MockParameter) {
        expect(config.parameter['object-chart'][paramName])
          .toEqual(MockParameter[paramName].defaultValue)
      }
    })

    it('should set axisSpecs', () => {
      const expected = Util.getSpecs(MockAxis1)
      expect(config.axisSpecs['object-chart']).toEqual(expected)
      expect(config.axisSpecs['array-chart'].length).toEqual(3)
      expect(config.axisSpecs['drillDown-chart'].length).toEqual(3)
      expect(config.axisSpecs['raw-chart'].length).toEqual(2)
    })

    it('should prepare axis depending on dimension', () => {
      expect(config.axis['object-chart']).toEqual({
        keyAxis: [], aggrAxis: [], groupAxis: [],
      })
      expect(config.axis['array-chart']).toEqual({
        keyAxis: [], aggrAxis: [], groupAxis: [],
      })
      // it's ok not to set single dimension axis
      expect(config.axis['drillDown-chart']).toEqual({ limitedAggrAxis: [], })
      // it's ok not to set single dimension axis
      expect(config.axis['raw-chart']).toEqual({ customAxis2: [], })
    })

  })

  describe('axis', () => {

  })

  describe('parameter:widget', () => {
    it('isInputWidget', () => {
      expect(Util.isInputWidget(MockParameter.stringParam1)).toBe(true)
      expect(Util.isInputWidget(MockParameter.stringParam2)).toBe(true)

      expect(Util.isInputWidget(MockParameter.boolParam)).toBe(false)
      expect(Util.isInputWidget(MockParameter.jsonParam)).toBe(false)
      expect(Util.isInputWidget(MockParameter.optionParam)).toBe(false)
    })

    it('isOptionWidget', () => {
      expect(Util.isOptionWidget(MockParameter.optionParam)).toBe(true)

      expect(Util.isOptionWidget(MockParameter.stringParam1)).toBe(false)
      expect(Util.isOptionWidget(MockParameter.stringParam2)).toBe(false)
      expect(Util.isOptionWidget(MockParameter.boolParam)).toBe(false)
      expect(Util.isOptionWidget(MockParameter.jsonParam)).toBe(false)
    })

    it('isCheckboxWidget', () => {
      expect(Util.isCheckboxWidget(MockParameter.boolParam)).toBe(true)

      expect(Util.isCheckboxWidget(MockParameter.stringParam1)).toBe(false)
      expect(Util.isCheckboxWidget(MockParameter.stringParam2)).toBe(false)
      expect(Util.isCheckboxWidget(MockParameter.jsonParam)).toBe(false)
      expect(Util.isCheckboxWidget(MockParameter.optionParam)).toBe(false)
    })

    it('isTextareaWidget', () => {
      expect(Util.isTextareaWidget(MockParameter.jsonParam)).toBe(true)

      expect(Util.isTextareaWidget(MockParameter.stringParam1)).toBe(false)
      expect(Util.isTextareaWidget(MockParameter.stringParam2)).toBe(false)
      expect(Util.isTextareaWidget(MockParameter.boolParam)).toBe(false)
      expect(Util.isTextareaWidget(MockParameter.optionParam)).toBe(false)
    })
  })

  describe('parameter:parseParameter', () => {
    const paramSpec = Util.getSpecs(MockParameter)

    it('should parse number', () => {
      const params = { intParam: '3', }
      const parsed = Util.parseParameter(paramSpec, params)
      expect(parsed.intParam).toBe(3)
    })

    it('should parse float', () => {
      const params = { floatParam: '0.10', }
      const parsed = Util.parseParameter(paramSpec, params)
      expect(parsed.floatParam).toBe(0.10)
    })

    it('should parse boolean', () => {
      const params1 = { boolParam: 'true', }
      const parsed1 = Util.parseParameter(paramSpec, params1)
      expect(typeof parsed1.boolParam).toBe('boolean')
      expect(parsed1.boolParam).toBe(true)

      const params2 = { boolParam: 'false', }
      const parsed2 = Util.parseParameter(paramSpec, params2)
      expect(typeof parsed2.boolParam).toBe('boolean')
      expect(parsed2.boolParam).toBe(false)
    })

    it('should parse JSON', () => {
      const params = { jsonParam: '{ "a": 3 }', }
      const parsed = Util.parseParameter(paramSpec, params)
      expect(typeof parsed.jsonParam).toBe('object')
      expect(JSON.stringify(parsed.jsonParam)).toBe('{"a":3}')
    })

    it('should not parse string', () => {
      const params = { stringParam: 'example', }
      const parsed = Util.parseParameter(paramSpec, params)
      expect(typeof parsed.stringParam).toBe('string')
      expect(parsed.stringParam).toBe('example')
    })

  })

  describe('removeDuplicatedColumnsInMultiDimensionAxis', () => {
    const config = {}
    Util.initializeConfig(config, MockSpec)

    const addColumn = function(config, value) {
      const axis = Util.getCurrentChartAxis(config)['limitedAggrAxis']
      axis.push(value)
      const axisSpecs = Util.getCurrentChartAxisSpecs(config)
      Util.removeDuplicatedColumnsInMultiDimensionAxis(config, axisSpecs[1])
    }

    it('should remove duplicated axis names in config', () => {
      config.chart.current = 'drillDown-chart' // set non-sharedAxis chart
      addColumn(config, 'columnA')
      addColumn(config, 'columnA')
      addColumn(config, 'columnA')

      expect(Util.getCurrentChartAxis(config)['limitedAggrAxis']).toEqual([
        'columnA',
      ])
    })
  })

  describe('applyMaxAxisCount', () => {
    const config = {}
    Util.initializeConfig(config, MockSpec)

    const addColumn = function(config, value) {
      const axis = Util.getCurrentChartAxis(config)['limitedAggrAxis']
      axis.push(value)
      const axisSpecs = Util.getCurrentChartAxisSpecs(config)
      Util.applyMaxAxisCount(config, axisSpecs[1])
    }

    it('should remove duplicated axis names in config', () => {
      config.chart.current = 'drillDown-chart' // set non-sharedAxis chart

      addColumn(config, 'columnA')
      addColumn(config, 'columnB')
      addColumn(config, 'columnC')
      addColumn(config, 'columnD')

      expect(Util.getCurrentChartAxis(config)['limitedAggrAxis']).toEqual([
        'columnC', 'columnD',
      ])
    })
  })

  describe('getColumnsFromAxis', () => {
    it('should return proper value for regular axis spec (key, aggr, group)', () => {
      const config = {}
      Util.initializeConfig(config, MockSpec)
      const chart = 'object-chart'
      config.chart.current = chart

      const axisSpecs = config.axisSpecs[chart]
      const axis = config.axis[chart]
      axis['keyAxis'].push('columnA')
      axis['keyAxis'].push('columnB')
      axis['aggrAxis'].push('columnC')
      axis['groupAxis'].push('columnD')
      axis['groupAxis'].push('columnE')
      axis['groupAxis'].push('columnF')

      const column = Util.getColumnsFromAxis(axisSpecs, axis)
      expect(column.key).toEqual([ 'columnA', 'columnB', ])
      expect(column.aggregator).toEqual([ 'columnC', ])
      expect(column.group).toEqual([ 'columnD', 'columnE', 'columnF', ])
    })

    it('should return proper value for custom axis spec', () => {
      const config = {}
      Util.initializeConfig(config, MockSpec)
      const chart = 'raw-chart' // for test custom columns
      config.chart.current = chart

      const axisSpecs = config.axisSpecs[chart]
      const axis = config.axis[chart]
      axis['customAxis1'] = ['columnA']
      axis['customAxis2'].push('columnB')
      axis['customAxis2'].push('columnC')
      axis['customAxis2'].push('columnD')

      const column = Util.getColumnsFromAxis(axisSpecs, axis)
      expect(column.custom.unique).toEqual([ 'columnA', ])
      expect(column.custom.value).toEqual([ 'columnB', 'columnC', 'columnD', ])
    })
  })

  // it's hard to test all methods for transformation.
  // so let's do behavioral (black-box) test instead of
  describe('getTransformer', () => {

    describe('method: raw', () => {
      let config = {}
      Util.initializeConfig(config, MockSpec2)

      it('should return original rows when transform.method is `raw`', () => {
        const chart = 'raw-chart'
        config.chart.current = chart

        const rows = [ { 'r1': 1, }, ]
        const transformer = Util.getTransformer(config, rows)
        const transformed = transformer()

        expect(transformed).toBe(rows)
      })
    })

    describe('method: array', () => {
      let config = {}
      const chart = 'array-chart'
      let ageColumn = null
      let balanceColumn = null
      let educationColumn = null
      let martialColumn = null
      let jobColumn = null
      const tableDataRows = MockTableDataRows1

      beforeEach(() => {
        Util.initializeConfig(config, MockSpec2)
        config.chart.current = chart
        ageColumn = JSON.parse(JSON.stringify(MockTableDataColumn[0]))
        balanceColumn = JSON.parse(JSON.stringify(MockTableDataColumn[5]))
        educationColumn = JSON.parse(JSON.stringify(MockTableDataColumn[3]))
        martialColumn = JSON.parse(JSON.stringify(MockTableDataColumn[2]))
        jobColumn = JSON.parse(JSON.stringify(MockTableDataColumn[1]))
      })
    })

    describe('method: object', () => {
      let config = {}
      const chart = 'object-chart'
      let ageColumn = null
      let balanceColumn = null
      let educationColumn = null
      let martialColumn = null
      let jobColumn = null
      const tableDataRows = MockTableDataRows1

      beforeEach(() => {
        Util.initializeConfig(config, MockSpec2)
        config.chart.current = chart
        ageColumn = JSON.parse(JSON.stringify(MockTableDataColumn[0]))
        balanceColumn = JSON.parse(JSON.stringify(MockTableDataColumn[5]))
        educationColumn = JSON.parse(JSON.stringify(MockTableDataColumn[3]))
        martialColumn = JSON.parse(JSON.stringify(MockTableDataColumn[2]))
        jobColumn = JSON.parse(JSON.stringify(MockTableDataColumn[1]))
      })

      it('should transform properly: 0 key, 0 group, 1 aggr(sum)', () => {
        ageColumn.aggr = 'sum'
        config.axis[chart].aggrAxis.push(ageColumn)
        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, keyNames, groupNames, selectors, } = transformer()

        expect(keyNames).toEqual([ '', ])
        expect(groupNames).toEqual([ 'age', ])
        expect(selectors).toEqual([ 'age', ])
        expect(rows).toEqual([{ age: 44 + 43 + 39 + 33, }])
      })

      it('should transform properly: 0 key, 0 group, 1 aggr(count)', () => {
        ageColumn.aggr = 'count'
        config.axis[chart].aggrAxis.push(ageColumn)

        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, } = transformer()
        expect(rows).toEqual([{ age: 4, }])
      })

      it('should transform properly: 0 key, 0 group, 1 aggr(avg)', () => {
        ageColumn.aggr = 'avg'
        config.axis[chart].aggrAxis.push(ageColumn)

        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, } = transformer()
        expect(rows).toEqual([{ age: (44 + 43 + 39 + 33) / 4.0, }])
      })

      it('should transform properly: 0 key, 0 group, 1 aggr(max)', () => {
        ageColumn.aggr = 'max'
        config.axis[chart].aggrAxis.push(ageColumn)

        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, } = transformer()
        expect(rows).toEqual([{ age: 44, }])
      })

      it('should transform properly: 0 key, 0 group, 1 aggr(min)', () => {
        ageColumn.aggr = 'min'
        config.axis[chart].aggrAxis.push(ageColumn)

        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, } = transformer()
        expect(rows).toEqual([{ age: 33, }])
      })

      it('should transform properly: 0 key, 0 group, 2 aggr(sum)', () => {
        ageColumn.aggr = 'sum'
        balanceColumn.aggr = 'sum'
        config.axis[chart].aggrAxis.push(ageColumn)
        config.axis[chart].aggrAxis.push(balanceColumn)
        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, keyNames, groupNames, selectors, } = transformer()

        expect(keyNames).toEqual([ '', ])
        expect(groupNames).toEqual([ 'age', 'balance', ])
        expect(selectors).toEqual([ 'age', 'balance', ])
        expect(rows).toEqual([{ age: 159, balance: 14181, }])
      })

      it('should transform properly: 0 key, 1 group, 1 aggr(sum)', () => {
        ageColumn.aggr = 'sum'
        config.axis[chart].aggrAxis.push(ageColumn)
        config.axis[chart].groupAxis.push(martialColumn)
        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, keyNames, groupNames, selectors, } = transformer()

        expect(keyNames).toEqual([ 'marital', ])
        expect(groupNames).toEqual([ 'married', 'single', ])
        expect(selectors).toEqual([ 'married', 'single', ])
        expect(rows).toEqual([
          { single: 77, married: 82, }
        ])
      })

      it('should transform properly: 0 key, 1 group, 2 aggr(sum)', () => {
        ageColumn.aggr = 'sum'
        balanceColumn.aggr = 'sum'
        config.axis[chart].aggrAxis.push(ageColumn)
        config.axis[chart].aggrAxis.push(balanceColumn)
        config.axis[chart].groupAxis.push(martialColumn)
        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, keyNames, groupNames, selectors, } = transformer()

        expect(keyNames).toEqual([ 'marital', ])
        expect(groupNames).toEqual([ 'married', 'single', ])
        expect(selectors).toEqual([
          'married / age', 'married / balance', 'single / age', 'single / balance',
        ])
        expect(rows).toEqual([{
          'married / age': 82,
          'single / age': 77,
          'married / balance': 9286,
          'single / balance': 4895,
        }])
      })

      it('should transform properly: 0 key, 2 group, 1 aggr(sum)', () => {
        ageColumn.aggr = 'sum'
        config.axis[chart].aggrAxis.push(ageColumn)
        config.axis[chart].groupAxis.push(martialColumn)
        config.axis[chart].groupAxis.push(educationColumn)
        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, keyNames, groupNames, selectors, } = transformer()

        expect(keyNames).toEqual([ 'marital.education', ])
        expect(groupNames).toEqual([ 'married.primary', 'married.secondary', 'single.tertiary', ])
        expect(selectors).toEqual([ 'married.primary', 'married.secondary', 'single.tertiary', ])
        expect(rows).toEqual([{
          'married.primary': '43', 'married.secondary': '39', 'single.tertiary': 77,
        }])
      })

      it('should transform properly: 1 key, 0 group, 1 aggr(sum)', () => {
        ageColumn.aggr = 'sum'
        config.axis[chart].aggrAxis.push(ageColumn)
        config.axis[chart].keyAxis.push(martialColumn)
        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, keyNames, groupNames, selectors, } = transformer()

        expect(keyNames).toEqual([ 'married', 'single', ])
        expect(groupNames).toEqual([ 'age', ])
        expect(selectors).toEqual([ 'age', ])
        expect(rows).toEqual([
          { age: 82, marital: 'married', },
          { age: 77, marital: 'single', },
        ])
      })

      it('should transform properly: 2 key, 0 group, 1 aggr(sum)', () => {
        ageColumn.aggr = 'sum'
        config.axis[chart].aggrAxis.push(ageColumn)
        config.axis[chart].keyAxis.push(martialColumn)
        config.axis[chart].keyAxis.push(educationColumn)
        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, keyNames, groupNames, selectors, } = transformer()

        expect(keyNames).toEqual([ 'married.primary', 'married.secondary', 'single.tertiary', ])
        expect(groupNames).toEqual([ 'age', ])
        expect(selectors).toEqual([ 'age', ])
        expect(rows).toEqual([
          { age: '43', 'marital.education': 'married.primary' },
          { age: '39', 'marital.education': 'married.secondary' },
          { age: 77, 'marital.education': 'single.tertiary' },
        ])
      })

      it('should transform properly: 1 key, 1 group, 1 aggr(sum)', () => {
        ageColumn.aggr = 'sum'
        config.axis[chart].aggrAxis.push(ageColumn)
        config.axis[chart].keyAxis.push(martialColumn)
        config.axis[chart].groupAxis.push(educationColumn)
        const column = Util.getColumnsFromAxis(config.axisSpecs[chart], config.axis[chart])
        const transformer = Util.getTransformer(config, tableDataRows,
          column.key, column.group, column.aggregator)

        const { rows, keyNames, groupNames, selectors, } = transformer()

        expect(keyNames).toEqual([ 'married', 'single', ])
        expect(groupNames).toEqual([ 'primary', 'secondary', 'tertiary', ])
        expect(selectors).toEqual([ 'primary', 'secondary', 'tertiary', ])
        expect(rows).toEqual([
          { primary: '43', secondary: '39', marital: 'married' },
          { tertiary: 44 + 33, marital: 'single' },
        ])
      })
    }) // end: describe('method: object')

  }) // end: describe('getTransformer')
})

