import React, {useState} from 'react';
import {useLotteryContractData} from "@/hooks/useLotteryContractData";
import {enterLottery, toEth} from "@/contract/lottery";
import {useAppContext} from "@/context/globalContext";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/shadcn/ui/table";
import {Button} from "@/components/shadcn/ui/button";

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
      <div className="h-[100vh] flex flex-row items-center bg-gray-300">
        <Table className="m-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nickname</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              participants?.map(participant => {
                const {nickname, wallet, amount} = participant;
                return (
                  <TableRow key={wallet}>
                    <TableCell className="font-medium">{nickname}</TableCell>
                    <TableCell>{wallet}</TableCell>
                    <TableCell>{toEth(amount)}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">{totalBank}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="h-full w-full bg-gray-400 flex justify-center items-center">
          <Button onClick={joinLottery}>Enroll</Button>
        </div>
      </div>
    </>
  );
}

export default Index;
