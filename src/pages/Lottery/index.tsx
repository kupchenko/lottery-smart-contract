import React, {useState} from 'react';
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

export function Lottery() {
  const [state] = useAppContext();
  const {address} = useParams();
  // const contractAddress = '0x74De59de99e1A8b1EFfAEFffdb7D0a52D9995D5f';
  // const contractAddress = '0x5e4FE4c3b141d66B9f40f96c3B65D5f6C7da9150';
  const [appLoading, setAppLoading] = useState<boolean>(false);
  const [appError, setAppError] = useState<string>();
  const [nickname, setNickname] = useState<string>('');
  const {participants, totalBank, error, loading, getContractData} = useLotteryContractData(address || '');

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
    setAppLoading(false);
  };

  const pickWinnerBtnHandler = async () => {
    setAppLoading(true);
    try {
      await pickWinner();
      await getContractData();
    } catch (error: any) {
      setAppError(error)
    }
    setAppLoading(false);
  }

  return (
    <>
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
          {participants?.length && participants?.length > 0 && (
            <Button className="mt-5 mx-auto" onClick={pickWinnerBtnHandler}>Pick winner</Button>
          )}
        </div>
        <div className="h-full bg-gray-400 flex flex-col justify-center items-center gap-5">
          <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="max-w-[300px]" type="text"
                 placeholder="Enter nickname"/>
          <Button className="h-[50px] w-[200px]" onClick={joinLottery}>Enroll</Button>
        </div>
      </div>
    </>
  );
}
