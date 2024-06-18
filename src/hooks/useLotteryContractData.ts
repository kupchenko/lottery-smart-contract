import {useEffect, useState} from "react";
import {getLotteryTotalBank, getParticipants} from "../contract/lottery";

type LotteryState = {
  participants: Array<any>
  totalBank: string
}

export const useLotteryContractData = (address: string) => {
  const [lotteryData, setLotteryData] = useState<LotteryState>();
  useEffect(() => {
    if (!address) return;
    console.log('gete', address);
    const getContractData = async () => {
      const [participants, totalBank] = await Promise.all([
        getParticipants(address),
        getLotteryTotalBank(address)
      ]);
      setLotteryData({
        participants,
        totalBank
      })
    }
    getContractData();
  }, [address])

  return {...lotteryData}
}