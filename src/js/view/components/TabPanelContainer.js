import React, { useState } from 'react';
import { Tab, TabPanel } from '../styledComponents/TabPanelStyledComponents';

export default function TabPanelContainer() {
  const [state, setState] = useState(0);
  const mockLogs = ['loggen', 'loggo', 'loggas'];
  function tabOnClick(index) {
    setState(index);
  }

  // const mockLogsF = mockLogs.map((log, index) => {
  //   return (
  //     <Tab
  //       key={index}
  //       selected={index === state ? true : false}
  //       index={index}
  //       onClick={() => {
  //         tabOnClick(index);
  //       }}
  //     >
  //       {log}
  //     </Tab>
  //   );
  // });

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
    </TabPanel>
  );
}
