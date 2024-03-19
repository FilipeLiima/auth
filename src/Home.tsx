import { useLocation } from "react-router-dom";

export function Home() {
  // Obter a localização atual para acessar os parâmetros da URL
  const location = useLocation();
  // Extrair o parâmetro "walletHash" da query string da URL
  const queryParams = new URLSearchParams(location.search);
  const userWalletHash = queryParams.get("walletHash") || "";

  return (
    <div className="bg-purple-900 text-white h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-4">Marketplace</h1>
      <p className="absolute top-0 right-0 m-5 font-bold">
        Carteira conectada: {userWalletHash}
      </p>

      {/* Cards de imóveis */}
      <div className="grid grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-md">
          <img
            src="imagem1.jpg"
            alt="Imóvel 1"
            className="w-full h-auto mb-2 rounded-md"
          />
          <p className="text-gray-800">Descrição do Imóvel 1</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-md">
          <img
            src="imagem2.jpg"
            alt="Imóvel 2"
            className="w-full h-auto mb-2 rounded-md"
          />
          <p className="text-gray-800">Descrição do Imóvel 2</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-md">
          <img
            src="imagem3.jpg"
            alt="Imóvel 3"
            className="w-full h-auto mb-2 rounded-md"
          />
          <p className="text-gray-800">Descrição do Imóvel 3</p>
        </div>
      </div>
    </div>
  );
}
