import React, { useState } from 'react';
import { Tab, TabPanel } from '../styledComponents/TabPanelStyledComponents';
import { connect } from 'react-redux';

function TabPanelContainer(props) {
  const [state, setState] = useState(0);
  const mockLogs = ['loggen', 'loggo', 'loggas'];
  function tabOnClick(index) {
    setState(index);
  }
  console.log(props.state);

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

const mapStateToProps = function(state) {
  return {
    state: state
  };
};

export default connect(mapStateToProps)(TabPanelContainer);
