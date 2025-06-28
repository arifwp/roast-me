import { optionsUrl, SelectOption } from "@/components/DropdownUrl";
import { create } from "zustand";

interface InputGroupState {
  listInputs: SelectOption[];
  addInput: (data: SelectOption) => void;
  removeInput: (id: number) => void;
  initialize: VoidFunction;
}

export const useInputGroupStore = create<InputGroupState>((set) => ({
  listInputs: [],
  addInput: (data: SelectOption) => {
    set((state) => {
      return { listInputs: [...state.listInputs, data] };
    });
  },
  removeInput: (id: number) => {
    set((state) => ({
      listInputs: state.listInputs.filter(
        (item: SelectOption) => item.id !== id
      ),
    }));
  },
  initialize: () => {
    set(() => ({
      listInputs: [optionsUrl[0]],
    }));
  },
}));
