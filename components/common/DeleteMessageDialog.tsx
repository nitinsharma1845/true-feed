"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteMessage } from "@/services/message.service";

export default function DeleteMessageDialog({
  open,
  setOpen,
  messageId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  messageId: string;
}) {
  const deleteMessage = useDeleteMessage();

  const handleClick = async () => {
    deleteMessage.mutate(messageId);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            The message will be permanetly deleted from your account. Are you
            sure to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMessage.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleClick}
            disabled={deleteMessage.isPending}
          >
            {deleteMessage.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
