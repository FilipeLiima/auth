import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Web3 from "web3"; // Importe a biblioteca web3.js ou ethers.js

export function Home() {
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [userWalletHash, setUserWalletHash] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const connectToBlockchain = async () => {
      if ((window as any).ethereum) {
        // Usando type assertion para indicar que 'ethereum' existe em 'window'
        try {
          await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });
          const web3Instance = new Web3((window as any).ethereum);
          setWeb3(web3Instance);

          const contractAddress = "SEU_ENDERECO_DO_CONTRATO";
          const contractABI = SEU_ABI_DO_CONTRATO;
          const contractInstance = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          setContract(contractInstance);

          const selectedAddress =
            (window as any).ethereum.selectedAddress || "";
          setUserWalletHash(selectedAddress);
        } catch (error) {
          console.error("Erro ao conectar ao MetaMask:", error);
        }
      } else {
        alert("Por favor, instale o MetaMask para se conectar.");
      }
    };

    connectToBlockchain();
  }, []);

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
    <div className="bg-purple-900 text-white h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-4">Bem vindo ao CryptoHome</h1>
      <p className="text-l mb-4">
        Explore uma ampla variedade de opções de apartamentos, casas e outros
        tipos de propriedades disponíveis para aluguel
      </p>
      <p className="absolute top-0 right-0 m-5 font-bold">
        Carteira conectada:{" "}
        {userWalletHash
          ? userWalletHash.slice(0, 8) + "..." + userWalletHash.slice(-6)
          : ""}
      </p>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar imóveis..."
        className="bg-white text-gray-800 rounded-md p-2 mb-4"
        style={{ width: "50%", padding: "0.5rem" }}
      />

      <div className="grid grid-cols-3 gap-4">
        {imoveis.map((imovel, index) => (
          <div key={index} className="bg-white p-4 rounded-md">
            <img
              src={imovel.image}
              alt={imovel.name}
              className="w-full h-auto mb-2 rounded-md"
            />
            <p className="text-gray-800">{imovel.description}</p>
            <p className="text-gray-800">Endereço: {imovel.address}</p>
            <button
              className="bg-purple-600 text-white py-2 px-4 rounded-md mt-2"
              onClick={() => handleLocacao(imovel.id)}
            >
              Alugar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
