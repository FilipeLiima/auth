import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Mail } from "lucide-react";
import { Chrome } from "lucide-react";
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
        <div className="bg-gray-800 p-4 flex justify-center items-center h-screen">
          <img
            src="./src/assets/img3.svg"
            alt="Descrição da imagem"
            className="w-4/5 h-4/5rounded-lg"
          />
        </div>

        <div className="bg-black flex flex-col justify-center items-center ">
          <Card className="bg-black p-6 w-[400px] self-center border-none relative">
            <h1 className="text-3xl flex flex-col justify-center items-center text-white font-bold">
              Create an account
            </h1>
            <h1 className=" text-2 p-2 flex flex-col justify-center items-center text-white w-full">
              Enter your email below to create your account
            </h1>
            <Input
              className=" self-center text-white w-full"
              placeholder="nome@examplo.com"
            />
            <div className=" flex flex-col justify-center items-center">
              <Button className="p-5 m-5 hover:bg-gray-200 bg-white text-black w-full">
                Register
              </Button>
              <h1 className="text-1 flex flex-col justify-center items-center text-white">
                OR CONTINUE WITH
              </h1>
              <div className="flex justify-between w-full">
                <Button className="p-5 m-5 bg-black text-white hover:bg-gray-800 w-full ">
                  <Mail className=" w-5 h-5 mr-2" />
                  Microsoft
                </Button>
                <Button className="p-5 m-5 bg-black text-white hover:bg-gray-800 w-full ">
                  <Chrome className=" w-5 h-5 mr-2" />
                  Google
                </Button>
              </div>
            </div>
            <h1 className="p-6 text-2 flex flex-col justify-center items-center text-white">
              Already have an account?
            </h1>
            <Button className="p-5 m-5 hover:bg-gray-200 bg-white text-black w-full">
              Login
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
