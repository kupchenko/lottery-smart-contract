import {useNavigate} from "react-router-dom";
import {Button} from "@/components/shadcn/ui/button";

export const LotteryList = () => {
  const navigate = useNavigate();
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center bg-gray-400 shadow gap-5">
      <h3 className="text-[50px]">Available contracts</h3>
      <Button
        onClick={() => navigate('/lottery/0x5e4FE4c3b141d66B9f40f96c3B65D5f6C7da9150')}
        >
        0x5e4FE4c3b141d66B9f40f96c3B65D5f6C7da9150
      </Button>
    </div>
  )
}