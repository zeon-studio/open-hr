import {
  TCalendar,
  TCalSheet,
} from "@/redux/features/calendarApiSlice/calendarType";
import ExcelJS from "exceljs";
import { dayCount } from "./date-converter";

// read calendar sheet data
//
// Replaces the previous `xlsx` (SheetJS community 0.18.5) parser, which is
// no longer maintained on npm and has known prototype-pollution and ReDoS
// CVEs. ExcelJS is actively maintained and yields the same calendar rows.
export const readSheetData = (file: Blob): Promise<TCalendar[]> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      alert("No file selected");
      reject(new Error("No file selected"));
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = async (e) => {
      try {
        const bufferArray = e?.target?.result;
        if (!bufferArray || typeof bufferArray === "string") {
          throw new Error("Failed to read file buffer");
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(bufferArray as ArrayBuffer);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          throw new Error("Workbook contained no sheets");
        }

        // Header row → column-name array
        const headerRow = worksheet.getRow(1);
        const headers: string[] = [];
        headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          headers[colNumber - 1] = String(cell.value ?? "").trim();
        });

        // Data rows → object[] keyed by header
        const data: TCalendar[] = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;
          const obj: Record<string, unknown> = {};
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const key = headers[colNumber - 1];
            if (!key) return;
            const value = cell.value;
            // Coerce to the same string-y shape XLSX produced with raw:false
            if (value instanceof Date) {
              obj[key] = value.toISOString().split("T")[0];
            } else if (
              value !== null &&
              typeof value === "object" &&
              "text" in (value as object)
            ) {
              obj[key] = (value as { text: string }).text;
            } else if (value === null || value === undefined) {
              obj[key] = "";
            } else {
              obj[key] = String(value);
            }
          });
          data.push(obj as unknown as TCalendar);
        });

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
