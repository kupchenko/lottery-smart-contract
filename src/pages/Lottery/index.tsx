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
import {Loader2} from "lucide-react";
import {cn} from "@/components/shadcn/util/utils";
import {AlertDialog} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/shadcn/ui/alert-dialog";
import {useParams} from "react-router-dom";

const Loading = () => (
  <div className="fixed left-0 top-0 w-full h-full bg-gray-400 z-[9999] flex justify-center items-center bg-opacity-50">
    <Loader2
      className={cn('my-28 h-16 w-16 text-primary/60 animate-spin')}
    />
  </div>
)

export function Lottery() {
  const [state] = useAppContext();
  const { address } = useParams();
  // const contractAddress = '0x74De59de99e1A8b1EFfAEFffdb7D0a52D9995D5f';
  // const contractAddress = '0x5e4FE4c3b141d66B9f40f96c3B65D5f6C7da9150';
  const [appLoading, setAppLoading] = useState<boolean>(false);
  const [appError, setAppError] = useState<string>();
  const {participants, totalBank, error, loading, getContractData} = useLotteryContractData(address || '');

  if (loading) return <Loading/>;
  if (error) return <div>{error}</div>
  const joinLottery = async () => {
    setAppLoading(true);
    try {
      await enterLottery(state.address, '0.01', 'nickname')
      await getContractData();
    } catch (error: any) {
      if (error && error?.code === 4001) {
        setAppError("Looks like you rejected transaction")
      }
    }
    setAppLoading(false);
  };

  return (
    <>
      <AlertDialog open={!!appError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Something went the wrong way?</AlertDialogTitle>
            <AlertDialogDescription>
              {appError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAppError('')}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {appLoading && <Loading/>}
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
                  <TableRow key={wallet + nickname}>
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
