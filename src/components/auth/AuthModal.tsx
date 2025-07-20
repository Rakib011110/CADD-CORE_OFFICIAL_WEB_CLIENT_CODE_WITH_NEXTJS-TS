"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { LogIn, UserPlus } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Reset to default tab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const handleSuccess = () => {
    onClose();
    // Small delay to allow the modal to close before reloading
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full mx-auto p-0 overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 border-b">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              CADD CORE – <span className="text-red-600">Knowledge to Design</span>
            </DialogTitle>
            <div className="w-16 h-1 bg-red-500 mx-auto rounded-full mb-3"></div>
            <p className="text-gray-600 text-sm">
              পেমেন্টের জন্য আগে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন
            </p>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
              <TabsTrigger 
                value="login" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
              >
                <LogIn className="h-4 w-4" />
                লগইন
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
              >
                <UserPlus className="h-4 w-4" />
                রেজিস্টার
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <RegisterForm onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            আপনার তথ্য সুরক্ষিত এবং গোপনীয় রাখা হবে
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
