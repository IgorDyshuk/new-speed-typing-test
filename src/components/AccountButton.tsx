import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { useAccountStore } from "@/store/useAccountStore";
import { RiAccountCircleLine } from "react-icons/ri";
import { RiAccountCircleFill } from "react-icons/ri";
import { useRef, useState } from "react";

export default function AccountButton() {
  const { username, setUsername } = useAccountStore();
  const trimedUsername = username.trim();
  const isLoggedIn = Boolean(trimedUsername);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="flex items-center gap-2">
          {isLoggedIn ? (
            <RiAccountCircleFill className="h-7 w-7" />
          ) : (
            <RiAccountCircleLine className="h-7 w-7" />
          )}
          <span>{trimedUsername}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set username</DialogTitle>
          <DialogDescription>
            This name appears on your stats.{" "}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="username-1">Username</Label>
            <Input
              id="username-1"
              name="username"
              ref={inputRef}
              defaultValue={username}
              placeholder="Enter username"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            variant="subbmit"
            onClick={() => {
              const next = inputRef.current?.value?.trim() ?? "";
              setUsername(next);
              setOpen(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
