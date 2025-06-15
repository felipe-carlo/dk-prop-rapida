
import { useState } from "react";

const MIN = 10_000;
const MAX = 500_000;

function stepFor(val: number) {
  if (val <= 50_000) return 5_000;
  if (val <= 150_000) return 10_000;
  return 50_000;
}

interface BudgetSliderProps {
  value: number;
  setValue: (value: number) => void;
}

export default function BudgetSlider({ value, setValue }: BudgetSliderProps) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState<string | number>(value);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const step = stepFor(raw);
    const rounded = Math.round(raw / step) * step;
    setValue(rounded);
    setInputVal(rounded);
  };

  const commitInput = () => {
    let v = Number(inputVal) || MIN;
    if (v < MIN) v = MIN;
    // aceita valores > MAX; slider trava no fim mas display mostra real valor
    setValue(v);
    setEditing(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Slider */}
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={Math.min(value, MAX)}
        onChange={handleSlider}
        className="w-full accent-[#0066FF] h-2 rounded-full bg-gray-200"
      />

      {/* Labels extremos */}
      <div className="flex justify-between w-full text-xs text-gray-500">
        <span>R$ 10.000</span>
        <span>R$ 500.000+</span>
      </div>

      {/* Valor exibido ou campo de entrada */}
      {editing ? (
        <input
          type="number"
          step="1000"
          min={MIN}
          className="text-3xl font-bold text-[#0066FF] text-center outline-none w-48"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={commitInput}
          onKeyDown={(e) => e.key === 'Enter' && commitInput()}
        />
      ) : (
        <h2
          className="text-3xl font-bold text-[#0066FF] cursor-pointer"
          onClick={() => setEditing(true)}
        >
          {`R$ ${value.toLocaleString('pt-BR')}`}
        </h2>
      )}
    </div>
  );
}
