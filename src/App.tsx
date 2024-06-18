import React from 'react';
import './App.css';
import {useLotteryContractData} from "./hooks/useLotteryContractData";

function App() {
  const asd = '0x74De59de99e1A8b1EFfAEFffdb7D0a52D9995D5f';
  const { participants, totalBank, error } = useLotteryContractData(asd);

  if (error) return <div>{error}</div>
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
