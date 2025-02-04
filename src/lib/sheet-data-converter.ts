import {
  TCalendar,
  TCalSheet,
} from "@/redux/features/calendarApiSlice/calendarType";
import * as XLSX from "xlsx";
import { dayCount } from "./date-converter";

// read calendar sheet data
export const readSheetData = (file: Blob): Promise<TCalendar[]> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      alert("No file selected");
      reject(new Error("No file selected"));
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      try {
        const bufferArray = e?.target?.result;
        if (!bufferArray) {
          throw new Error("Failed to read file buffer");
        }

        // Acquiring and Extracting Data
        const workbook = XLSX.read(bufferArray, { type: "buffer" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // Processing Data
        const data = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
        }) as TCalendar[];

        if (data.length === 0) {
          alert("No data found in the file");
          reject(new Error("No data found in the file"));
          return;
        }

        resolve(data);
      } catch (error) {
        console.log(error);
        alert(
          "File reading failed. Please check the file format and try again."
        );
        reject(error);
      }
    };

    fileReader.onerror = (error) => {
      console.log(error);
      alert("Error reading file. Please try again.");
      reject(error);
    };
  });
};

export const transformCalSheetData = (sheetData: TCalSheet) => {
  return sheetData?.events?.reduce(
    (acc, item) => {
      acc.year = sheetData.year;

      if (item.type === "holiday") {
        acc.holidays.push({
          ...item,
          type: "holiday",
          start_date: item.start_date,
          end_date: item.end_date,
          day_count: dayCount(item.start_date, item.end_date),
          reason: item.reason,
        });
      } else if (item.type === "event") {
        acc.events.push({
          ...item,
          type: "event",
          start_date: item.start_date,
          end_date: item.end_date,
          day_count: dayCount(item.start_date, item.end_date),
          reason: item.reason,
        });
      }

      return acc;
    },
    { year: sheetData.year, holidays: [], events: [] } as unknown as TCalendar
  );
};
