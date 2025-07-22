"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Wheel } from "@/types";
import { PlusCircle, Trash2 } from "lucide-react";

interface WheelManagerProps {
  wheels: Wheel[];
  activeWheelId: string | null;
  onWheelSelect: (id: string) => void;
  onAddWheel: (name: string) => void;
  onDeleteWheel: (id: string) => void;
}

export default function WheelManager({
  wheels,
  activeWheelId,
  onWheelSelect,
  onAddWheel,
  onDeleteWheel,
}: WheelManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newWheelName, setNewWheelName] = useState("");

  const handleAddWheel = () => {
    if (newWheelName.trim()) {
      onAddWheel(newWheelName.trim());
      setNewWheelName("");
      setIsAddDialogOpen(false);
    }
  };

  const handleDelete = () => {
    if (activeWheelId) {
      onDeleteWheel(activeWheelId);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={onWheelSelect}
        value={activeWheelId ?? ""}
        disabled={wheels.length === 0}
      >
        <SelectTrigger className="w-[180px] md:w-[250px]">
          <SelectValue placeholder="Select a wheel" />
        </SelectTrigger>
        <SelectContent>
          {wheels.map((wheel) => (
            <SelectItem key={wheel.id} value={wheel.id}>
              {wheel.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <Button variant="ghost" size="icon" onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="h-5 w-5" />
          <span className="sr-only">Add new wheel</span>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Wheel</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter wheel name..."
              value={newWheelName}
              onChange={(e) => setNewWheelName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddWheel()}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleAddWheel}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" disabled={!activeWheelId || wheels.length <= 1}>
            <Trash2 className="h-5 w-5 text-destructive" />
            <span className="sr-only">Delete wheel</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              current wheel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
