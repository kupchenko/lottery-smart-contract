import React, {useState} from 'react';
import '../../App.css';
import {useLotteryContractData} from "../../hooks/useLotteryContractData";
import {enterLottery, toEth} from "../../contract/lottery";
import {useAppContext} from "../../context/globalContext";

function Index() {
  const [state] = useAppContext();
  // const contractAddress = '0x74De59de99e1A8b1EFfAEFffdb7D0a52D9995D5f';
  const contractAddress = '0x5e4FE4c3b141d66B9f40f96c3B65D5f6C7da9150';
  const [appLoading, setAppLoading] = useState<boolean>(false);
  const [appError, setAppError] = useState<string>();
  const {participants, totalBank, error, loading, getContractData} = useLotteryContractData(contractAddress);

  if (appError) return <>{appError}</>;
  if (loading || appLoading) return <>Loading ...</>;
  if (error) return <div>{error}</div>
  const joinLottery = async () => {
    setAppLoading(true);
    await enterLottery(state.address, '0.01', 'nickname')
    await getContractData();
    setAppLoading(false);
  };

  return (
    <>
      <div>
        <button onClick={joinLottery}>Enroll</button>
      </div>
      <br/>
      <br/>
      Total bank: {totalBank}
      <br/>
      Total participants: {participants?.length}
      <br/>
      <ul>
        {
          participants?.map(participant => {
            const {nickname, wallet, amount} = participant;
            return (
              <li key={wallet}><b>{nickname}</b> joined with amount <b>{toEth(amount)}</b> ETH, wallet <b>{wallet}</b>
              </li>
            )
          })
        }
      </ul>
    </>
  );
}

export default Index;
