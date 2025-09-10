import { PiCursorClickFill } from "react-icons/pi";

export default function ModalBlur() {
  return (
    <div className="modal-text absolute inset-0 z-20 pointer-events-none w-full h-full flex justify-center items-center hover:cursor-pointer">
      <div className="relative z-10 text-text text-2xl flex items-center gap-2">
        <PiCursorClickFill />
        click here to focus
      </div>
    </div>
  );
}
