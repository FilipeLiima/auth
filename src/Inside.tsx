import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MenuItem {
  label: string;
  action: () => void;
}

export function Inside() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { label: "Profile", action: () => setSelectedItem("Profile") },
    { label: "Announcement", action: () => setSelectedItem("Announcement") },
    {
      label: "Smart Contract",
      action: () => setSelectedItem("Smart Contract"),
    },
    { label: "Account", action: () => setSelectedItem("Account") },
    // Adicione outros itens de menu conforme necessário
  ];

  const renderContent = () => {
    switch (selectedItem) {
      case "Profile":
        return (
          <div className="flex justify-center items-center h-screen">
            <Tabs defaultValue="account" className="w-[400px]">
              <TabsList className="grid w-full bg-black">
                <TabsTrigger value="account">Profile User</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Card className="bg-black text-white">
                  <CardHeader>
                    <CardTitle>Profile user</CardTitle>
                    <CardDescription className="text-white">
                      Make changes to your account here. Click save when you're
                      done.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="Your name" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="username">Surname</Label>
                      <Input id="username" defaultValue="Your surname" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                <Card>{/* Conteúdo da senha */}</Card>
              </TabsContent>
            </Tabs>
          </div>
        );
      case "Announcement":
        return <div>Conteúdo do anúncio</div>;
      case "Smart Contract":
        return <div>Conteúdo do contrato inteligente</div>;
      case "Account":
        return <div>Conteúdo da conta</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row h-screen">
      <div className="flex flex-col w-64 bg-gray-800 text-white">
        <div className="p-4 flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-2">Olá, Fulano</div>
        </div>

        {/* Renderização dos itens de menu */}
        {menuItems.map((item, index) => (
          <div className="p-4" key={index}>
            <Button className="w-full text-left" onClick={item.action}>
              {item.label}
            </Button>
          </div>
        ))}

        <div className="flex-grow"></div>
      </div>

      {/* Renderização do conteúdo selecionado */}
      <div className="flex flex-col flex-1 bg-black text-white">
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
}
