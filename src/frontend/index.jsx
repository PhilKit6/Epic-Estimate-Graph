import React, { useState, useEffect } from 'react';
import ForgeReconciler, { Text, useProductContext } from '@forge/react';
import { invoke, requestJira } from '@forge/bridge';
import { LineChart } from '@forge/react';

const LineChartWithArrayDataExample = ({ storyPoints }) => {
  // Updated to use dynamic storyPoints
  const arrayData = [
    // ['x value', 'y value', 'color value']
    ['1', storyPoints ?? 0, 'Epic Estimate'],
    ['1', 1, 'Sum of Effort'],
    ['2', 45, 'Epic Estimate'],
    ['2', 5, 'Sum of Effort'],
    ['3', 43, 'Epic Estimate'],
    ['3', 10, 'Sum of Effort'],
    ['4', 30, 'Epic Estimate'],
    ['4', 50, 'Sum of Effort'],
  ];

  return (
    <LineChart
      data={arrayData}
      xAccessor={0} // position 0 in item array
      yAccessor={1} // position 1 in item array
      colorAccessor={2} // position 2 in item array
    />
  );
};

const App = () => {
  const context = useProductContext();
  const [storyPoints, setStoryPoints] = useState(null);
  const [data, setData] = useState(null);

  const fetchStoryPointsForIssue = async () => {
    const issueId = context?.extension.issue.id;
    const res = await requestJira(`/rest/api/3/issue/${issueId}`);
    const data = await res.json();
    return data.fields["customfield_10035"]; // Access the storypoints field
  };

  useEffect(() => {
    if (context) {
      fetchStoryPointsForIssue().then(setStoryPoints);
    }
  }, [context]);

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  return (
    <>
      <Text>eyup world</Text>
      <Text>{data ? data : 'Loading...'}</Text>

      {/* Render the LineChart component only when storyPoints is available */}
      {storyPoints !== null ? (
        <LineChartWithArrayDataExample storyPoints={storyPoints} />
      ) : (
        <Text>Loading story points...</Text>
      )}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
