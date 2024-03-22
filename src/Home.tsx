import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { PackageCheck } from "lucide-react";
import { BadgeCheck } from "lucide-react";

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

// Importar o contrato ERC20 e ERC721
import tokenAbi from "../smart-contracts/abis/ERC20.json";
import ERC721Abi from "../smart-contracts/abis/ERC721.json";

export function Home() {
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [web3, setWeb3] = useState<ethers.providers.Web3Provider | null>(null);
  const [tokenContract, setTokenContract] = useState<any | null>(null); // Variável para o contrato ERC20
  const [nftContract, setNftContract] = useState<any | null>(null); // Variável para o contrato ERC721
  const [userWalletHash, setUserWalletHash] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const connectToBlockchain = async () => {
      const localRPC = "http://127.0.0.1:8545"; // Defina o endereço do RPC local
      const provider = new ethers.providers.JsonRpcProvider(localRPC); // Configura o provedor Web3 para se conectar ao RPC local

      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const selectedAddress = accounts[0];
          setUserWalletHash(selectedAddress);

          setWeb3(provider); // Define o provedor Web3 para a instância fornecida

          const userInfo = await fetchUserInfo(selectedAddress);
          console.log("Informações da conta:", userInfo);

          // Instanciar o contrato ERC20
          const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Substitua pelo endereço do contrato do token ERC20
          const tokenContract = new ethers.Contract(
            tokenAddress,
            tokenAbi,
            provider.getSigner()
          );
          setTokenContract(tokenContract);

          // Instanciar o contrato ERC721
          const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Substitua pelo endereço do contrato do token ERC721
          const nftContract = new ethers.Contract(
            nftAddress,
            ERC721Abi,
            provider.getSigner()
          );
          setNftContract(nftContract);
        } else {
          alert("Por favor, instale o MetaMask para se conectar.");
        }
      } catch (error) {
        console.error("Erro ao conectar à blockchain:", error);
      }
    };

    connectToBlockchain();
  }, []);

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
    if (!web3 || !nftContract) {
      alert("Por favor, conecte-se à blockchain primeiro.");
      return;
    }

    try {
      // Chamar a função apropriada do contrato ERC721 para alugar o imóvel
      await nftContract.rentToken(id);
      alert("Locação bem-sucedida!");
    } catch (error) {
      console.error("Erro ao alugar imóvel:", error);
      alert("Erro ao alugar imóvel. Consulte o console para mais detalhes.");
    }
  };

  const handleConfirmPayment = async (rentalValue: number) => {
    try {
      if (!web3 || !tokenContract || !nftContract) {
        alert("Por favor, conecte-se à blockchain primeiro.");
        return;
      }

      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const selectedAddress = accounts[0];

        // Aprovar a transferência de tokens
        await tokenContract.approve(nftContract.address, rentalValue);

        // Executar o pagamento
        const transactionReceipt = await nftContract.payRent(rentalValue);

        if (transactionReceipt.status === 1) {
          alert("Pagamento concluído com sucesso!");
        } else {
          alert("Transação falhou. Por favor, tente novamente.");
        }
      } else {
        alert("Por favor, instale o MetaMask para prosseguir com o pagamento.");
      }
    } catch (error) {
      console.error("Erro ao conectar ao MetaMask:", error);
      alert(
        "Ocorreu um erro ao conectar ao MetaMask. Por favor, tente novamente."
      );
    }
  };
  return (
    <div className="bg-black text-white h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-4 font-bold">Cryptohome</h1>
      <p className="text-l mb-4">
        Explore a wide range of apartments, houses and other property types
        available for rent
      </p>
      <p className="text-white absolute top-0 right-0 m-5">
        <span className="font-bold flex items-center">
          <PackageCheck className="text-purple-400 mr-1" />
          Wallet Connected:{" "}
          {userWalletHash
            ? userWalletHash.slice(0, 8) + "..." + userWalletHash.slice(-6)
            : ""}
        </span>{" "}
      </p>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search houses..."
        className="bg-white text-gray-800 rounded-md p-2 mb-4 pl-10"
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
                  <BadgeCheck className="mr-1" />
                  RENT
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Location</DialogTitle>
                  <DialogDescription>
                    Fill in the rental details below and click "Confirm
                    Payment".
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Provide your name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="periodoLocacao" className="text-right">
                      Enter the rental period (in months)
                    </Label>
                    <Input id="periodoLocacao" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() =>
                      handleConfirmPayment(
                        imovel.attributes.find(
                          (attr) => attr.trait_type === "Rental Value"
                        )?.value
                      )
                    }
                  >
                    Confirm Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
