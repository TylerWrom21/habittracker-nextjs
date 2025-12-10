// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogDescription,
// 	DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// type ModalVariant = "success" | "error" | "confirm" | "info";

// interface ModalOptions {
// 	title: string;
// 	description?: string;
// 	variant?: ModalVariant;
// 	confirmText?: string;
// 	cancelText?: string;
// 	onConfirm?: () => void;
// 	onCancel?: () => void;
// }

// interface ModalContextType {
// 	openModal: (options: ModalOptions) => void;
// 	closeModal: () => void;
// }

// const ModalContext = createContext<ModalContextType | undefined>(undefined);

// export function Modal({ children }: { children: ReactNode }) {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

// 	const openModal = (options: ModalOptions) => {
// 		setModalOptions(options);
// 		setIsOpen(true);
// 	};

// 	const closeModal = () => setIsOpen(false);

// 	return (
// 		<ModalContext.Provider value={{ openModal, closeModal }}>
// 			{children}

// 			<Dialog open={isOpen} onOpenChange={closeModal}>
// 				<DialogContent>
// 					<DialogHeader>
// 						<DialogTitle>{modalOptions?.title}</DialogTitle>
// 						{modalOptions?.description && (
// 							<DialogDescription>{modalOptions.description}</DialogDescription>
// 						)}
// 					</DialogHeader>

// 					<DialogFooter className="mt-4">
// 						{/* Confirm button */}
// 						{modalOptions?.onConfirm && (
// 							<Button onClick={modalOptions.onConfirm}>
// 								{modalOptions?.confirmText || "Confirm"}
// 							</Button>
// 						)}

// 						{/* Cancel button */}
// 						{modalOptions?.onCancel && (
// 							<Button variant="outline" onClick={modalOptions.onCancel}>
// 								{modalOptions?.cancelText || "Cancel"}
// 							</Button>
// 						)}
// 					</DialogFooter>
// 				</DialogContent>
// 			</Dialog>
// 		</ModalContext.Provider>
// 	);
// }

// export const useGlobalModal = () => {
// 	const ctx = useContext(ModalContext);
// 	if (!ctx) throw new Error("useGlobalModal must be used inside ModalProvider");
// 	return ctx;
// };
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
