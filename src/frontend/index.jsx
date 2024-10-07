import React, { useState, useEffect } from 'react';
import ForgeReconciler, { Text, useProductContext } from '@forge/react';
import { requestJira } from '@forge/bridge';
import { LineChart } from '@forge/react';

const LineChartWithArrayDataExample = ({ epicStoryPoints, summedChildStoryPoints }) => {
  const arrayData = [
    // ['x value', 'y value', 'series name']
    ['1', epicStoryPoints ?? 0, 'Epic Story Points'],
    ['1', summedChildStoryPoints ?? 0, 'Summed Child Story Points'],
    ['2', 40, 'Epic Story Points'],
    ['2', 14, 'Summed Child Story Points'],
    ['3', 45, 'Epic Story Points'],
    ['3', 20, 'Summed Child Story Points'],
  ];

  return (
    <LineChart
      data={arrayData}
      xAccessor={0} // position 0 in item array (X-axis values)
      yAccessor={1} // position 1 in item array (Y-axis values)
      colorAccessor={2} // position 2 in item array (series name, to differentiate the two lines)
    />
  );
};

const App = () => {
  const context = useProductContext();
  const [epicStoryPoints, setEpicStoryPoints] = useState(null);
  const [summedChildStoryPoints, setSummedChildStoryPoints] = useState(null);

  // Function to fetch the Epic's story points
  const fetchEpicStoryPoints = async () => {
    const issueId = context?.extension.issue.id;

    // Fetch the epic issue
    const res = await requestJira(`/rest/api/3/issue/${issueId}`);
    const data = await res.json();

    console.log("Epic Data: ", data); // Debugging

    // Replace with your Epic's story points field ID
    return data.fields["customfield_10035"]; 
  };

  // Function to fetch child issues linked to the epic and sum their story points
  const fetchAndSumChildStoryPoints = async () => {
    const epicKey = context?.extension.issue.key;

    // JQL query to find all issues linked to this epic
    const jql = `\"Epic Link\" = ${epicKey}`;

    // Fetch all issues linked to the epic
    const res = await requestJira(`/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=customfield_10035&maxResults=1000`);
    const data = await res.json();

    console.log("Child Issues Data: ", data); // Debugging

    const issues = data.issues;

    let totalStoryPoints = 0;

    for (const issue of issues) {
      const storyPoints = issue.fields["customfield_10035"]; // Replace with your Story Points field ID

      if (storyPoints !== undefined && storyPoints !== null) {
        totalStoryPoints += storyPoints;
      }
    }

    console.log("Total Summed Story Points from Child Issues: ", totalStoryPoints); // Debugging

    return totalStoryPoints;
  };

  useEffect(() => {
    if (context) {
      // Fetch the epic's story points
      fetchEpicStoryPoints().then((epicPoints) => {
        setEpicStoryPoints(epicPoints);

        // Fetch and sum the child issues' story points
        fetchAndSumChildStoryPoints().then((summedPoints) => {
          setSummedChildStoryPoints(summedPoints);
        });
      });
    }
  }, [context]);

  return (
    <>
      {/* Render the LineChart component only when both epicStoryPoints and summedChildStoryPoints are available */}
      {epicStoryPoints !== null && summedChildStoryPoints !== null ? (
        <LineChartWithArrayDataExample
          epicStoryPoints={epicStoryPoints}
          summedChildStoryPoints={summedChildStoryPoints}
        />
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
