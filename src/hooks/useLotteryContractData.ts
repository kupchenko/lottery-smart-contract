import {useEffect, useState} from "react";
import {getAddressBalance, getContractOwner, getParticipants} from "@/contract/lottery";

type LotteryState = {
  participants: Array<any>
  totalBank: string
  owner: string
}

export const useLotteryContractData = (address: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [lotteryData, setLotteryData] = useState<LotteryState>();
  const [error, setError] = useState<string>();

  const getContractData = async () => {
    setLoading(true);
    try {
      const [participants, totalBank, owner] = await Promise.allSettled([
        getParticipants(),
        getAddressBalance(address),
        getContractOwner(),
      ]);
      setLotteryData({
        participants: (participants.status === 'fulfilled') ? participants.value : [],
        totalBank: (totalBank.status === 'fulfilled') ? totalBank.value : '',
        owner: (owner.status === 'fulfilled') ? owner.value : '',
      })
    } catch (error) {
      let errorMessage = "Failed fetch smart contract data";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!address) return;
    getContractData();
  }, [address])

  return {...lotteryData, loading, error, getContractData}
}