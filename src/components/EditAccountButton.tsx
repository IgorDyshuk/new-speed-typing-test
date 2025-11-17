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
import { useRef, useState } from "react";
import { PenLine } from "lucide-react";
import { toast } from "sonner";

export default function EditAccountButton() {
  const { username, setUsername } = useAccountStore();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="absolute right-0 h-full hover:bg-text hover:cursor-pointer hover:text-background px-1.5 rounded-r-xl">
          <PenLine />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set new username</DialogTitle>
          <DialogDescription>
            This will replace your current username everywhere.
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
                const next = inputRef.current?.value.trim() ?? "";
                setUsername(next);
                setOpen(false);
                toast.success("You successfully change your username");
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
              const next = inputRef.current?.value?.trim() ?? "";
              setUsername(next);
              setOpen(false);
              toast.success("You successfully change your username");
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
