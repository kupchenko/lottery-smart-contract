import {useNavigate} from "react-router-dom";
import {Button} from "@/components/shadcn/ui/button";

export const LotteryList = () => {
  const navigate = useNavigate();
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center bg-gray-400 shadow gap-5">
      <h3 className="text-[50px]">Available contracts</h3>
      <Button
        onClick={() => navigate('/lottery/0x3E240a0FC17375b8Dc69CF188Fd89E33a10cfD12')}
        >
        0x3E240a0FC17375b8Dc69CF188Fd89E33a10cfD12
      </Button>
    </div>
  )
}