import { useRef } from "react";
import type { Color } from "../constants";
import { Legend } from "../Legend";
import { useOnWindowResize } from "../hooks";

export const ChartLegend = (
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    { payload }: any,
    categoryColors: Map<string, Color | string>,
    setLegendHeight: React.Dispatch<React.SetStateAction<number>>,
    activeLegend: string | undefined,
    onClick?: (category: string, color: Color | string) => void,
    enableLegendSlider?: boolean,
  ) => {
    const legendRef = useRef<HTMLDivElement>(null);
  
    useOnWindowResize(() => {
      const calculateHeight = (height: number | undefined) =>
        height
          ? Number(height) + 20 // 20px extra padding
          : 60; // default height
      setLegendHeight(calculateHeight(legendRef.current?.clientHeight));
    });
  
    const filteredPayload = payload.filter((item: any) => item.type !== "none");
  
    return (
      <div ref={legendRef} className="flex items-center justify-end">
        <Legend
          categories={filteredPayload.map((entry: any) => entry.value)}
          colors={filteredPayload.map((entry: any) => categoryColors.get(entry.value))}
          onClickLegendItem={onClick}
          activeLegend={activeLegend}
          enableLegendSlider={enableLegendSlider}
        />
      </div>
    );
  };
  