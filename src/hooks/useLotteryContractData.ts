import {useEffect, useState} from "react";
import {getLotteryTotalBank, getParticipants} from "../contract/lottery";

type LotteryState = {
  participants: Array<any>
  totalBank: string
}

export const useLotteryContractData = (address: string) => {
  const [lotteryData, setLotteryData] = useState<LotteryState>();
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (!address) return;

    const getContractData = async () => {
      try {
        const [participants, totalBank] = await Promise.allSettled([
          getParticipants(address),
          getLotteryTotalBank(address)
        ]);
        setLotteryData({
          participants: (participants.status === 'fulfilled') ? participants.value : [],
          totalBank: (totalBank.status === 'fulfilled') ? totalBank.value : '',
        })
      } catch (error) {
        let errorMessage = "Failed fetch smart contract data";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      }
    }
    getContractData();
  }, [address])

  return {...lotteryData, error}
}