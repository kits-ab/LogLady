import React, { useState } from 'react';
import { Tab, TabPanel } from '../styledComponents/TabPanelStyledComponents';
import { showOpenDialog } from './helpers/handleFileHelper';

export default function TabPanelContainer() {
  const [state, setState] = useState(0);
  const mockLogs = ['loggen', 'loggo', 'loggas'];

  function tabOnClick(index) {
    setState(index);
  }

  return (
    <TabPanel>
      {mockLogs.map((log, index) => {
        return (
            <Tab
              key={index}
              selected={index === state ? true : false}
              index={index}
              onClick={() => {
                tabOnClick(index);
              }}
            >
              {log}
            </Tab>
        );
      })}
      <button onClick={ showOpenDialog } > + </button>
    </TabPanel>
  );
}
