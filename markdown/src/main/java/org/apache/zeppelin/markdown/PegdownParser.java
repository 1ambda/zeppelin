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

package org.apache.zeppelin.markdown;

import org.pegdown.Extensions;
import org.pegdown.PegDownProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Markdown Parser using pegdown processor. */
public class PegdownParser implements MarkdownParser {
  private final Logger logger = LoggerFactory.getLogger(PegdownParser.class);

  private PegDownProcessor processor;

  public PegdownParser() {
    int pegdownOptions = Extensions.ALL_WITH_OPTIONALS - Extensions.ANCHORLINKS;
    int parsingTimeoutAsMillis = 5000;
    processor = new PegDownProcessor(pegdownOptions, parsingTimeoutAsMillis);
  }

  @Override
  public String render(String markdownText) {
    String html = "";

    try {
      String parsed = processor.markdownToHtml(markdownText);
      if (null == parsed) {
        throw new RuntimeException("Cannot parse markdown text to HTML using pegdown");
      }

      html = wrapWithMarkdownClassDiv(parsed);
    } catch (RuntimeException e) {
      logger.error("Cannot parse markdown text to HTML using pegdown", e);
    }

    return html;
  }

  /** wrap with markdown class div to styling DOM using css. */
  public static String wrapWithMarkdownClassDiv(String html) {
    return new StringBuilder()
        .append("<div class=\"markdown-body\">\n")
        .append(html)
        .append("\n</div>")
        .toString();
  }
}
