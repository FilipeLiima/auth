import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Mail } from "lucide-react";
import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

export function App() {
  return (
    <div className="relative">
      <img
        src="src/assets/img4.svg"
        alt="Logo"
        className="absolute top-0 left-0 m-5"
        style={{ width: "100px", height: "auto" }}
      />

      <Button className="absolute top-0 right-0 m-5 bg-black text-white hover:bg-gray-800">
        How does it work?
      </Button>

      <div className="grid grid-cols-2 ">
        <div className="bg-purple-900 p-4 flex justify-center items-center h-screen">
          <img
            src="./src/assets/eth.jpg"
            alt="Descrição da imagem"
            className="w-4/5 h-4/5rounded-lg"
          />
        </div>

        <div className="bg-black flex flex-col justify-center items-center ">
          <Card className="bg-black p-6 w-[400px] self-center border-none relative">
            <h1 className="text-3xl flex flex-col justify-center items-center text-white font-bold">
              A growing network of DeFi Contracts
            </h1>
            <h2 className="text-white py-6">
              Buyers, sellers, and instituitions participate together in a
              financial marketplace that is open and accessible to all.
            </h2>

            <div className=" flex flex-col justify-center items-center">
              <Button className="p-5 m-5 hover:bg-gray-200 bg-white text-black w-full">
                <Wallet className=" w-5 h-5 mr-2" />
                Connect
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
