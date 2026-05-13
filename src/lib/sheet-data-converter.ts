import { TCalendar, TCalSheet } from "@/types/calendar";
import ExcelJS from "exceljs";
import { dayCount } from "./date-converter";

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

        const headerRow = worksheet.getRow(1);
        const headers: string[] = [];
        headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          headers[colNumber - 1] = String(cell.value ?? "").trim();
        });

        const data: TCalendar[] = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;
          const obj: Record<string, unknown> = {};
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const key = headers[colNumber - 1];
            if (!key) return;
            const value = cell.value;
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
          "File reading failed. Please check the file format and try again.",
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
    { year: sheetData.year, holidays: [], events: [] } as unknown as TCalendar,
  );
};
