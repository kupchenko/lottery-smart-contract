import React, {useEffect, useState} from 'react';
import {useLotteryContractData} from "@/hooks/useLotteryContractData";
import {enterLottery, pickWinner, toEth} from "@/contract/lottery";
import {useAppContext} from "@/context/globalContext";
import {Button} from "@/components/shadcn/ui/button";
import {Loader2} from "lucide-react";
import {cn} from "@/components/shadcn/util/utils";
import {useParams} from "react-router-dom";
import {InfoDialog} from "@/components/InfoDialog";
import {DefaultTable, TableColumn} from "@/components/DefaultTable";
import {Input} from "@/components/shadcn/ui/input";
import {EventData} from "web3-eth-contract";
import emitter from "@/events/events";
import WinnerMask, {Winner} from "@/pages/WinnerMask/WinnerMask";

const Loading = () => (
  <div className="fixed left-0 top-0 w-full h-full bg-gray-400 z-[9999] flex justify-center items-center bg-opacity-50">
    <Loader2 className={cn('my-28 h-16 w-16 text-primary/60 animate-spin')}/>
  </div>
)

const columns: Array<TableColumn> = [
  {
    title: "Nickname",
    index: "nickname",
  },
  {
    title: "Wallet",
    index: "wallet"
  },
  {
    title: "Amount",
    index: "amount",
    transform: toEth
  }
];

const PickWinnerBtn = ({participants, pickWinnerBtnHandler, owner}: {
  participants: Array<any>,
  pickWinnerBtnHandler: () => Promise<void>,
  owner: string
}) => {
  const [stat] = useAppContext();
  if (stat.address !== owner) return <div className="pt-5">You are not the owner to pick the winner</div>
  if (!participants || participants?.length < 2) {
    return <div className="pt-5">You will be able to pick winner when there are more than 2 participants.</div>
  }
  return <Button className="mt-5 mx-auto" onClick={pickWinnerBtnHandler}>Pick winner</Button>
}

export function Lottery() {
  const [state] = useAppContext();
  const {address} = useParams();
  const [appLoading, setAppLoading] = useState<boolean>(false);
  const [appError, setAppError] = useState<string>();
  const [nickname, setNickname] = useState<string>('');
  const [winner, setWinner] = useState<Winner>();
  const {participants, totalBank, error, owner, loading, getContractData} = useLotteryContractData(address || '');

  useEffect(() => {

    const onErrorPickingWinner = (error: Error) => {
      console.error(error)
    }

    const onWinnerPicked = (event: EventData) => {
      const {returnValues} = event
      setWinner({
        address: returnValues['winner'],
        prize: returnValues['prize'],
        nickname: returnValues['nickname'],
      })
    }

    emitter.on('error-picking-winner', onErrorPickingWinner)
    emitter.on('winner-picked', onWinnerPicked)

    return () => {
      emitter.off('error-picking-winner', onErrorPickingWinner)
      emitter.off('winner-picked', onWinnerPicked)
    }
  }, [])

  if (loading) return <Loading/>;
  if (error) return <div>{error}</div>
  const joinLottery = async () => {
    setAppLoading(true);
    try {
      await enterLottery(state.address, '0.01', nickname)
      await getContractData();
    } catch (error: any) {
      if (error && error?.code === 4001) {
        setAppError("Looks like you rejected transaction")
      }
    }
    setNickname('');
    setAppLoading(false);
  };

  const pickWinnerBtnHandler = async () => {
    setAppLoading(true);
    try {
      await pickWinner(state.address);
      await getContractData();
    } catch (error: any) {
      setAppError(error)
    }
    setAppLoading(false);
  }

  return (
    <>
      <WinnerMask winner={winner}/>
      <InfoDialog
        open={!!appError}
        title="Something went the wrong way?"
        description={appError || ''}
        onClose={() => setAppError('')}
      />
      {appLoading && <Loading/>}
      <div className="h-[calc(100vh-50px)] flex bg-gray-300 w-full [&>*]:w-full">
        <div className="p-3">
          <DefaultTable
            total={totalBank}
            columns={columns}
            data={participants}
          />
          <PickWinnerBtn
            participants={participants || []}
            owner={owner || ''}
            pickWinnerBtnHandler={pickWinnerBtnHandler}
          />
        </div>
        <div className="h-full bg-gray-400 flex flex-col justify-center items-center gap-5">
          <h3 className="text-[30px]">Join the lottery</h3>
          <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="max-w-[300px]" type="text"
                 placeholder="Enter nickname"/>
          <Button className="h-[50px] w-[200px]" onClick={joinLottery}>Enroll</Button>
        </div>
      </div>
    </>
  );
}
