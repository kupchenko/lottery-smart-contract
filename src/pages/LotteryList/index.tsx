import {useNavigate} from "react-router-dom";
import {Button} from "@/components/shadcn/ui/button";

export const LotteryList = () => {
  const navigate = useNavigate();
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center bg-gray-400 shadow gap-5">
      <h3 className="text-[50px]">Available contracts</h3>
      <Button
        onClick={() => navigate('/lottery/0x931F69634907E8455b874f3dD7f97af399d60fDc')}
        >
        0x931F69634907E8455b874f3dD7f97af399d60fDc
      </Button>
    </div>
  )
}