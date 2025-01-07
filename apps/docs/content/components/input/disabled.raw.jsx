import {Input} from "@heroui/react";

export default function App() {
  return (
    <Input
      isDisabled
      className="max-w-xs"
      defaultValue="junior@heroui.com"
      label="Email"
      type="email"
    />
  );
}
