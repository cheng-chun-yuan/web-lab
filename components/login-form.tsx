"use client";

import type React from "react";

import { useState } from "react";
import { useUser } from "@/context/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const AVATAR_OPTIONS = [
  { id: 1, name: "file" },
  { id: 2, name: "globe" },
  { id: 3, name: "next" },
  { id: 4, name: "window" },
];

export default function LoginForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { login } = useUser();
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState({ id: 1, name: "file" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    login(name, selectedAvatar.id, selectedAvatar.name);
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Login</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Your Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Avatar</label>
          <div className="grid grid-cols-3 gap-3">
            {AVATAR_OPTIONS.map((avatar) => (
              <div
                key={avatar.id}
                className={`
      cursor-pointer rounded-lg p-2 border-2 
      ${selectedAvatar.id === avatar.id ? "border-primary" : "border-transparent"}
    `}
              onClick={() => setSelectedAvatar(avatar)}
              >
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden">
                  <img
                    src={`/${avatar.name}.svg?height=100&width=100&text=${avatar.id}`}
                    alt={`Avatar ${avatar.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Login</Button>
        </div>
      </form>
    </div>
  );
}
