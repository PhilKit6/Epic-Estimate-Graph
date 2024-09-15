import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke } from '@forge/bridge';
import { LineChart } from '@forge/react';

// Sample data array (can be moved to a separate file if needed)
const arrayData = [
  // in this example ['x value', 'y value', 'color value']
  ['Apple', 10, 'Dog'],
  ['Apple', 1, 'Cat'],
  ['Apple', 25, 'Horse'],
  ['Apple', 5, 'Elephant'],
  ['Banana', 5, 'Dog'],
  ['Banana', 5, 'Cat'],
  ['Banana', 15, 'Horse'],
  ['Banana', 20, 'Elephant'],
  ['Kumquat', 15, 'Dog'],
  ['Kumquat', 10, 'Cat'],
  ['Kumquat', 25, 'Horse'],
  ['Kumquat', 20, 'Elephant'],
  ['Dragonfruit', 30, 'Dog'],
  ['Dragonfruit', 20, 'Cat'],
  ['Dragonfruit', 5, 'Horse'],
  ['Dragonfruit', 10, 'Elephant'],
];

// The chart component definition
const LineChartWithArrayDataExample = () => {
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
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  return (
    <>
      <Text>eyup world</Text>
      <Text>{data ? data : 'Loading...'}</Text>
      
      {/* Render the LineChart component below */}
      <LineChartWithArrayDataExample />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
