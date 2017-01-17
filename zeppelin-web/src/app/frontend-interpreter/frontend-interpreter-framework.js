/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*eslint-disable no-unused-vars */
import {
  DefaultDisplayType,
  FrontendInterpreterResult,
} from './frontend-interpreter-result';
/*eslint-enable no-unused-vars */

export class AbstractFrontendInterpreter {
  constructor(magic, displayType) {
    this.magic = magic;
    this.displayType = displayType;
  }

  /**
   * @param paragraphText which includes magic
   * @returns {string} if magic exists, otherwise return undefined
   */
  static extractMagic(allParagraphText) {
  const intpNameRegexp = /^\s*%(\S+)\s*/g;
  try {
    let match = intpNameRegexp.exec(allParagraphText);
    if (match) { return `%${match[1].trim()}`; }
  } catch (error) {
    // failed to parse, ignore
  }

  return undefined;
}

  static useInterpret(interpreter) {
    return (interpreter.__proto__.hasOwnProperty('interpret'));
  }

  static useDisplay(interpreter) {
    return (interpreter.__proto__.hasOwnProperty('display'));
  }

  /**
   * Consumes text and return multiple interpreter results.
   * This method should handle error properly to provide precise error message.
   *
   * @param paragraphText {string} which doesn't include magic
   * @return {Array<FrontendInterpreterResult>}
   */
  interpret(paragraphText) {
    /** implement this if you want to add a frontend interpreter */
  }

  /**
   * Consumes text and return a single interpreter result.
   * This method should handle error properly to provide precise error message.
   *
   * Currently, `display` only allows DefaultDisplayType
   * as a type of result to avoid to recursive evaluation of display results.
   *
   * @param paragraphText {string} which doesn't include magic
   * @return {FrontendInterpreterResult}
   */
  display(paragraphText) {
    /** implement this if you want to add a display system */
  }

  /**
   * return magic for this frontend interpreter.
   * (e.g `%flowchart`)
   * @return {string}
   */
  getMagic() {
    return this.magic;
  }

  /**
   * return display type for this frontend interpreter.
   * (e.g `DefaultDisplayType.TEXT`)
   * @return {string}
   */
  getDisplayType() {
    return this.displayType;
  }
}
