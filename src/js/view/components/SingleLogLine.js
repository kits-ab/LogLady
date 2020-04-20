import React from 'react';
import { LogLine } from '../styledComponents/LogViewerListStyledComponents';
import TextHighlightRegex from './TextHighlightRegex';

/**
 * Pure component that is actually memoed to render a single line!
 * When the props are the same as an earlier call,
 * the function will not be called and the earlier result will be used.
 */
export const MemoedSingleLogLine = React.memo(props => {
  return (
    <LogLine
      style={{
        ...props.style
      }}
      wrap={props.shouldWrap ? 'true' : undefined}
      index={props.index}
    >
      {props.line.highlightLine ? (
        <TextHighlightRegex line={props.line} color={props.highlightColor} />
      ) : (
        <span>{props.line.sections[0].text}</span>
      )}
    </LogLine>
  );
});
