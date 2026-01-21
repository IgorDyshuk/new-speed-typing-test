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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export default function AccountButton() {
  const { isAuthenticated, login } = useAuthStore();
  const { username, setUsername } = useAccountStore();
  const formattedUsername = username.trim();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const submit = () => {
    const next = inputRef.current?.value.trim() ?? "";
    if (!next) return;
    const userId = crypto.randomUUID();
    login(userId);
    setUsername(next);
    setOpen(false);
    toast.success("You successfully sign up");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isAuthenticated && next) return;
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={(event) => {
            if (!isAuthenticated) return;
            event.preventDefault();
            navigate("/statistic");
          }}
        >
          {isAuthenticated ? (
            <RiAccountCircleFill className="h-7 w-7" />
          ) : (
            <RiAccountCircleLine className="h-7 w-7" />
          )}
          <span>{formattedUsername}</span>
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
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                submit();
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            variant="submit"
            onClick={() => {
              submit();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
