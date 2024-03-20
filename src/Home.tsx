import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers"; // Importe a biblioteca ethers.js
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Home() {
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [web3, setWeb3] = useState<ethers.providers.Web3Provider | null>(null); // Altere para o tipo correto de provedor ethers.js
  const [contract, setContract] = useState<any | null>(null);
  const [userWalletHash, setUserWalletHash] = useState<string>(""); // Inicialize com uma string vazia
  const location = useLocation();

  useEffect(() => {
    const connectToBlockchain = async () => {
      if (window.ethereum) {
        try {
          // Conectar à carteira usando ethers.js
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const selectedAddress = accounts[0];
          setUserWalletHash(selectedAddress);

          // Inicializar o provedor ethers.js
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setWeb3(provider);

          // Obter informações da conta
          const userInfo = await fetchUserInfo(selectedAddress);
          console.log("Informações da conta:", userInfo);
        } catch (error) {
          console.error("Erro ao conectar ao MetaMask:", error);
        }
      } else {
        alert("Por favor, instale o MetaMask para se conectar.");
      }
    };

    connectToBlockchain();
  }, []);

  // Função para buscar informações da conta
  const fetchUserInfo = async (address: string) => {
    try {
      const response = await fetch(`/api/account-info?address=${address}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar informações da conta:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        const response1 = await fetch("/src/metadata/imovel1.json");
        const data1 = await response1.json();

        const response2 = await fetch("/src/metadata/imovel2.json");
        const data2 = await response2.json();

        const response3 = await fetch("/src/metadata/imovel3.json");
        const data3 = await response3.json();

        setImoveis([data1, data2, data3]);
      } catch (error) {
        console.error("Error fetching imoveis:", error);
      }
    };

    fetchImoveis();
  }, []);

  const handleLocacao = async (id: string) => {
    if (!web3 || !contract) {
      alert("Por favor, conecte-se à blockchain primeiro.");
      return;
    }

    try {
      await contract.methods.locarImovel(id).send({ from: userWalletHash });
      alert("Locação bem-sucedida!");
    } catch (error) {
      console.error("Erro ao alugar imóvel:", error);
      alert("Erro ao alugar imóvel. Consulte o console para mais detalhes.");
    }
  };

  return (
    <div className="bg-black text-white h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-4 font-bold">Cryptohome</h1>
      <p className="text-l mb-4">
        Explore a wide range of apartments, houses and other property types
        available for rent
      </p>
      <p className=" text-purple-500 absolute top-0 right-0 m-5 font-bold ">
        Wallet Connected:{" "}
        {userWalletHash
          ? userWalletHash.slice(0, 8) + "..." + userWalletHash.slice(-6)
          : ""}
      </p>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search houses..."
        className="bg-white text-gray-800 rounded-md p-2 mb-4"
        style={{ width: "50%", padding: "0.5rem" }}
      />

      <div className="grid grid-cols-3 gap-4">
        {imoveis.map((imovel, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-md">
            <img
              src={imovel.image}
              alt={imovel.name}
              className="w-full h-auto mb-2 rounded-md"
            />
            <p className="text-white">{imovel.description}</p>
            <p className="text-white">Endereço: {imovel.address}</p>
            <ul className="text-white">
              {imovel.attributes.map((attribute, attrIndex) => (
                <li key={attrIndex}>
                  {attribute.trait_type}: {attribute.value}
                </li>
              ))}
              <li>{imovel.rental_value}</li>
            </ul>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 bg-purple-900 text-white font-bold">
                  Alugar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Locação</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes da locação abaixo e clique em
                    "Confirmar Locação".
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Informe seu nome
                    </Label>
                    <Input id="name" value="" className="col-span-3" />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="periodoLocacao" className="text-right">
                      Informe o período de Locação (em meses)
                    </Label>
                    <Input
                      id="periodoLocacao"
                      value=""
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Confirmar pagamento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
