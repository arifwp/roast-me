import { useInputGroupStore } from "@/hooks/useInputGroup";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export interface SelectOption {
  id: number;
  name: string;
  value: "linkedinUrl" | "githubUrl" | "cv";
}

export const optionsUrl: SelectOption[] = [
  { id: 1, name: "LinkedIn Url", value: "linkedinUrl" },
  { id: 2, name: "Github Url", value: "githubUrl" },
  { id: 3, name: "Upload CV", value: "cv" },
];

export const DropdownUrl = ({ disabled = false }: { disabled?: boolean }) => {
  const { listInputs, addInput } = useInputGroupStore();

  const availableOptions = optionsUrl.filter(
    (option) => !listInputs.some((v) => option.id === v.id)
  );

  const handleChange = (value: SelectOption) => {
    addInput(value);
  };

  if (availableOptions.length === 0) {
    return;
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-(--color-brown-bold) hover:bg-(--color-secondary) transition-colors ease-in-out duration-200 cursor-pointer"
          disabled={disabled}
        >
          Tambahkan
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-(--color-brown-bold)"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-(--color-secondary) shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          {availableOptions.map((item) => (
            <MenuItem key={item.id}>
              <p
                className="block px-4 py-2 text-sm text-(--color-brown-bold) data-focus:bg-(--color-brown-bold) data-focus:text-white data-focus:outline-hidden cursor-pointer"
                onClick={() => handleChange(item)}
              >
                {item.name}
              </p>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};
