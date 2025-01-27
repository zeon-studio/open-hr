import {
  TCalendar,
  TCalSheet,
} from "@/redux/features/calendarApiSlice/calendarType";
import * as XLSX from "xlsx";
import { dayCount } from "./dateFormat";

// read calendar sheet data
export const readCalSheet = (file: Blob): Promise<TCalendar[]> => {
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
        console.error("File processing error:", error);
        alert(
          "File reading failed. Please check the file format and try again."
        );
        reject(error);
      }
    };

    fileReader.onerror = (error) => {
      console.error("FileReader error:", error);
      alert("Error reading file. Please try again.");
      reject(error);
    };
  });
};

export const transformCalSheetData = (sheetData: TCalSheet) => {
  return sheetData?.events?.reduce(
    (acc, item) => {
      acc.year = sheetData.year;

      if (item.type === "holidays") {
        acc.holidays.push({
          ...item,
          start_date: new Date(item.start_date),
          end_date: new Date(item.end_date),
          day_count: dayCount(
            new Date(item.start_date),
            new Date(item.end_date)
          ),
          reason: item.reason,
        });
      } else if (item.type === "events") {
        acc.events.push({
          ...item,
          start_date: new Date(item.start_date),
          end_date: new Date(item.end_date),
          day_count: dayCount(
            new Date(item.start_date),
            new Date(item.end_date)
          ),
          reason: item.reason,
        });
      }

      return acc;
    },
    { year: sheetData.year, holidays: [], events: [] } as unknown as TCalendar
  );
};
