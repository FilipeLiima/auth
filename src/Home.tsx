import React, { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  const [userAddress, setUserAddress] = useState(""); // Estado para armazenar o endereço do usuário autenticado

  // Função para obter o endereço do usuário autenticado
  const getUserAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        } else {
          setUserAddress(""); // Define o endereço como vazio se o usuário não estiver autenticado
        }
      } catch (error) {
        console.error("Error getting user address:", error);
      }
    }
  };

  // Efeito para verificar o endereço do usuário quando o componente é montado
  useEffect(() => {
    getUserAddress();
  }, []);

  return (
    <div>
      <h1>Bem-vindo ao Marketplace de Imóveis</h1>

      {userAddress && (
        <div>
          <p>Usuário autenticado: {userAddress}</p>
          {/* Aqui você pode adicionar botões ou links para ações específicas para usuários autenticados */}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Mapeamento dos imóveis para exibição */}
        {[...Array(6).keys()].map((index) => (
          <Card key={index} className="p-4">
            {/* Substitua este conteúdo pelas informações reais do imóvel */}
            <img
              src={`./src/assets/property${index + 1}.jpg`}
              alt={`Property ${index + 1}`}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2>Nome do Imóvel</h2>
            <p>Localização</p>
            <Button className="mt-2">
              <Wallet className="w-4 h-4 mr-2" />
              Alugar
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
