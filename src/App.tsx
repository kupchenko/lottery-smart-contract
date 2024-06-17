import React from 'react';
import './App.css';
import {useLotteryContractData} from "./hooks/useLotteryContractData";

function App() {
  const asd = 'asd';
  const { participants, totalBank } = useLotteryContractData(asd);
  return (
    <>
      {participants}
      <br />
      {totalBank}
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </>
  );
}

export default App;
