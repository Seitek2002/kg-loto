import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";

interface TicketCardProps {
  ticketNumber: number | string;
  price: number;
  selectedNumbers: number[];
  /** Multiple grids (one per сетка). When provided, overrides selectedNumbers. */
  combinations?: number[][];
  isInBasket: boolean;
  onToggle: () => void;
  maxNumber?: number;
  gridCols?: number;
}

function NumberGrid({
  selected,
  maxNumber,
  gridCols,
}: {
  selected: number[];
  maxNumber: number;
  gridCols: number;
}) {
  const selectedSet = new Set(selected);
  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
  return (
    <div
      className="grid gap-1.5 flex-1"
      style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
    >
      {numbers.map((num) => (
        <div
          key={num}
          className={cn(
            "flex items-center justify-center aspect-square rounded-md text-[11px] font-bold transition-colors",
            selectedSet.has(num)
              ? "bg-[#FF7600] text-white shadow-sm"
              : "bg-[#F9F9F9] text-[#4B4B4B]",
          )}
        >
          {num}
        </div>
      ))}
    </div>
  );
}

export const DrawTicketCard = ({
  ticketNumber,
  price,
  selectedNumbers,
  combinations,
  isInBasket,
  onToggle,
  maxNumber = 36,
  gridCols = 6,
}: TicketCardProps) => {
  const grids =
    combinations && combinations.length > 0 ? combinations : [selectedNumbers];
  const multiGrid = grids.length > 1;

  return (
    <div
      className={cn(
        "bg-white rounded-3xl py-5 px-2 shadow-sm border flex flex-col relative transition-colors duration-300",
        isInBasket ? "border-[#4B4B4B]" : "border-gray-100",
      )}
    >
      {/* Боковые вырезы */}
      <div className="absolute -left-2 top-7.5 w-4 h-4 bg-[#F5F5F5] rounded-full border-r border-gray-100" />
      <div className="absolute -right-2 top-7.5 w-4 h-4 bg-[#F5F5F5] rounded-full border-l border-gray-100" />

      <div className="flex justify-between font-benzin items-center border-b border-dashed border-gray-300 pb-4 mb-4 px-3">
        <span className="text-[#737373] font-medium text-sm">
          Билет №{ticketNumber}
        </span>
        <span className="font-bold text-[#4B4B4B] text-[16px]">
          {price} <span className="underline">с</span>
        </span>
      </div>

      {/* Grids — side by side when multiple */}
      <div className={cn("mb-6", multiGrid ? "flex gap-2" : "")}>
        {grids.map((nums, idx) => (
          <div key={idx} className={cn("flex gap-2 flex-1 min-w-0")}>
            {idx > 0 && (
              <div className="border-l border-dashed border-gray-300 self-stretch" />
            )}
            <NumberGrid
              selected={nums}
              maxNumber={maxNumber}
              gridCols={gridCols}
            />
          </div>
        ))}
      </div>

      <Button
        onClick={onToggle}
        className={cn(
          "w-full py-3.5 rounded-2xl text-[13px] shadow-sm mx-auto",
          isInBasket
            ? "bg-[#4B4B4B] text-white hover:bg-gray-800"
            : "bg-[#FF7600] text-white hover:bg-[#E56A00]",
        )}
      >
        {isInBasket ? "Убрать из корзины" : `Добавить • ${price} с`}
      </Button>
    </div>
  );
};
