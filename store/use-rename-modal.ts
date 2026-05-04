import { create } from "zustand";

const defaultValues = { id: "", title: "" };

interface IRenameModal {
    isOpen: boolean;
    initialValues: typeof defaultValues;
    anOpen: (id: string, title: string) => void;
    onClose: () => void;
}

export const useRenameModal = create<IRenameModal>((set) => ({
    isOpen: false,
    anOpen: (id, title) => set({
        isOpen: true,
        initialValues: { id, title },
    }),
    onClose: () => set({ isOpen: false, initialValues: defaultValues }),
    initialValues: defaultValues,
}));